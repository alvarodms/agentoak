import { describe, expect, it } from "vitest";
import { SymbolTable, parseMapSections, parseNm } from "./symbols.js";

const NM = `
030022c0 0000043c B gMain
020244ec 00000258 B gPlayerParty
080aab40 00000010 t Task_TitleScreen
080ab260 00000016 t MainCB2
080bac20 00000016 t MainCB2
0808656c 0000002c T CB2_Overworld
08000000 T Start
         U undefined_symbol
`;

const MAP = `
 .text          0x080861b8     0x2000 src/overworld.o
 .text          0x080aab40      0xb98 src/title_screen.o
 .text          0x080ba000     0x1000 src/option_menu.o
 ewram_data     0x02021cc4      0x6f8 src/string_util.o
 COMMON         0x030022c0      0x43c src/main.o
 .text          0x08000400       0x10 ../../tools/agbcc/lib/libgcc.a(_divsi3.o)
 *fill*         0x080aab3c        0x4
 .text.very_long_section_name
                0x08100000      0x100 src/long.o
                0x02021fc4                gStringVar4
`;

const table = new SymbolTable(parseNm(NM), parseMapSections(MAP));

describe("parseNm", () => {
  it("reads address, size, type and name, and skips undefined symbols", () => {
    const syms = parseNm(NM);
    expect(syms).toContainEqual({ name: "gMain", address: 0x030022c0, size: 0x43c, type: "B" });
    expect(syms).toContainEqual({ name: "Start", address: 0x08000000, size: 0, type: "T" });
    expect(syms.some((s) => s.name === "undefined_symbol")).toBe(false);
  });
});

describe("parseMapSections", () => {
  it("handles dotless, COMMON, library and wrapped section lines", () => {
    // Sorted by start address; *fill* and symbol lines are not sections.
    expect(parseMapSections(MAP).map((s) => s.object)).toEqual([
      "src/string_util.o",
      "src/main.o",
      "../../tools/agbcc/lib/libgcc.a(_divsi3.o)",
      "src/overworld.o",
      "src/title_screen.o",
      "src/option_menu.o",
      "src/long.o",
    ]);
  });
});

describe("SymbolTable", () => {
  it("finds the object file for an address", () => {
    expect(table.objectFor(0x080ab260)).toBe("src/title_screen.o");
    expect(table.objectFor(0x02021fc4)).toBe("src/string_util.o");
    expect(table.objectFor(0x09000000)).toBeUndefined();
  });

  it("refuses an ambiguous static name unless given its object", () => {
    expect(() => table.get("MainCB2")).toThrow(/ambiguous.*title_screen\.o.*option_menu\.o/);
    expect(table.get("MainCB2", "src/option_menu.o").address).toBe(0x080bac20);
  });

  it("describes thumb callback pointers, naming the file for statics", () => {
    expect(table.describe(0x080ab261)).toBe("MainCB2 (src/title_screen.o)");
    expect(table.describe(0x0808656d)).toBe("CB2_Overworld");
    expect(table.describe(0x08086571)).toBe("CB2_Overworld+0x4");
    expect(table.describe(0)).toBe("NULL");
    expect(table.describe(0x09000001)).toBe("0x09000001");
  });
});
