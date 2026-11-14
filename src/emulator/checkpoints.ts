/**
 * Story checkpoints: a named save state a scenario can start from instead of
 * listing thirty flags. `{"checkpoint": "slateport_arrival"}` boots on the
 * Route 109 dock just after Mr. Briney's sail from Dewford, with the flags and
 * vars a real save has at that moment. The test's own flags, clearFlags, vars
 * and position go on top (the test wins).
 *
 * Every value names the script line it was checked against. Temp flags and
 * vars (FLAG_TEMP_*, VAR_TEMP_*) are reset on every warp, so a checkpoint
 * can't hold them; applyCheckpoint refuses one.
 */

import type { Scenario } from "./scenario.js";

export interface Checkpoint {
  flags: string[];
  clearFlags?: string[];
  vars: Record<string, number>;
  map: string;
  x: number;
  y: number;
}

export const CHECKPOINT_NAMES = ["slateport_arrival", "mauville_pre_wattson"] as const;
export type CheckpointName = (typeof CHECKPOINT_NAMES)[number];

/* Paths below are under pokeemerald/. Defaults not listed come from data/scripts/new_game.inc. */
const SLATEPORT_ARRIVAL: Checkpoint = {
  flags: [
    // Starter and Pokédex: data/maps/LittlerootTown_ProfessorBirchsLab/scripts.inc:596 (FIELD NOTES), :621 (ADVENTURE_STARTED)
    "FLAG_SYS_POKEMON_GET",
    "FLAG_SYS_POKEDEX_GET",
    "FLAG_ADVENTURE_STARTED",
    "FLAG_RECEIVED_FIELD_NOTES",
    // PokéNav: data/maps/RustboroCity_DevonCorp_3F/scripts.inc:55-56; match call data/maps/RustboroCity/scripts.inc:52,77
    "FLAG_SYS_POKENAV_GET",
    "FLAG_RECEIVED_POKENAV",
    "FLAG_HAS_MATCH_CALL",
    "FLAG_ADDED_MATCH_CALL_TO_POKENAV",
    // Badges: data/maps/RustboroCity_Gym/scripts.inc:18-19, data/maps/DewfordTown_Gym/scripts.inc:150-151
    "FLAG_BADGE01_GET",
    "FLAG_DEFEATED_RUSTBORO_GYM",
    "FLAG_BADGE02_GET",
    "FLAG_DEFEATED_DEWFORD_GYM",
    "FLAG_VISITED_OLDALE_TOWN",
    "FLAG_VISITED_PETALBURG_CITY",
    "FLAG_VISITED_RUSTBORO_CITY",
    "FLAG_VISITED_DEWFORD_TOWN",
    // Set by SlateportCity_EventScript_EnterSlateport (data/maps/SlateportCity/scripts.inc:20) on the first walk in
    "FLAG_VISITED_SLATEPORT_CITY",
    // data/maps/GraniteCave_StevensRoom/scripts.inc:10
    "FLAG_DELIVERED_STEVEN_LETTER",
    // Woods grunt scene over: removeobject at data/maps/PetalburgWoods/scripts.inc:117 (grunt), :140 (Devon employee)
    "FLAG_HIDE_PETALBURG_WOODS_AQUA_GRUNT",
    "FLAG_HIDE_PETALBURG_WOODS_DEVON_EMPLOYEE",
    // Devon Goods chain: data/maps/Route116/scripts.inc:55, RusturfTunnel/scripts.inc:335, RustboroCity/scripts.inc:600
    "FLAG_MET_DEVON_EMPLOYEE",
    "FLAG_RECOVERED_DEVON_GOODS",
    "FLAG_RETURNED_DEVON_GOODS",
    // Rustboro rival: data/maps/RustboroCity/scripts.inc:831,880; hidden after: Route104_MrBrineysHouse/scripts.inc:80-81
    "FLAG_MET_RIVAL_RUSTBORO",
    "FLAG_DEFEATED_RIVAL_RUSTBORO",
    "FLAG_HIDE_RUSTBORO_CITY_RIVAL",
    "FLAG_HIDE_ROUTE_104_RIVAL",
    // data/maps/Route104_MrBrineysHouse/scripts.inc:32 (first sail)
    "FLAG_MR_BRINEY_SAILING_INTRO",
    // Briney at Route 109: the hide set of EventScript_MoveMrBrineyToRoute109, data/event_scripts.s:615-621
    "FLAG_HIDE_ROUTE_104_MR_BRINEY",
    "FLAG_HIDE_ROUTE_104_MR_BRINEY_BOAT",
    "FLAG_HIDE_BRINEYS_HOUSE_MR_BRINEY",
    "FLAG_HIDE_BRINEYS_HOUSE_PEEKO",
    "FLAG_HIDE_MR_BRINEY_DEWFORD_TOWN",
    "FLAG_HIDE_MR_BRINEY_BOAT_DEWFORD_TOWN",
  ],
  // Shown on Route 109: data/event_scripts.s:622-623 and DewfordTown_EventScript_SailToSlateport (data/maps/DewfordTown/scripts.inc:167,169).
  // FLAG_DELIVERED_DEVON_GOODS stays unset (set only at data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc:80).
  clearFlags: ["FLAG_HIDE_ROUTE_109_MR_BRINEY", "FLAG_HIDE_ROUTE_109_MR_BRINEY_BOAT"],
  vars: {
    // VAR_BRINEY_LOCATION=3: Route 109 (data/event_scripts.s:591 ResetMrBriney -> MoveMrBrineyToRoute109; :651 SetBrineyLocation_Route109)
    VAR_BRINEY_LOCATION: 3,
    // VAR_RUSTBORO_CITY_STATE=8: after the rival/Briney's cottage (data/maps/Route104_MrBrineysHouse/scripts.inc:78); Rustboro OnFrame waits on 6 (RustboroCity/scripts.inc:28)
    VAR_RUSTBORO_CITY_STATE: 8,
    // VAR_ROUTE104_STATE=2: Route104_MrBrineysHouse/scripts.inc:79; Route104 coord events want 0 (22,62/23,62) or 1 (17,51), so none fire
    VAR_ROUTE104_STATE: 2,
    // VAR_PETALBURG_WOODS_STATE=1: data/maps/PetalburgWoods/scripts.inc:141 (grunt scene done)
    VAR_PETALBURG_WOODS_STATE: 1,
    // VAR_DEVON_CORP_3F_STATE=1: data/maps/RustboroCity_DevonCorp_3F/scripts.inc:69; its OnFrame/OnWarp want 0 (:17, :25)
    VAR_DEVON_CORP_3F_STATE: 1,
    // VAR_BRINEY_HOUSE_STATE=1: data/maps/RusturfTunnel/scripts.inc:337, read at Route104_MrBrineysHouse/scripts.inc:7
    VAR_BRINEY_HOUSE_STATE: 1,
  },
  // Tile 21,23: SailToSlateport ends with the boat on 21,26, the player walking up 3 (DewfordTown_Movement_ExitBoatSlateport,
  // data/maps/DewfordTown/scripts.inc:572-576) and Briney up 2 to 21,24 (:583-586). Route109 has no coord events.
  map: "MAP_ROUTE109",
  x: 21,
  y: 23,
};

const MAUVILLE_PRE_WATTSON: Checkpoint = {
  flags: [
    ...SLATEPORT_ARRIVAL.flags,
    // data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc:80 (goods), :78 (Route 110 Aqua gone)
    "FLAG_DELIVERED_DEVON_GOODS",
    "FLAG_HIDE_ROUTE_110_TEAM_AQUA",
    // The museum's grunts left: data/maps/SlateportCity_OceanicMuseum_2F/scripts.inc:65
    "FLAG_HIDE_SLATEPORT_CITY_OCEANIC_MUSEUM_AQUA_GRUNTS",
    // The dock sent the player to the museum and the street queue left: data/maps/SlateportCity_SternsShipyard_1F/scripts.inc:17-18
    "FLAG_DOCK_REJECTED_DEVON_GOODS",
    "FLAG_HIDE_SLATEPORT_CITY_TEAM_AQUA",
    // Route 110 rival battle over: removeobject LOCALID_ROUTE110_RIVAL, data/maps/Route110/scripts.inc:471 (object flag FLAG_HIDE_ROUTE_110_RIVAL)
    "FLAG_HIDE_ROUTE_110_RIVAL",
    // Birch registered on Route 110: data/maps/Route110/scripts.inc:626
    "FLAG_ENABLE_PROF_BIRCH_MATCH_CALL",
    // Set by MauvilleCity_OnTransition anyway (data/maps/MauvilleCity/scripts.inc:6)
    "FLAG_VISITED_MAUVILLE_CITY",
  ],
  // Wally's scene pending: FLAG_DEFEATED_WALLY_MAUVILLE (set only at data/maps/MauvilleCity/scripts.inc:158), FLAG_HIDE_MAUVILLE_CITY_WALLY
  // and FLAG_HIDE_MAUVILLE_CITY_WALLYS_UNCLE are all clear after new_game.inc, so the checkpoint leaves them alone.
  clearFlags: [...(SLATEPORT_ARRIVAL.clearFlags ?? [])],
  vars: {
    ...SLATEPORT_ARRIVAL.vars,
    // VAR_SLATEPORT_HARBOR_STATE=0: 1 only after Magma Hideout (data/maps/MagmaHideout_4F/scripts.inc:64); 1 fires the harbor Aqua scene (SlateportCity_Harbor/scripts.inc:8)
    VAR_SLATEPORT_HARBOR_STATE: 0,
    // VAR_ROUTE110_STATE=1: rival battle done (data/maps/Route110/scripts.inc:478); Route110 coord events 33-35,56 want 0
    VAR_ROUTE110_STATE: 1,
    // VAR_SLATEPORT_OUTSIDE_MUSEUM_STATE=3: museum sets 1 (SlateportCity_OceanicMuseum_2F/scripts.inc:83), Scott's OnFrame 1->2
    // (SlateportCity/scripts.inc:56,90), the tent coord event 10,13 2->3 (:890). 3 is a real pre-Wattson value and fires nothing.
    VAR_SLATEPORT_OUTSIDE_MUSEUM_STATE: 3,
    // VAR_REGISTER_BIRCH_STATE=2: museum 0->1 (SlateportCity_OceanicMuseum_2F/scripts.inc:89), Route 110 Birch scene 1->2
    // (data/maps/Route110/scripts.inc:634); Route110 coord events 7-10,85 want 1
    VAR_REGISTER_BIRCH_STATE: 2,
  },
  // Tile 18,17: plain grass (c0 e3, `node scripts/map_scan.cjs MauvilleCity 14-26 14-19 --walkable`) near the south edge where
  // Route 110 joins; MauvilleCity has no coord events and only an ON_TRANSITION map script. Wally (8,6) and his uncle (9,6) wait
  // for a talk (MauvilleCity_EventScript_Wally).
  map: "MAP_MAUVILLE_CITY",
  x: 18,
  y: 17,
};

export const CHECKPOINTS: Record<CheckpointName, Checkpoint> = {
  slateport_arrival: SLATEPORT_ARRIVAL,
  mauville_pre_wattson: MAUVILLE_PRE_WATTSON,
};

const union = (a: readonly string[], b: readonly string[]) => [...new Set([...a, ...b])];

/**
 * Resolves `s.checkpoint` into a plain scenario: the checkpoint's flags,
 * clearFlags and vars go underneath the test's, and its position is used
 * unless the test gives map, x and y. A test flag drops the checkpoint's
 * clearFlag of the same name and the other way round; a test var wins.
 */
export function applyCheckpoint(s: Scenario, table: Record<string, Checkpoint> = CHECKPOINTS): Scenario {
  const name = s.checkpoint;
  if (!name) return s;
  const cp = table[name];
  if (!cp) throw new Error(`unknown checkpoint ${name}`);
  for (const key of [...cp.flags, ...(cp.clearFlags ?? []), ...Object.keys(cp.vars)]) {
    if (key.startsWith("FLAG_TEMP_") || key.startsWith("VAR_TEMP_")) {
      throw new Error(`checkpoint ${name}: temp key ${key} is reset on every warp`);
    }
  }
  const given = [s.map, s.x, s.y].filter((v) => v !== undefined).length;
  if (given !== 0 && given !== 3) throw new Error(`checkpoint ${name}: give all of map, x and y, or none`);

  const testFlags = s.flags ?? [];
  const testClear = s.clearFlags ?? [];
  const { checkpoint: _, ...rest } = s;
  return {
    ...rest,
    map: s.map ?? cp.map,
    x: s.x ?? cp.x,
    y: s.y ?? cp.y,
    flags: union(cp.flags.filter((f) => !testClear.includes(f)), testFlags),
    clearFlags: union((cp.clearFlags ?? []).filter((f) => !testFlags.includes(f)), testClear),
    vars: { ...cp.vars, ...s.vars },
  };
}
