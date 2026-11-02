import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { POKEEMERALD_DIR } from "../utils/paths.js";
import { decodeGameText, parseCharmap } from "./charmap.js";

const FIXTURE = `
' '         = 00
'é'         = 1B
'A'         = BB
'E'         = BF
'H'         = C2
'L'         = C6
'O'         = C9
'e'         = D9
'.'         = AD
'\\''         = B4
LV          = 34
PK          = 53
PKMN        = 53 54
'$'         = FF

@ Hiragana
'あ' = BB

@ string placeholders
PLAYER         = FD 01
STR_VAR_1      = FD 02

@ battle string placeholders
B_BUFF2 = FD 01

@ more text functions
COLOR = FC 01 @ use a color listed below right after
`;

const map = parseCharmap(FIXTURE);
const bytes = (...b: number[]) => Uint8Array.from(b);

describe("parseCharmap", () => {
  it("keeps the Latin glyph when a Japanese block reuses the byte", () => {
    expect(map.glyphs.get(0xbb)).toBe("A");
  });

  it("maps named glyphs to readable text, including the PKMN pair", () => {
    expect(map.glyphs.get(0x34)).toBe("Lv");
    expect(map.glyphs.get(0x53)).toBe("PK");
    expect(map.glyphs.get(0x54)).toBe("MN");
  });

  it("prefers field placeholders over battle ones for the same byte", () => {
    expect(map.placeholders.get(0x01)).toBe("PLAYER");
  });
});

describe("decodeGameText", () => {
  it("stops at EOS", () => {
    expect(decodeGameText(bytes(0xc2, 0xbf, 0xff, 0xc6), map)).toBe("HE");
  });

  it("turns \\n and \\l into newlines and \\p into a blank line", () => {
    expect(decodeGameText(bytes(0xbb, 0xfe, 0xbb, 0xfa, 0xbb, 0xfb, 0xbb, 0xff), map)).toBe("A\nA\nA\n\nA");
  });

  it("names placeholders and drops formatting codes with their arguments", () => {
    // FC 01 <colour> is 2 bytes after FC; FC 04 takes 3 colour bytes.
    const text = bytes(0xfd, 0x01, 0xfc, 0x01, 0x04, 0xc2, 0xfc, 0x04, 0x01, 0x02, 0x03, 0xbb, 0xff);
    expect(decodeGameText(text, map)).toBe("{PLAYER}HA");
  });

  it("shows unknown bytes instead of hiding them", () => {
    expect(decodeGameText(bytes(0x99, 0xff), map)).toBe("{0x99}");
  });

  it("decodes against the hack's real charmap", () => {
    const real = parseCharmap(fs.readFileSync(path.join(POKEEMERALD_DIR, "charmap.txt"), "utf8"));
    // "POKéMON" with the accented é and a trailing {PAUSE_UNTIL_PRESS} (FC 09)
    const poke = [0xca, 0xc9, 0xc5, 0x1b, 0xc7, 0xc9, 0xc8];
    expect(decodeGameText(bytes(...poke, 0xfc, 0x09, 0xff), real)).toBe("POKéMON");
  });
});
