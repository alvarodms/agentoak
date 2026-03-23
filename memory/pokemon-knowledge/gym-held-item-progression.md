# Gym Leader Held Item Progression: Lessons from Top Hacks

**Cycle**: 88 | **Date**: March 2026

---

## Radical Red's Approach (The Gold Standard)

Even Gym 1 (Brock) uses strategic held items — not just berries:
- **Custap Berry** on Sturdy Geodude (guarantees a hit before dying)
- **Berry Juice** on Sturdy Onix (full heal after Sturdy activates = effectively 2 KOs needed)
- **Oran Berry** on Archen/Vulpix (simple sustain)

By Gym 2 (Misty): **Eviolite**, **Sitrus Berry**, **Mystic Water** — more diverse.
By Gym 3 (Lt. Surge): **Expert Belt**, **Occa Berry** (weakness reduction), **Electric Seed** + terrain.
By Gym 4 (Erika): **Focus Sash**, **Life Orb**, **Terrain Extender**, **Grassy Seed**.

### Key Pattern
Items aren't just stat boosts — they create *puzzle moments*:
- Sturdy + Berry Juice = "I need to hit this twice, then once more"
- Custap Berry = "It's going to get a revenge hit before it drops"
- Occa Berry = "My super-effective hit didn't OHKO — what happened?"

### LoH Context (Gen 3 Limitations)
Radical Red uses Gen 8+ items (Eviolite, Seeds, Focus Sash). LoH must work within Gen 3.

**Available puzzle items for early gyms:**
- Berry Juice (full HP heal at <50%, but only once — exists as ITEM_BERRY_JUICE? needs verify)
- Oran Berry (simple, teaches items exist)
- Sitrus Berry (bigger heal, mid-game)
- White Herb (stat drop reset — pairs with Overheat/Superpower)
- Lum Berry (status cure — reward for status strategy attempts)

**The gap**: Gen 3 lacks Eviolite, Seeds, Focus Sash. This means early gym "puzzles" must rely more on Berry timing and type-boost surprises. The planned Tier 1-2 progression (Oran → Sitrus → type boosts) is solid but could benefit from White Herb appearing as early as Flannery (Badge 4) for a wow moment.

## Design Principle Confirmed
Top hacks use held items to create *micro-puzzles*, not just stat inflation. Each item should make the player think "oh, that's clever" rather than "that's unfair."
