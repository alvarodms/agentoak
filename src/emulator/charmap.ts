/**
 * Decodes game-encoded text (as it sits in RAM or ROM) into readable strings,
 * using the hack's own pokeemerald/charmap.txt, so the harness can report
 * what a dialogue box says without OCR.
 */

import fs from "node:fs";

const EOS = 0xff;
const CHAR_NEWLINE = 0xfe;
const PLACEHOLDER_BEGIN = 0xfd;
const EXT_CTRL_CODE_BEGIN = 0xfc;
const CHAR_PROMPT_CLEAR = 0xfb;
const CHAR_PROMPT_SCROLL = 0xfa;
const CHAR_EXTRA_SYMBOL = 0xf9;
const CHAR_KEYPAD_ICON = 0xf8;
const CHAR_DYNAMIC = 0xf7;

/**
 * Bytes taken by an FC control code, counting the code byte but not the FC.
 * Mirrors GetExtCtrlCodeLength() in pokeemerald/src/string_util.c; codes
 * outside the table take 1.
 */
const EXT_CTRL_CODE_LENGTHS = [1, 2, 2, 2, 4, 2, 2, 1, 2, 1, 1, 3, 2, 2, 2, 1, 3, 2, 2, 2, 2, 1, 1, 1, 1];

/** Readable forms for the named single-byte glyphs in the Latin block. */
const GLYPH_NAMES: Record<string, string> = {
  LV: "Lv",
  PK: "PK",
  UP_ARROW: "↑",
  DOWN_ARROW: "↓",
  LEFT_ARROW: "←",
  RIGHT_ARROW: "→",
};

export interface Charmap {
  /** Byte → glyph for single-byte characters (Latin block only). */
  glyphs: Map<number, string>;
  /** FD argument → placeholder name, e.g. 0x01 → "PLAYER". */
  placeholders: Map<number, string>;
}

const ENTRY = /^('(?:\\'|[^'])+'|[A-Z_0-9]+)\s*=\s*((?:[0-9A-Fa-f]{2}\s*)+)(?:@.*)?$/;

/** Parses charmap.txt. The Japanese blocks reuse byte values and are skipped. */
export function parseCharmap(text: string): Charmap {
  const glyphs = new Map<number, string>();
  const placeholders = new Map<number, string>();
  let inJapanese = false;

  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (line.startsWith("@")) {
      if (/^@ (Hiragana|Katakana|Japanese)/.test(line)) inJapanese = true;
      else inJapanese = false;
      continue;
    }
    const m = ENTRY.exec(line);
    if (!m) continue;
    const bytes = m[2].trim().split(/\s+/).map((b) => parseInt(b, 16));
    const key = m[1];

    if (key.startsWith("'")) {
      if (inJapanese || bytes.length !== 1) continue;
      const glyph = key.slice(1, -1).replace(/^\\'$/, "'");
      if (!glyphs.has(bytes[0])) glyphs.set(bytes[0], glyph);
      continue;
    }
    if (bytes.length === 1 && GLYPH_NAMES[key] && !glyphs.has(bytes[0])) {
      glyphs.set(bytes[0], GLYPH_NAMES[key]);
    } else if (bytes.length === 2 && bytes[0] === PLACEHOLDER_BEGIN && !placeholders.has(bytes[1])) {
      // Field placeholders come before the battle (B_*) ones in the file,
      // so first-wins keeps PLAYER rather than B_BUFF2 for FD 01.
      placeholders.set(bytes[1], key);
    } else if (key === "PKMN" && bytes.length === 2 && !glyphs.has(bytes[1])) {
      glyphs.set(bytes[1], "MN");
    }
  }
  return { glyphs, placeholders };
}

export function loadCharmap(path: string): Charmap {
  return parseCharmap(fs.readFileSync(path, "utf8"));
}

/**
 * Decodes bytes up to EOS (0xFF) or the end of the buffer.
 *
 * Line breaks (\n, \l) become "\n" and paragraph breaks (\p) become "\n\n".
 * Placeholders stay symbolic ("{PLAYER}"), formatting codes (colours, fonts,
 * pauses, sounds) are dropped, and unknown bytes show as "{0xNN}".
 */
export function decodeGameText(bytes: Uint8Array, charmap: Charmap): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    switch (b) {
      case EOS:
        return out;
      case CHAR_NEWLINE:
      case CHAR_PROMPT_SCROLL:
        out += "\n";
        break;
      case CHAR_PROMPT_CLEAR:
        out += "\n\n";
        break;
      case PLACEHOLDER_BEGIN: {
        const id = bytes[++i];
        out += `{${charmap.placeholders.get(id) ?? `PLACEHOLDER_${id}`}}`;
        break;
      }
      case EXT_CTRL_CODE_BEGIN: {
        const code = bytes[i + 1];
        i += EXT_CTRL_CODE_LENGTHS[code] ?? 1;
        break;
      }
      case CHAR_KEYPAD_ICON:
      case CHAR_EXTRA_SYMBOL:
      case CHAR_DYNAMIC:
        i += 1; // one argument byte; the icon itself carries no text
        break;
      default:
        out += charmap.glyphs.get(b) ?? `{0x${b.toString(16).padStart(2, "0")}}`;
    }
  }
  return out;
}
