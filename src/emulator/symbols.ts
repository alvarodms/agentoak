/**
 * Symbol lookup for a built pokeemerald ROM.
 *
 * `arm-none-eabi-nm -S` on pokeemerald.elf lists every symbol, statics
 * included, with its size. The linker map (pokeemerald.map) says which object
 * file each section came from. Together they let the harness read
 * `gPlayerParty` by name, and turn a callback pointer like 0x080ab261 into
 * "MainCB2 (src/title_screen.o)", which matters because a dozen files each
 * define a static MainCB2.
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";

export interface Sym {
  name: string;
  address: number;
  /** Bytes, or 0 when nm reports no size (labels, linker symbols). */
  size: number;
  /** nm type letter: T/t code, D/d data, B/b bss, R/r rodata. Upper case is global. */
  type: string;
}

export interface SectionRange {
  start: number;
  size: number;
  /** Object file, e.g. "src/title_screen.o". */
  object: string;
}

const NM_LINE = /^([0-9a-fA-F]{8})\s+(?:([0-9a-fA-F]{8})\s+)?([A-Za-z])\s+(\S+)$/;

/** Parses `nm -S` output. Lines without an address (undefined symbols) are skipped. */
export function parseNm(text: string): Sym[] {
  const syms: Sym[] = [];
  for (const line of text.split("\n")) {
    const m = NM_LINE.exec(line.trim());
    if (!m) continue;
    syms.push({
      address: parseInt(m[1], 16),
      size: m[2] ? parseInt(m[2], 16) : 0,
      type: m[3],
      name: m[4],
    });
  }
  return syms;
}

// " .text          0x080aab40      0xb98 src/title_screen.o"
// " ewram_data     0x02021fc4      0x3e8 src/string_util.o"
// " COMMON         0x...           0x... src/main.o"
// " .text          0x...           0x... ../../tools/agbcc/lib/libgcc.a(_divsi3.o)"
// A long section name pushes the address onto the next line, so the section
// name is optional.
const MAP_INPUT_SECTION = /^\s*(?:[\w.]+)?\s+0x([0-9a-fA-F]+)\s+0x([0-9a-fA-F]+)\s+(\S+\.o\)?)\s*$/;

/** Parses the linker map's input-section lines into address ranges, sorted by start. */
export function parseMapSections(text: string): SectionRange[] {
  const ranges: SectionRange[] = [];
  for (const line of text.split("\n")) {
    const m = MAP_INPUT_SECTION.exec(line);
    if (!m) continue;
    const size = parseInt(m[2], 16);
    if (size === 0) continue;
    ranges.push({ start: parseInt(m[1], 16), size, object: m[3] });
  }
  return ranges.sort((a, b) => a.start - b.start);
}

function isGlobal(sym: Sym): boolean {
  return sym.type === sym.type.toUpperCase();
}

export class SymbolTable {
  private readonly byName = new Map<string, Sym[]>();
  /** Sized symbols sorted by address, for reverse lookup. */
  private readonly sorted: Sym[];

  constructor(symbols: Sym[], private readonly sections: SectionRange[] = []) {
    for (const sym of symbols) {
      const list = this.byName.get(sym.name);
      if (list) list.push(sym);
      else this.byName.set(sym.name, [sym]);
    }
    this.sorted = symbols.filter((s) => s.size > 0).sort((a, b) => a.address - b.address);
  }

  /** Loads symbols from an ELF with nm, plus object ranges from its linker map if present. */
  static load(elfPath: string, mapPath?: string, nm = "arm-none-eabi-nm"): SymbolTable {
    const nmOut = execFileSync(nm, ["-S", "--defined-only", elfPath], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const sections = mapPath && fs.existsSync(mapPath) ? parseMapSections(fs.readFileSync(mapPath, "utf8")) : [];
    return new SymbolTable(parseNm(nmOut), sections);
  }

  has(name: string): boolean {
    return this.byName.has(name);
  }

  /**
   * The symbol called `name`. A global wins over same-named statics; if only
   * statics exist and there are several, the name is ambiguous and this
   * throws (pass `object` to pick one, e.g. "src/title_screen.o").
   */
  get(name: string, object?: string): Sym {
    const all = this.byName.get(name);
    if (!all) throw new Error(`unknown symbol ${name}`);
    if (object) {
      const match = all.find((s) => this.objectFor(s.address) === object);
      if (!match) throw new Error(`symbol ${name} not found in ${object}`);
      return match;
    }
    const globals = all.filter(isGlobal);
    if (globals.length === 1) return globals[0];
    if (all.length === 1) return all[0];
    const where = all.map((s) => this.objectFor(s.address) ?? `0x${s.address.toString(16)}`).join(", ");
    throw new Error(`symbol ${name} is ambiguous (${where}); pass its object file`);
  }

  address(name: string, object?: string): number {
    return this.get(name, object).address;
  }

  /** The object file whose section contains `address`, if the map was loaded. */
  objectFor(address: number): string | undefined {
    let lo = 0;
    let hi = this.sections.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const s = this.sections[mid];
      if (address < s.start) hi = mid - 1;
      else if (address >= s.start + s.size) lo = mid + 1;
      else return s.object;
    }
    return undefined;
  }

  /** The sized symbol containing `address`, or undefined. */
  symbolAt(address: number): Sym | undefined {
    let lo = 0;
    let hi = this.sorted.length - 1;
    let best: Sym | undefined;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this.sorted[mid].address <= address) {
        best = this.sorted[mid];
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    return best && address < best.address + best.size ? best : undefined;
  }

  /**
   * Human-readable name for a pointer, e.g. a gMain callback:
   * "MainCB2 (src/title_screen.o)", "CB2_Overworld+0x4", "NULL" or "0x0809abcd".
   * Thumb function pointers have bit 0 set; it is ignored.
   */
  describe(pointer: number): string {
    if (pointer === 0) return "NULL";
    const address = pointer & ~1;
    const sym = this.symbolAt(address);
    if (!sym) return `0x${(pointer >>> 0).toString(16).padStart(8, "0")}`;
    const offset = address - sym.address;
    const base = offset ? `${sym.name}+0x${offset.toString(16)}` : sym.name;
    if (isGlobal(sym)) return base;
    const object = this.objectFor(sym.address);
    return object ? `${base} (${object})` : base;
  }
}
