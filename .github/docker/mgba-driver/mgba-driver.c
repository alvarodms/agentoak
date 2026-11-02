/*
 * mgba-driver — a headless, line-oriented front end for libmgba.
 *
 * The playtest harness (src/emulator/) spawns this process and talks to it
 * over stdin/stdout: one command per line in, one JSON object per line out.
 * It has no window, no audio, and no frame pacing, so it runs as fast as the
 * CPU allows. Emulated time (and the cartridge RTC) only advances when a
 * command runs frames, so the same command sequence gives the same result.
 *
 * Commands (numbers accept decimal or 0x-prefixed hex):
 *   load <rom> [<sav>]        load a ROM (and optionally a save file), then reset
 *   reset                     reset the console
 *   rtc <epoch_ms>            set the RTC start time (default 2026-01-01 12:00 UTC)
 *   run <frames>              run N frames with the currently held keys
 *   keys <mask>               set the held keys (bitmask, see below)
 *   press <mask> <hold> [<release>]
 *                             hold keys for <hold> frames, then release them
 *                             for <release> frames (default 1)
 *   read <addr> <len>         read bytes from the bus, returned as hex
 *   write <addr> <hex>        write bytes to the bus (RAM/IO; not ROM)
 *   screenshot <path>         write the current frame as a 240x160 PNG
 *   save_state <path>         write a savestate
 *   load_state <path>         load a savestate
 *   info                      frame counter, game title and code
 *   quit                      exit
 *
 * Key mask bits: A=1 B=2 SELECT=4 START=8 RIGHT=16 LEFT=32 UP=64 DOWN=128
 *                R=256 L=512
 *
 * Every reply is {"ok":true,...} or {"ok":false,"error":"..."} on one line.
 */
#include <mgba/core/config.h>
#include <mgba/core/core.h>
#include <mgba/core/interface.h>
#include <mgba/core/log.h>
#include <mgba/core/serialize.h>
#include <mgba-util/vfs.h>

#include <ctype.h>
#include <fcntl.h>
#include <stdarg.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_LINE 65536
#define MAX_READ 0x10000
#define DEFAULT_RTC_EPOCH_MS 1767268800000LL /* 2026-01-01T12:00:00Z */

static struct mCore* core = NULL;
static color_t* videoBuffer = NULL;
static struct mCoreOptions coreOpts = { 0 };
static int64_t rtcEpochMs = DEFAULT_RTC_EPOCH_MS;

/* Only warnings and errors reach stderr; stdout is reserved for replies. */
static void quietLog(struct mLogger* logger, int category, enum mLogLevel level, const char* format, va_list args) {
	(void) logger;
	if (!(level & (mLOG_WARN | mLOG_ERROR | mLOG_FATAL))) {
		return;
	}
	fprintf(stderr, "[mgba %s] ", mLogCategoryName(category));
	vfprintf(stderr, format, args);
	fputc('\n', stderr);
}

static struct mLogger logger = { .log = quietLog, .filter = NULL };

static void replyError(const char* fmt, ...) {
	char msg[512];
	va_list args;
	va_start(args, fmt);
	vsnprintf(msg, sizeof(msg), fmt, args);
	va_end(args);
	/* Error messages are ours and contain no quotes or backslashes, except
	 * for paths, so escape those two characters to keep the line valid JSON. */
	fputs("{\"ok\":false,\"error\":\"", stdout);
	for (const char* c = msg; *c; ++c) {
		if (*c == '"' || *c == '\\') {
			fputc('\\', stdout);
		}
		fputc(*c, stdout);
	}
	fputs("\"}\n", stdout);
	fflush(stdout);
}

static void replyOk(const char* extraJson) {
	if (extraJson && *extraJson) {
		printf("{\"ok\":true,%s}\n", extraJson);
	} else {
		puts("{\"ok\":true}");
	}
	fflush(stdout);
}

static bool parseU32(const char* s, uint32_t* out) {
	if (!s || !*s) {
		return false;
	}
	char* end;
	unsigned long v = strtoul(s, &end, 0);
	if (*end) {
		return false;
	}
	*out = (uint32_t) v;
	return true;
}

static void unloadCore(void) {
	if (!core) {
		return;
	}
	core->unloadROM(core);
	mCoreConfigFreeOpts(&coreOpts);
	mCoreConfigDeinit(&core->config);
	core->deinit(core);
	core = NULL;
}

static void applyRtc(void) {
	core->rtc.override = RTC_FAKE_EPOCH;
	core->rtc.value = rtcEpochMs;
}

static void runFrames(uint32_t frames) {
	for (uint32_t i = 0; i < frames; ++i) {
		core->runFrame(core);
	}
}

static void cmdLoad(const char* romPath, const char* savPath) {
	unloadCore();
	core = mCoreFind(romPath);
	if (!core) {
		replyError("not a recognised ROM: %s", romPath);
		return;
	}
	if (!core->init(core)) {
		core = NULL;
		replyError("core init failed");
		return;
	}
	unsigned width, height;
	core->desiredVideoDimensions(core, &width, &height);
	core->setVideoBuffer(core, videoBuffer, 256);
	if (!mCoreLoadFile(core, romPath)) {
		core->deinit(core);
		core = NULL;
		replyError("failed to load ROM: %s", romPath);
		return;
	}

	/* Never read the user's mGBA config file: a fresh default config keeps
	 * runs identical across machines. */
	mCoreConfigInit(&core->config, NULL);
	memset(&coreOpts, 0, sizeof(coreOpts));
	coreOpts.audioSync = false;
	coreOpts.videoSync = false;
	coreOpts.skipBios = true;
	mCoreConfigLoadDefaults(&core->config, &coreOpts);
	mCoreConfigSetDefaultValue(&core->config, "idleOptimization", "detect");
	mCoreLoadConfig(core);
	if (savPath) {
		struct VFile* sav = VFileOpen(savPath, O_CREAT | O_RDWR);
		if (!sav || !core->loadSave(core, sav)) {
			unloadCore();
			replyError("failed to load save: %s", savPath);
			return;
		}
	}
	applyRtc();
	core->reset(core);

	char title[17] = { 0 };
	char code[9] = { 0 };
	core->getGameTitle(core, title);
	core->getGameCode(core, code);
	char extra[128];
	snprintf(extra, sizeof(extra), "\"title\":\"%s\",\"code\":\"%s\",\"width\":%u,\"height\":%u", title, code, width, height);
	replyOk(extra);
}

static void cmdRead(uint32_t addr, uint32_t len) {
	if (len > MAX_READ) {
		replyError("read length %u exceeds %u", len, MAX_READ);
		return;
	}
	char* hex = malloc(len * 2 + 64);
	char* p = hex + sprintf(hex, "\"addr\":%u,\"data\":\"", addr);
	static const char digits[] = "0123456789abcdef";
	for (uint32_t i = 0; i < len; ++i) {
		uint8_t b = (uint8_t) core->busRead8(core, addr + i);
		*p++ = digits[b >> 4];
		*p++ = digits[b & 0xF];
	}
	*p++ = '"';
	*p = '\0';
	replyOk(hex);
	free(hex);
}

static int hexNibble(char c) {
	if (c >= '0' && c <= '9') return c - '0';
	c = (char) tolower((unsigned char) c);
	if (c >= 'a' && c <= 'f') return c - 'a' + 10;
	return -1;
}

static void cmdWrite(uint32_t addr, const char* hex) {
	size_t n = strlen(hex);
	if (n == 0 || n % 2) {
		replyError("write needs an even number of hex digits");
		return;
	}
	for (size_t i = 0; i < n; ++i) {
		if (hexNibble(hex[i]) < 0) {
			replyError("invalid hex digit in write data");
			return;
		}
	}
	for (size_t i = 0; i < n / 2; ++i) {
		uint8_t b = (uint8_t) ((hexNibble(hex[i * 2]) << 4) | hexNibble(hex[i * 2 + 1]));
		core->busWrite8(core, addr + (uint32_t) i, b);
	}
	replyOk(NULL);
}

static void cmdScreenshot(const char* path) {
	struct VFile* vf = VFileOpen(path, O_CREAT | O_TRUNC | O_WRONLY);
	if (!vf) {
		replyError("cannot open %s", path);
		return;
	}
	bool ok = mCoreTakeScreenshotVF(core, vf);
	vf->close(vf);
	if (!ok) {
		replyError("screenshot failed");
		return;
	}
	replyOk(NULL);
}

static void cmdState(const char* path, bool save) {
	struct VFile* vf = VFileOpen(path, save ? (O_CREAT | O_TRUNC | O_RDWR) : O_RDONLY);
	if (!vf) {
		replyError("cannot open %s", path);
		return;
	}
	/* Savedata stays out of states: the save file is the source of truth. */
	bool ok = save ? mCoreSaveStateNamed(core, vf, SAVESTATE_RTC | SAVESTATE_METADATA)
	               : mCoreLoadStateNamed(core, vf, SAVESTATE_RTC);
	vf->close(vf);
	if (!ok) {
		replyError(save ? "save_state failed" : "load_state failed (state from another build?)");
		return;
	}
	replyOk(NULL);
}

static void cmdInfo(void) {
	char title[17] = { 0 };
	char code[9] = { 0 };
	core->getGameTitle(core, title);
	core->getGameCode(core, code);
	char extra[160];
	snprintf(extra, sizeof(extra), "\"frame\":%u,\"keys\":%u,\"title\":\"%s\",\"code\":\"%s\"",
	         core->frameCounter(core), core->getKeys(core), title, code);
	replyOk(extra);
}

/* Splits `line` in place into at most `max` whitespace-separated tokens. */
static int tokenize(char* line, char** argv, int max) {
	int argc = 0;
	char* save = NULL;
	for (char* tok = strtok_r(line, " \t\r\n", &save); tok && argc < max; tok = strtok_r(NULL, " \t\r\n", &save)) {
		argv[argc++] = tok;
	}
	return argc;
}

int main(void) {
	mLogSetDefaultLogger(&logger);
	videoBuffer = calloc(256 * 256, BYTES_PER_PIXEL);
	char* line = malloc(MAX_LINE);
	puts("{\"ok\":true,\"ready\":\"mgba-driver 1\"}");
	fflush(stdout);

	while (fgets(line, MAX_LINE, stdin)) {
		char* argv[8];
		int argc = tokenize(line, argv, 8);
		if (argc == 0) {
			continue;
		}
		const char* cmd = argv[0];
		uint32_t a = 0, b = 0, c = 1;

		if (!strcmp(cmd, "quit")) {
			replyOk(NULL);
			break;
		}
		if (!strcmp(cmd, "load")) {
			if (argc < 2) {
				replyError("usage: load <rom> [<sav>]");
			} else {
				cmdLoad(argv[1], argc > 2 ? argv[2] : NULL);
			}
			continue;
		}
		if (!strcmp(cmd, "rtc")) {
			char* end;
			long long v = argc > 1 ? strtoll(argv[1], &end, 0) : 0;
			if (argc < 2 || *end) {
				replyError("usage: rtc <epoch_ms>");
				continue;
			}
			rtcEpochMs = v;
			if (core) {
				applyRtc();
			}
			replyOk(NULL);
			continue;
		}
		if (!core) {
			replyError("no ROM loaded");
			continue;
		}

		if (!strcmp(cmd, "reset")) {
			applyRtc();
			core->reset(core);
			replyOk(NULL);
		} else if (!strcmp(cmd, "run")) {
			if (argc < 2 || !parseU32(argv[1], &a)) {
				replyError("usage: run <frames>");
				continue;
			}
			runFrames(a);
			cmdInfo();
		} else if (!strcmp(cmd, "keys")) {
			if (argc < 2 || !parseU32(argv[1], &a) || a > 0x3FF) {
				replyError("usage: keys <mask 0-0x3FF>");
				continue;
			}
			core->setKeys(core, a);
			replyOk(NULL);
		} else if (!strcmp(cmd, "press")) {
			if (argc < 3 || !parseU32(argv[1], &a) || a > 0x3FF || !parseU32(argv[2], &b) || (argc > 3 && !parseU32(argv[3], &c))) {
				replyError("usage: press <mask> <hold> [<release>]");
				continue;
			}
			core->setKeys(core, a);
			runFrames(b);
			core->setKeys(core, 0);
			runFrames(c);
			cmdInfo();
		} else if (!strcmp(cmd, "read")) {
			if (argc < 3 || !parseU32(argv[1], &a) || !parseU32(argv[2], &b)) {
				replyError("usage: read <addr> <len>");
				continue;
			}
			cmdRead(a, b);
		} else if (!strcmp(cmd, "write")) {
			if (argc < 3 || !parseU32(argv[1], &a)) {
				replyError("usage: write <addr> <hex>");
				continue;
			}
			cmdWrite(a, argv[2]);
		} else if (!strcmp(cmd, "screenshot")) {
			if (argc < 2) {
				replyError("usage: screenshot <path>");
				continue;
			}
			cmdScreenshot(argv[1]);
		} else if (!strcmp(cmd, "save_state") || !strcmp(cmd, "load_state")) {
			if (argc < 2) {
				replyError("usage: %s <path>", cmd);
				continue;
			}
			cmdState(argv[1], cmd[0] == 's');
		} else if (!strcmp(cmd, "info")) {
			cmdInfo();
		} else {
			replyError("unknown command: %s", cmd);
		}
	}

	unloadCore();
	free(line);
	free(videoBuffer);
	return 0;
}
