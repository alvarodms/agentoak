---
name: boss-species-ownership
description: One-owner rule table for boss species (#193), villain/Drake/Sidney/Winona sources of truth, audit_boss_species lint
metadata:
  type: project
---

# Boss Species Ownership (moved from strategy-notes C335)

### Species Reuse (#193)

| Species | Final owner (C317) | Notes |
|---------|-------------------|-------|
| Camerupt (ace), Weezing line, Rhydon line, Nidoking line | **Maxie** (Magma = land) | Ace last slot every tier. Off Flannery C317 |
| Houndoom (ace), Muk line, Magmar, Sandslash | **Tabitha** | Off Flannery C317 (Houndour stays a wild migration species) |
| Sharpedo (ace), Crobat, Wailord, Gliscor_Hoenn | **Archie** (Aqua = sea) | Gliscor_H also Brawly4/5 rematch (accepted) |
| Huntail (ace), Octillery, Qwilfish, Carvanha (WI), Corsola_Hoenn | **Shelly** | Corsola_H also Phoebe R1 (accepted, Aqua adopted migrant) |
| Poliwrath (ace), Kingler, Quagsire, Tentacruel | **Matt** | |
| Crawdaunt, Mightyena | **Sidney** | No villain boss fields either |
| Honchkrow | **Sidney** (all 5 tiers) | Winona removed C314 |
| Gyarados | **Wallace** | |
| Torkoal (ace), Arcanine, Magcargo, Ninetales, Rapidash, Pinsir_Hoenn | **Flannery** | C317 "steam, not smoke": Torkoal ace every tier (F1 White Herb Overheat; F2-F5 sun Eruption). Source of truth `flannery_gym_1-5.json`. Intro/rematch text: Magma wants the mountain to rage, Torkoal keeps it warm |
| Omastar, Kabutops, Aerodactyl, Armaldo | **Roxanne** (fossil hall) | C317 `roxanne_gym_2-5.json`; Omastar replaces Lunatone, R5 ace = banded Aerodactyl 75 (Kabutops R5 only). Golem kept |
| Relicanth | **Wallace** | C317: replaces Sealeo (Gym1) / Walrein (Gym2-4) in slot 1 of `wallace_gym_1-4.json`. Gym5 untouched |
| Walrein/Sealeo | **Glacia** | Off Wallace C317 |
| Lunatone | **Tate&Liza** | Off Roxanne C317 |
| Sceptile_Hoenn | **Steven** only | Off Drake R3/R4 C317 (→ Flygon, `drake_rematch_3/4.json`) |
| Claydol | **Tate&Liza** | |
| Flygon | **Drake** | Steven T0-T2 → Donphan C314 |
| Tyranitar | Rival postgame only (sParty_Brendan/MayPostgameMudkip) | Off Roxanne5 C317; off Meteor Falls Steven C321 |
| Regirock, Regice | **Meteor Falls Steven** only (C321, `steven_meteor_falls.json`) | #194 closed; Registeel stays Steven T4 |
| Kingdra | Wallace Gym5 (Juan's) + Drake R3/R4 | **Accepted overlap** (both postgame-only) |
| Carbink, Cradily | Roxanne R3+ + Steven | **Accepted overlap** (stone student / stone master; fossil hall Steven inspired) |
| Skarmory | Winona 1/3/4/5 + Steven T2/T3 + Meteor Falls Steven (Lv80 Spikes lead, C321) | **Accepted overlap** (vanilla on both, #194) |
| Grunts (any species) | — | **Exempt** — faction uniforms |

**Villain source of truth (C316):** `pokeemerald/scripts/trainer_configs/villain_*.json` (10 configs; apply with generate_trainer.cjs modify). **Tag battles cap each opponent at 3 mons** (battle_main.c, BATTLE_TYPE_TWO_OPPONENTS) — sParty_MaxieMossdeep is Weezing/Nidoking/Camerupt (Rhydon dropped so the ace appears; Rhydon stays Maxie's via the Hideout).

**Audit (C317):** `node pokeemerald/scripts/audit_boss_species.cjs [--strict]`; **`make check_bosses` (--strict) is part of `make check_all`**, so any new boss species share fails the checks. Result C317: **COLLISIONS: 0**, stale allowlist none. Accepted (each with a written `why`, required by --strict): Skarmory, Mightyena (pairs []), Corsola_H, Gliscor_H, Kingdra, Carbink, Cradily. New overlaps: fix the roster first; allowlist only with a story reason.

**Drake learnset legality (C318):** all 5 teams legal per rom_species; source of truth `drake.json`, `drake_rematch_1-4.json`. Only exception: Dragonite Extreme Speed (Gen 3 event move, Drake signature). Backlog: R3 Flygon (Dragon Breath/Toxic Leftovers stall) hits softer than R1/R2 Flygon.
**ONE-OWNER RULE:** each overused species belongs to the boss whose identity it fits; don't re-add Tyranitar/Houndoom to Sidney.

**Sidney (C313/C314)**: Hoenn-native Dark-types, Absol ace, Honchkrow signature, distinct 6-species roster per tier, 0 shared species with other E4/Champion. Source of truth `scripts/trainer_configs/sidney_*.json` (Absol has no Night Slash/Sucker Punch — tech-debt).

**Winona (C314)**: "Hoenn's own wings" — Altaria DD ace, no Honchkrow/Crobat; source `winona_gym_1..5.json`. Story link: her dark bird "flew south" → Sidney's Honchkrow "rode a storm down from FORTREE".

