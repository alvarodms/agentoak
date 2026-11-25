/**
 * Sound effect checks for playtests (expectSound / expectNoSound).
 *
 * The m4a engine plays sound effects on three music players, gMPlayInfo_SE1..SE3
 * (struct MusicPlayerInfo, include/gba/m4a_internal.h). Each starts with
 * `songHeader` (u32, offset 0: the song playing or last played) and `status`
 * (u32, offset 4: bits 0-15 are the tracks still playing, bit 31 is "paused").
 * A song name like "SE_M_SKETCH" is a gSongTable index (include/constants/songs.h);
 * each gSongTable entry is 8 bytes, u32 header + u16 ms + u16 me.
 */

import type { EmulatorSession } from "./session.js";

/** One SE music player at one moment. */
export interface SePlayerSample {
  header: number;
  status: number;
}

export const SE_PLAYERS = ["gMPlayInfo_SE1", "gMPlayInfo_SE2", "gMPlayInfo_SE3"] as const;
const SONG_TABLE_ENTRY_SIZE = 8;
const MUSICPLAYER_STATUS_TRACK = 0xffff;
const MUSICPLAYER_STATUS_PAUSE = 0x80000000;

/** True while the player has tracks playing and is not paused. */
export function sePlayerActive(p: SePlayerSample): boolean {
  return (p.status & MUSICPLAYER_STATUS_TRACK) !== 0 && ((p.status & MUSICPLAYER_STATUS_PAUSE) >>> 0) === 0;
}

/**
 * Index of the SE player on which `header` started between two samples, or -1.
 * A start is: the player now holds `header` and, before, it held another song, or held this one
 * stopped and now plays it. A new header counts even if it has already finished, so two samples
 * far apart still see a sound that played in between (m4a sets header and tracks together).
 */
export function findSoundStart(prev: readonly SePlayerSample[], cur: readonly SePlayerSample[], header: number): number {
  for (let i = 0; i < cur.length; i++) {
    const before = prev[i];
    const now = cur[i];
    if (now.header !== header) continue;
    if (!before || before.header !== header) return i;
    if (!sePlayerActive(before) && sePlayerActive(now)) return i;
  }
  return -1;
}

/** Reads songHeader and status of the three SE players. */
export async function sampleSePlayers(s: EmulatorSession): Promise<SePlayerSample[]> {
  const out: SePlayerSample[] = [];
  for (const name of SE_PLAYERS) {
    const buf = await s.read(s.symbols.address(name), 8);
    out.push({ header: buf.readUInt32LE(0), status: buf.readUInt32LE(4) });
  }
  return out;
}

/** The SongHeader address gSongTable gives a song constant, e.g. "SE_M_SKETCH". */
export async function songHeaderAddress(s: EmulatorSession, song: string): Promise<number> {
  const id = s.constant(song);
  return s.readU32(s.symbols.address("gSongTable") + id * SONG_TABLE_ENTRY_SIZE);
}
