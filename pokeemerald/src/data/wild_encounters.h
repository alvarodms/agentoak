//
// DO NOT MODIFY THIS FILE! It is auto-generated from src/data/wild_encounters.json and Inja template src/data/wild_encounters.json.txt
//


#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_0 20 
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_1 ENCOUNTER_CHANCE_LAND_MONS_SLOT_0 + 20
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_2 ENCOUNTER_CHANCE_LAND_MONS_SLOT_1 + 10
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_3 ENCOUNTER_CHANCE_LAND_MONS_SLOT_2 + 10
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_4 ENCOUNTER_CHANCE_LAND_MONS_SLOT_3 + 10
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_5 ENCOUNTER_CHANCE_LAND_MONS_SLOT_4 + 10
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_6 ENCOUNTER_CHANCE_LAND_MONS_SLOT_5 + 5
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_7 ENCOUNTER_CHANCE_LAND_MONS_SLOT_6 + 5
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_8 ENCOUNTER_CHANCE_LAND_MONS_SLOT_7 + 4
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_9 ENCOUNTER_CHANCE_LAND_MONS_SLOT_8 + 4
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_10 ENCOUNTER_CHANCE_LAND_MONS_SLOT_9 + 1
#define ENCOUNTER_CHANCE_LAND_MONS_SLOT_11 ENCOUNTER_CHANCE_LAND_MONS_SLOT_10 + 1
#define ENCOUNTER_CHANCE_LAND_MONS_TOTAL (ENCOUNTER_CHANCE_LAND_MONS_SLOT_11)
#define ENCOUNTER_CHANCE_WATER_MONS_SLOT_0 60 
#define ENCOUNTER_CHANCE_WATER_MONS_SLOT_1 ENCOUNTER_CHANCE_WATER_MONS_SLOT_0 + 30
#define ENCOUNTER_CHANCE_WATER_MONS_SLOT_2 ENCOUNTER_CHANCE_WATER_MONS_SLOT_1 + 5
#define ENCOUNTER_CHANCE_WATER_MONS_SLOT_3 ENCOUNTER_CHANCE_WATER_MONS_SLOT_2 + 4
#define ENCOUNTER_CHANCE_WATER_MONS_SLOT_4 ENCOUNTER_CHANCE_WATER_MONS_SLOT_3 + 1
#define ENCOUNTER_CHANCE_WATER_MONS_TOTAL (ENCOUNTER_CHANCE_WATER_MONS_SLOT_4)
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_0 60 
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_1 ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_0 + 30
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_2 ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_1 + 5
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_3 ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_2 + 4
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_4 ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_3 + 1
#define ENCOUNTER_CHANCE_ROCK_SMASH_MONS_TOTAL (ENCOUNTER_CHANCE_ROCK_SMASH_MONS_SLOT_4)
#define ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_2 60 
#define ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_3 ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_2 + 20
#define ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_4 ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_3 + 20
#define ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_TOTAL (ENCOUNTER_CHANCE_FISHING_MONS_GOOD_ROD_SLOT_4)
#define ENCOUNTER_CHANCE_FISHING_MONS_OLD_ROD_SLOT_0 70 
#define ENCOUNTER_CHANCE_FISHING_MONS_OLD_ROD_SLOT_1 ENCOUNTER_CHANCE_FISHING_MONS_OLD_ROD_SLOT_0 + 30
#define ENCOUNTER_CHANCE_FISHING_MONS_OLD_ROD_TOTAL (ENCOUNTER_CHANCE_FISHING_MONS_OLD_ROD_SLOT_1)
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_5 40 
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_6 ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_5 + 40
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_7 ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_6 + 15
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_8 ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_7 + 4
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_9 ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_8 + 1
#define ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_TOTAL (ENCOUNTER_CHANCE_FISHING_MONS_SUPER_ROD_SLOT_9)



const struct WildPokemon gRoute101_LandMons[] =
{
    { 2, 3, SPECIES_ZIGZAGOON },
    { 2, 3, SPECIES_POOCHYENA },
    { 2, 3, SPECIES_WURMPLE },
    { 3, 3, SPECIES_TAILLOW },
    { 2, 3, SPECIES_LOTAD },
    { 2, 3, SPECIES_SEEDOT },
    { 3, 3, SPECIES_ZIGZAGOON },
    { 3, 3, SPECIES_POOCHYENA },
    { 3, 4, SPECIES_RALTS },
    { 3, 3, SPECIES_SKITTY },
    { 4, 4, SPECIES_EEVEE },
    { 4, 4, SPECIES_SWABLU },
};

const struct WildPokemonInfo gRoute101_LandMonsInfo = { 20, gRoute101_LandMons };
const struct WildPokemon gRoute102_LandMons[] =
{
    { 3, 4, SPECIES_ZIGZAGOON },
    { 3, 4, SPECIES_SEEDOT },
    { 3, 4, SPECIES_LOTAD_HOENN },
    { 3, 4, SPECIES_POOCHYENA },
    { 3, 4, SPECIES_SURSKIT },
    { 4, 4, SPECIES_RALTS },
    { 4, 4, SPECIES_MARILL },
    { 3, 3, SPECIES_WURMPLE },
    { 4, 4, SPECIES_SHROOMISH },
    { 3, 4, SPECIES_NINCADA },
    { 4, 5, SPECIES_ABRA },
    { 4, 4, SPECIES_ODDISH },
};

const struct WildPokemonInfo gRoute102_LandMonsInfo = { 20, gRoute102_LandMons };
const struct WildPokemon gRoute102_WaterMons[] =
{
    { 5, 15, SPECIES_HORSEA },
    { 5, 10, SPECIES_HORSEA },
    { 15, 25, SPECIES_HORSEA },
    { 5, 10, SPECIES_DRATINI },
    { 10, 20, SPECIES_DRATINI },
};

const struct WildPokemonInfo gRoute102_WaterMonsInfo = { 4, gRoute102_WaterMons };
const struct WildPokemon gRoute102_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_CORPHISH },
    { 25, 30, SPECIES_CORPHISH },
    { 30, 35, SPECIES_CORPHISH },
    { 20, 25, SPECIES_CORPHISH },
    { 35, 40, SPECIES_CORPHISH },
    { 40, 45, SPECIES_CORPHISH },
};

const struct WildPokemonInfo gRoute102_FishingMonsInfo = { 30, gRoute102_FishingMons };
const struct WildPokemon gRoute103_LandMons[] =
{
    { 2, 3, SPECIES_WINGULL },
    { 2, 3, SPECIES_ZIGZAGOON },
    { 3, 4, SPECIES_POOCHYENA },
    { 3, 4, SPECIES_TAILLOW },
    { 3, 4, SPECIES_ODDISH },
    { 3, 4, SPECIES_TENTACOOL },
    { 3, 4, SPECIES_WINGULL },
    { 4, 4, SPECIES_POOCHYENA },
    { 4, 5, SPECIES_ELECTRIKE },
    { 4, 5, SPECIES_VULPIX },
    { 5, 5, SPECIES_STARYU },
    { 4, 4, SPECIES_MEOWTH },
};

const struct WildPokemonInfo gRoute103_LandMonsInfo = { 20, gRoute103_LandMons };
const struct WildPokemon gRoute103_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_STARYU },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute103_WaterMonsInfo = { 4, gRoute103_WaterMons };
const struct WildPokemon gRoute103_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gRoute103_FishingMonsInfo = { 30, gRoute103_FishingMons };
const struct WildPokemon gRoute104_LandMons[] =
{
    { 4, 5, SPECIES_WURMPLE },
    { 4, 5, SPECIES_TAILLOW },
    { 4, 5, SPECIES_MARILL },
    { 4, 5, SPECIES_POOCHYENA },
    { 5, 5, SPECIES_WINGULL },
    { 4, 5, SPECIES_ODDISH },
    { 4, 5, SPECIES_ZIGZAGOON },
    { 5, 6, SPECIES_ROSELIA },
    { 5, 5, SPECIES_SKITTY },
    { 5, 5, SPECIES_SHROOMISH },
    { 5, 6, SPECIES_PIKACHU },
    { 5, 5, SPECIES_SURSKIT },
};

const struct WildPokemonInfo gRoute104_LandMonsInfo = { 20, gRoute104_LandMons };
const struct WildPokemon gRoute104_WaterMons[] =
{
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute104_WaterMonsInfo = { 4, gRoute104_WaterMons };
const struct WildPokemon gRoute104_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 25, 30, SPECIES_MAGIKARP },
    { 30, 35, SPECIES_MAGIKARP },
    { 20, 25, SPECIES_MAGIKARP },
    { 35, 40, SPECIES_MAGIKARP },
    { 40, 45, SPECIES_MAGIKARP },
};

const struct WildPokemonInfo gRoute104_FishingMonsInfo = { 30, gRoute104_FishingMons };
const struct WildPokemon gRoute105_WaterMons[] =
{
    { 10, 25, SPECIES_WAILMER },
    { 10, 20, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 15, 25, SPECIES_STARYU },
    { 10, 20, SPECIES_LUVDISC },
};

const struct WildPokemonInfo gRoute105_WaterMonsInfo = { 4, gRoute105_WaterMons };
const struct WildPokemon gRoute105_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 20, SPECIES_GOLDEEN },
    { 10, 20, SPECIES_WAILMER },
    { 10, 20, SPECIES_CORPHISH },
    { 20, 25, SPECIES_WAILMER },
    { 20, 25, SPECIES_CORPHISH },
    { 25, 30, SPECIES_SEAKING },
    { 25, 30, SPECIES_STARYU },
    { 28, 30, SPECIES_WAILORD },
};

const struct WildPokemonInfo gRoute105_FishingMonsInfo = { 30, gRoute105_FishingMons };
const struct WildPokemon gRoute110_LandMons[] =
{
    { 15, 17, SPECIES_ELECTRIKE },
    { 15, 17, SPECIES_ODDISH },
    { 16, 17, SPECIES_GULPIN },
    { 16, 18, SPECIES_PLUSLE },
    { 16, 18, SPECIES_MINUN },
    { 16, 17, SPECIES_WINGULL },
    { 16, 17, SPECIES_MAREEP },
    { 16, 18, SPECIES_MACHOP },
    { 17, 18, SPECIES_VOLBEAT },
    { 17, 18, SPECIES_ILLUMISE },
    { 18, 18, SPECIES_ELECTABUZZ },
    { 17, 17, SPECIES_PIKACHU },
};

const struct WildPokemonInfo gRoute110_LandMonsInfo = { 20, gRoute110_LandMons };
const struct WildPokemon gRoute110_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute110_WaterMonsInfo = { 4, gRoute110_WaterMons };
const struct WildPokemon gRoute110_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gRoute110_FishingMonsInfo = { 30, gRoute110_FishingMons };
const struct WildPokemon gRoute111_LandMons[] =
{
    { 19, 21, SPECIES_SANDSHREW },
    { 18, 20, SPECIES_TRAPINCH },
    { 19, 21, SPECIES_CACNEA },
    { 19, 21, SPECIES_BALTOY },
    { 19, 21, SPECIES_GEODUDE },
    { 20, 22, SPECIES_SANDSHREW },
    { 20, 22, SPECIES_LARVITAR },
    { 20, 22, SPECIES_ARON },
    { 20, 22, SPECIES_CACNEA },
    { 20, 22, SPECIES_BALTOY },
    { 21, 22, SPECIES_VIBRAVA },
    { 21, 22, SPECIES_GIBLE },
};

const struct WildPokemonInfo gRoute111_LandMonsInfo = { 10, gRoute111_LandMons };
const struct WildPokemon gRoute111_WaterMons[] =
{
    { 20, 30, SPECIES_MARILL },
    { 10, 20, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
    { 20, 30, SPECIES_GOLDEEN },
};

const struct WildPokemonInfo gRoute111_WaterMonsInfo = { 4, gRoute111_WaterMons };
const struct WildPokemon gRoute111_RockSmashMons[] =
{
    { 10, 15, SPECIES_GEODUDE },
    { 5, 10, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
};

const struct WildPokemonInfo gRoute111_RockSmashMonsInfo = { 20, gRoute111_RockSmashMons };
const struct WildPokemon gRoute111_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 20, 25, SPECIES_BARBOACH },
    { 35, 40, SPECIES_BARBOACH },
    { 40, 45, SPECIES_BARBOACH },
};

const struct WildPokemonInfo gRoute111_FishingMonsInfo = { 30, gRoute111_FishingMons };
const struct WildPokemon gRoute112_LandMons[] =
{
    { 19, 21, SPECIES_NUMEL },
    { 19, 21, SPECIES_GEODUDE },
    { 20, 22, SPECIES_MACHOP },
    { 19, 21, SPECIES_SLUGMA },
    { 20, 22, SPECIES_KOFFING },
    { 20, 22, SPECIES_ARON },
    { 21, 22, SPECIES_NUMEL },
    { 21, 22, SPECIES_PINSIR_HOENN },
    { 21, 22, SPECIES_HOUNDOUR },
    { 20, 22, SPECIES_NIDORAN_F },
    { 22, 22, SPECIES_TORKOAL },
    { 22, 22, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gRoute112_LandMonsInfo = { 20, gRoute112_LandMons };
const struct WildPokemon gRoute113_LandMons[] =
{
    { 20, 22, SPECIES_SPINDA },
    { 20, 22, SPECIES_SLUGMA },
    { 20, 22, SPECIES_SANDSHREW },
    { 20, 22, SPECIES_NUMEL },
    { 21, 22, SPECIES_SWABLU },
    { 20, 22, SPECIES_SPOINK },
    { 21, 22, SPECIES_HOUNDOUR },
    { 21, 22, SPECIES_MURKROW },
    { 21, 23, SPECIES_TORKOAL },
    { 21, 22, SPECIES_VULPIX_HOENN },
    { 22, 23, SPECIES_SKARMORY },
    { 22, 23, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gRoute113_LandMonsInfo = { 20, gRoute113_LandMons };
const struct WildPokemon gRoute114_LandMons[] =
{
    { 15, 17, SPECIES_LOTAD },
    { 15, 17, SPECIES_SWABLU },
    { 16, 18, SPECIES_SEVIPER },
    { 16, 18, SPECIES_ZANGOOSE },
    { 15, 17, SPECIES_ODDISH },
    { 16, 17, SPECIES_MARILL },
    { 16, 18, SPECIES_LOMBRE },
    { 15, 17, SPECIES_SEEDOT },
    { 17, 18, SPECIES_NUZLEAF },
    { 16, 18, SPECIES_ROSELIA },
    { 17, 18, SPECIES_TEDDIURSA },
    { 16, 17, SPECIES_SURSKIT },
};

const struct WildPokemonInfo gRoute114_LandMonsInfo = { 20, gRoute114_LandMons };
const struct WildPokemon gRoute114_WaterMons[] =
{
    { 20, 30, SPECIES_MARILL },
    { 10, 20, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
    { 20, 30, SPECIES_GOLDEEN },
};

const struct WildPokemonInfo gRoute114_WaterMonsInfo = { 4, gRoute114_WaterMons };
const struct WildPokemon gRoute114_RockSmashMons[] =
{
    { 10, 15, SPECIES_GEODUDE },
    { 5, 10, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
};

const struct WildPokemonInfo gRoute114_RockSmashMonsInfo = { 20, gRoute114_RockSmashMons };
const struct WildPokemon gRoute114_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 20, 25, SPECIES_BARBOACH },
    { 35, 40, SPECIES_BARBOACH },
    { 40, 45, SPECIES_BARBOACH },
};

const struct WildPokemonInfo gRoute114_FishingMonsInfo = { 30, gRoute114_FishingMons };
const struct WildPokemon gRoute116_LandMons[] =
{
    { 6, 8, SPECIES_TAILLOW },
    { 6, 8, SPECIES_WHISMUR },
    { 7, 9, SPECIES_NINCADA },
    { 6, 8, SPECIES_ZIGZAGOON },
    { 7, 8, SPECIES_POOCHYENA },
    { 8, 10, SPECIES_GEODUDE },
    { 7, 9, SPECIES_ABRA },
    { 8, 10, SPECIES_TAILLOW },
    { 8, 10, SPECIES_RIOLU },
    { 7, 9, SPECIES_SKITTY },
    { 9, 10, SPECIES_ARON },
    { 8, 10, SPECIES_SABLEYE },
};

const struct WildPokemonInfo gRoute116_LandMonsInfo = { 20, gRoute116_LandMons };
const struct WildPokemon gRoute117_LandMons[] =
{
    { 13, 14, SPECIES_ODDISH },
    { 13, 14, SPECIES_MARILL },
    { 14, 15, SPECIES_VOLBEAT },
    { 14, 15, SPECIES_ILLUMISE },
    { 13, 15, SPECIES_SEEDOT },
    { 13, 14, SPECIES_ZIGZAGOON },
    { 14, 15, SPECIES_ROSELIA },
    { 14, 15, SPECIES_ODDISH },
    { 14, 15, SPECIES_SHROOMISH },
    { 14, 15, SPECIES_MARILL },
    { 15, 15, SPECIES_DITTO },
    { 14, 15, SPECIES_SURSKIT },
};

const struct WildPokemonInfo gRoute117_LandMonsInfo = { 20, gRoute117_LandMons };
const struct WildPokemon gRoute117_WaterMons[] =
{
    { 20, 30, SPECIES_MARILL },
    { 10, 20, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
    { 20, 30, SPECIES_GOLDEEN },
};

const struct WildPokemonInfo gRoute117_WaterMonsInfo = { 4, gRoute117_WaterMons };
const struct WildPokemon gRoute117_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_CORPHISH },
    { 25, 30, SPECIES_CORPHISH },
    { 30, 35, SPECIES_CORPHISH },
    { 20, 25, SPECIES_CORPHISH },
    { 35, 40, SPECIES_CORPHISH },
    { 40, 45, SPECIES_CORPHISH },
};

const struct WildPokemonInfo gRoute117_FishingMonsInfo = { 30, gRoute117_FishingMons };
const struct WildPokemon gRoute118_LandMons[] =
{
    { 25, 27, SPECIES_ELECTRIKE },
    { 25, 27, SPECIES_LINOONE },
    { 25, 27, SPECIES_ZIGZAGOON },
    { 25, 27, SPECIES_WINGULL },
    { 26, 28, SPECIES_KECLEON },
    { 26, 28, SPECIES_MANECTRIC },
    { 26, 28, SPECIES_DODUO },
    { 26, 28, SPECIES_MIGHTYENA },
    { 26, 28, SPECIES_ABSOL },
    { 26, 28, SPECIES_GIRAFARIG },
    { 27, 28, SPECIES_KANGASKHAN },
    { 27, 28, SPECIES_HERACROSS },
};

const struct WildPokemonInfo gRoute118_LandMonsInfo = { 20, gRoute118_LandMons };
const struct WildPokemon gRoute118_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute118_WaterMonsInfo = { 4, gRoute118_WaterMons };
const struct WildPokemon gRoute118_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_CARVANHA },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_CARVANHA },
    { 20, 25, SPECIES_CARVANHA },
    { 35, 40, SPECIES_CARVANHA },
    { 40, 45, SPECIES_CARVANHA },
};

const struct WildPokemonInfo gRoute118_FishingMonsInfo = { 30, gRoute118_FishingMons };
const struct WildPokemon gRoute118_SecondWave_LandMons[] =
{
    { 26, 28, SPECIES_ELECTRIKE },
    { 26, 28, SPECIES_SNUBBULL },
    { 26, 28, SPECIES_HOUNDOUR },
    { 26, 28, SPECIES_GROWLITHE },
    { 26, 28, SPECIES_KECLEON },
    { 28, 30, SPECIES_MANECTRIC },
    { 27, 29, SPECIES_GLIGAR },
    { 27, 29, SPECIES_KANGASKHAN },
    { 27, 29, SPECIES_ZANGOOSE },
    { 27, 29, SPECIES_SEVIPER },
    { 29, 30, SPECIES_HOUNDOOM },
    { 29, 30, SPECIES_ARCANINE },
};

const struct WildPokemonInfo gRoute118_SecondWave_LandMonsInfo = { 20, gRoute118_SecondWave_LandMons };
const struct WildPokemon gRoute124_WaterMons[] =
{
    { 25, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_TENTACOOL },
    { 25, 30, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_HORSEA },
    { 30, 35, SPECIES_LANTURN },
};

const struct WildPokemonInfo gRoute124_WaterMonsInfo = { 4, gRoute124_WaterMons };
const struct WildPokemon gRoute124_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_HORSEA },
    { 15, 25, SPECIES_CHINCHOU },
    { 15, 25, SPECIES_CORPHISH },
    { 25, 30, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_HORSEA },
    { 30, 35, SPECIES_SEADRA },
    { 30, 35, SPECIES_CORSOLA },
    { 30, 35, SPECIES_LANTURN },
};

const struct WildPokemonInfo gRoute124_FishingMonsInfo = { 30, gRoute124_FishingMons };
const struct WildPokemon gPetalburgWoods_LandMons[] =
{
    { 5, 7, SPECIES_SHROOMISH },
    { 5, 6, SPECIES_WURMPLE },
    { 5, 6, SPECIES_SLAKOTH },
    { 6, 7, SPECIES_CASCOON },
    { 6, 7, SPECIES_SILCOON },
    { 5, 6, SPECIES_TAILLOW },
    { 5, 6, SPECIES_SEEDOT },
    { 5, 7, SPECIES_SPINARAK },
    { 6, 7, SPECIES_SHROOMISH_HOENN },
    { 6, 7, SPECIES_ODDISH },
    { 7, 8, SPECIES_HERACROSS },
    { 6, 7, SPECIES_PINECO },
};

const struct WildPokemonInfo gPetalburgWoods_LandMonsInfo = { 20, gPetalburgWoods_LandMons };
const struct WildPokemon gRusturfTunnel_LandMons[] =
{
    { 6, 6, SPECIES_WHISMUR },
    { 7, 7, SPECIES_WHISMUR },
    { 6, 6, SPECIES_WHISMUR },
    { 6, 6, SPECIES_WHISMUR },
    { 7, 7, SPECIES_WHISMUR },
    { 7, 7, SPECIES_WHISMUR },
    { 5, 5, SPECIES_WHISMUR },
    { 8, 8, SPECIES_WHISMUR },
    { 5, 5, SPECIES_WHISMUR },
    { 8, 8, SPECIES_WHISMUR },
    { 5, 5, SPECIES_WHISMUR },
    { 8, 8, SPECIES_WHISMUR },
};

const struct WildPokemonInfo gRusturfTunnel_LandMonsInfo = { 10, gRusturfTunnel_LandMons };
const struct WildPokemon gGraniteCave_1F_LandMons[] =
{
    { 8, 10, SPECIES_ZUBAT },
    { 8, 10, SPECIES_GEODUDE },
    { 9, 11, SPECIES_ARON },
    { 9, 12, SPECIES_MAKUHITA },
    { 9, 11, SPECIES_MACHOP },
    { 10, 12, SPECIES_SABLEYE },
    { 10, 12, SPECIES_ZUBAT },
    { 10, 12, SPECIES_GEODUDE },
    { 10, 13, SPECIES_NOSEPASS },
    { 10, 13, SPECIES_MAWILE },
    { 11, 14, SPECIES_ABRA },
    { 12, 14, SPECIES_ARON },
};

const struct WildPokemonInfo gGraniteCave_1F_LandMonsInfo = { 10, gGraniteCave_1F_LandMons };
const struct WildPokemon gGraniteCave_B1F_LandMons[] =
{
    { 8, 10, SPECIES_ZUBAT },
    { 8, 10, SPECIES_GEODUDE },
    { 9, 11, SPECIES_ARON },
    { 9, 12, SPECIES_MAKUHITA },
    { 9, 11, SPECIES_MACHOP },
    { 10, 12, SPECIES_SABLEYE },
    { 10, 12, SPECIES_ZUBAT },
    { 10, 12, SPECIES_GEODUDE },
    { 10, 13, SPECIES_NOSEPASS },
    { 10, 13, SPECIES_MAWILE },
    { 11, 14, SPECIES_ABRA },
    { 12, 14, SPECIES_ARON },
};

const struct WildPokemonInfo gGraniteCave_B1F_LandMonsInfo = { 10, gGraniteCave_B1F_LandMons };
const struct WildPokemon gMtPyre_1F_LandMons[] =
{
    { 28, 30, SPECIES_SHUPPET },
    { 28, 30, SPECIES_DUSKULL },
    { 29, 31, SPECIES_MEDITITE },
    { 29, 31, SPECIES_VULPIX },
    { 30, 32, SPECIES_SHUPPET },
    { 30, 32, SPECIES_DUSKULL },
    { 30, 32, SPECIES_CHIMECHO },
    { 30, 33, SPECIES_VULPIX },
    { 30, 33, SPECIES_MISDREAVUS },
    { 30, 33, SPECIES_HOUNDOUR },
    { 31, 33, SPECIES_SABLEYE },
    { 31, 33, SPECIES_DUSCLOPS },
};

const struct WildPokemonInfo gMtPyre_1F_LandMonsInfo = { 10, gMtPyre_1F_LandMons };
const struct WildPokemon gMtPyre_1F_SecondWave_LandMons[] =
{
    { 27, 29, SPECIES_SHUPPET },
    { 27, 29, SPECIES_DUSKULL },
    { 27, 29, SPECIES_SNUBBULL },
    { 27, 29, SPECIES_VULPIX },
    { 27, 29, SPECIES_MEDITITE },
    { 27, 29, SPECIES_HOUNDOUR },
    { 28, 30, SPECIES_MISDREAVUS },
    { 28, 30, SPECIES_MURKROW },
    { 29, 31, SPECIES_BANETTE },
    { 29, 31, SPECIES_DUSCLOPS },
    { 29, 30, SPECIES_SNEASEL },
    { 30, 31, SPECIES_HOUNDOOM },
};

const struct WildPokemonInfo gMtPyre_1F_SecondWave_LandMonsInfo = { 10, gMtPyre_1F_SecondWave_LandMons };
const struct WildPokemon gVictoryRoad_1F_LandMons[] =
{
    { 40, 44, SPECIES_GOLBAT },
    { 40, 44, SPECIES_HARIYAMA },
    { 42, 46, SPECIES_LAIRON },
    { 42, 46, SPECIES_GRAVELER },
    { 42, 46, SPECIES_MEDICHAM },
    { 42, 46, SPECIES_LOUDRED },
    { 43, 47, SPECIES_MAWILE },
    { 44, 48, SPECIES_GOLBAT },
    { 44, 48, SPECIES_PUPITAR },
    { 46, 50, SPECIES_LAIRON },
    { 46, 50, SPECIES_SHELGON },
    { 46, 50, SPECIES_MEDICHAM },
};

const struct WildPokemonInfo gVictoryRoad_1F_LandMonsInfo = { 10, gVictoryRoad_1F_LandMons };
const struct WildPokemon gSafariZone_South_LandMons[] =
{
    { 25, 25, SPECIES_LARVITAR },
    { 27, 27, SPECIES_LARVITAR },
    { 25, 25, SPECIES_BAGON },
    { 27, 27, SPECIES_BAGON },
    { 25, 25, SPECIES_DRATINI },
    { 25, 25, SPECIES_GROWLITHE },
    { 27, 27, SPECIES_ELECTABUZZ },
    { 29, 29, SPECIES_MAGMAR },
    { 27, 27, SPECIES_DRATINI },
    { 29, 29, SPECIES_HERACROSS },
    { 30, 30, SPECIES_ABSOL },
    { 32, 32, SPECIES_LAPRAS },
};

const struct WildPokemonInfo gSafariZone_South_LandMonsInfo = { 25, gSafariZone_South_LandMons };
const struct WildPokemon gUnderwater_Route126_WaterMons[] =
{
    { 20, 30, SPECIES_CLAMPERL },
    { 20, 30, SPECIES_CHINCHOU },
    { 30, 35, SPECIES_CLAMPERL },
    { 30, 35, SPECIES_RELICANTH },
    { 30, 35, SPECIES_RELICANTH },
};

const struct WildPokemonInfo gUnderwater_Route126_WaterMonsInfo = { 4, gUnderwater_Route126_WaterMons };
const struct WildPokemon gAbandonedShip_Rooms_B1F_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACRUEL },
};

const struct WildPokemonInfo gAbandonedShip_Rooms_B1F_WaterMonsInfo = { 4, gAbandonedShip_Rooms_B1F_WaterMons };
const struct WildPokemon gAbandonedShip_Rooms_B1F_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_TENTACOOL },
    { 25, 30, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_TENTACRUEL },
    { 20, 25, SPECIES_TENTACRUEL },
};

const struct WildPokemonInfo gAbandonedShip_Rooms_B1F_FishingMonsInfo = { 20, gAbandonedShip_Rooms_B1F_FishingMons };
const struct WildPokemon gGraniteCave_B2F_LandMons[] =
{
    { 8, 10, SPECIES_ZUBAT },
    { 8, 10, SPECIES_GEODUDE },
    { 9, 11, SPECIES_ARON },
    { 9, 12, SPECIES_MAKUHITA },
    { 9, 11, SPECIES_MACHOP },
    { 10, 12, SPECIES_SABLEYE },
    { 10, 12, SPECIES_ZUBAT },
    { 10, 13, SPECIES_GLIGAR_HOENN },
    { 10, 13, SPECIES_NOSEPASS },
    { 10, 13, SPECIES_MAWILE },
    { 11, 14, SPECIES_ABRA },
    { 12, 14, SPECIES_ARON },
};

const struct WildPokemonInfo gGraniteCave_B2F_LandMonsInfo = { 10, gGraniteCave_B2F_LandMons };
const struct WildPokemon gGraniteCave_B2F_RockSmashMons[] =
{
    { 10, 15, SPECIES_GEODUDE },
    { 10, 20, SPECIES_NOSEPASS },
    { 5, 10, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
};

const struct WildPokemonInfo gGraniteCave_B2F_RockSmashMonsInfo = { 20, gGraniteCave_B2F_RockSmashMons };
const struct WildPokemon gFieryPath_LandMons[] =
{
    { 15, 17, SPECIES_NUMEL },
    { 15, 17, SPECIES_SLUGMA },
    { 16, 18, SPECIES_KOFFING },
    { 16, 17, SPECIES_GRIMER },
    { 16, 18, SPECIES_MACHOP },
    { 15, 17, SPECIES_GEODUDE },
    { 17, 18, SPECIES_NUMEL },
    { 17, 18, SPECIES_SLUGMA },
    { 16, 18, SPECIES_ARON },
    { 17, 18, SPECIES_KOFFING },
    { 18, 18, SPECIES_TORKOAL },
    { 17, 18, SPECIES_MAGBY },
};

const struct WildPokemonInfo gFieryPath_LandMonsInfo = { 10, gFieryPath_LandMons };
const struct WildPokemon gMeteorFalls_B1F_2R_LandMons[] =
{
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_GOLBAT },
    { 30, 30, SPECIES_BAGON },
    { 35, 35, SPECIES_SOLROCK },
    { 35, 35, SPECIES_BAGON },
    { 37, 37, SPECIES_SOLROCK },
    { 28, 30, SPECIES_BAGON_HOENN },
    { 39, 39, SPECIES_SOLROCK },
    { 25, 28, SPECIES_TREECKO_HOENN },
    { 40, 40, SPECIES_GOLBAT },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
};

const struct WildPokemonInfo gMeteorFalls_B1F_2R_LandMonsInfo = { 10, gMeteorFalls_B1F_2R_LandMons };
const struct WildPokemon gMeteorFalls_B1F_2R_WaterMons[] =
{
    { 30, 35, SPECIES_GOLBAT },
    { 30, 35, SPECIES_GOLBAT },
    { 25, 35, SPECIES_SOLROCK },
    { 15, 25, SPECIES_SOLROCK },
    { 5, 15, SPECIES_SOLROCK },
};

const struct WildPokemonInfo gMeteorFalls_B1F_2R_WaterMonsInfo = { 4, gMeteorFalls_B1F_2R_WaterMons };
const struct WildPokemon gMeteorFalls_B1F_2R_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 30, 35, SPECIES_WHISCASH },
    { 35, 40, SPECIES_WHISCASH },
    { 40, 45, SPECIES_WHISCASH },
};

const struct WildPokemonInfo gMeteorFalls_B1F_2R_FishingMonsInfo = { 30, gMeteorFalls_B1F_2R_FishingMons };
const struct WildPokemon gJaggedPass_LandMons[] =
{
    { 21, 21, SPECIES_NUMEL },
    { 21, 21, SPECIES_NUMEL },
    { 21, 21, SPECIES_MACHOP },
    { 20, 20, SPECIES_NUMEL },
    { 20, 20, SPECIES_SPOINK },
    { 20, 20, SPECIES_MACHOP },
    { 21, 21, SPECIES_SPOINK },
    { 22, 22, SPECIES_MACHOP },
    { 22, 22, SPECIES_NUMEL },
    { 22, 22, SPECIES_SPOINK },
    { 22, 22, SPECIES_NUMEL },
    { 22, 22, SPECIES_SPOINK },
};

const struct WildPokemonInfo gJaggedPass_LandMonsInfo = { 20, gJaggedPass_LandMons };
const struct WildPokemon gRoute106_WaterMons[] =
{
    { 10, 25, SPECIES_SEEL },
    { 10, 20, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_WAILMER },
    { 15, 25, SPECIES_CORSOLA },
    { 25, 30, SPECIES_DEWGONG },
};

const struct WildPokemonInfo gRoute106_WaterMonsInfo = { 4, gRoute106_WaterMons };
const struct WildPokemon gRoute106_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 20, SPECIES_SHELLDER },
    { 10, 20, SPECIES_HORSEA },
    { 10, 20, SPECIES_WAILMER },
    { 20, 25, SPECIES_SHELLDER },
    { 20, 25, SPECIES_HORSEA },
    { 25, 30, SPECIES_SEEL },
    { 25, 30, SPECIES_CLOYSTER },
    { 28, 30, SPECIES_DEWGONG },
};

const struct WildPokemonInfo gRoute106_FishingMonsInfo = { 30, gRoute106_FishingMons };
const struct WildPokemon gRoute107_WaterMons[] =
{
    { 10, 25, SPECIES_WAILMER },
    { 10, 25, SPECIES_CHINCHOU },
    { 10, 20, SPECIES_TENTACOOL },
    { 10, 20, SPECIES_WINGULL },
    { 25, 30, SPECIES_MANTINE },
};

const struct WildPokemonInfo gRoute107_WaterMonsInfo = { 4, gRoute107_WaterMons };
const struct WildPokemon gRoute107_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 20, SPECIES_WAILMER },
    { 10, 20, SPECIES_HORSEA },
    { 10, 20, SPECIES_CHINCHOU },
    { 20, 25, SPECIES_WAILMER },
    { 20, 25, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_SEADRA },
    { 25, 30, SPECIES_REMORAID },
    { 28, 30, SPECIES_OCTILLERY },
};

const struct WildPokemonInfo gRoute107_FishingMonsInfo = { 30, gRoute107_FishingMons };
const struct WildPokemon gRoute108_WaterMons[] =
{
    { 10, 25, SPECIES_CARVANHA },
    { 10, 20, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_QWILFISH },
    { 25, 30, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute108_WaterMonsInfo = { 4, gRoute108_WaterMons };
const struct WildPokemon gRoute108_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 20, SPECIES_CARVANHA },
    { 10, 20, SPECIES_GRIMER },
    { 10, 20, SPECIES_KOFFING },
    { 20, 25, SPECIES_CARVANHA },
    { 20, 25, SPECIES_GRIMER },
    { 25, 30, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_MUK },
    { 28, 30, SPECIES_SHARPEDO },
};

const struct WildPokemonInfo gRoute108_FishingMonsInfo = { 30, gRoute108_FishingMons };
const struct WildPokemon gRoute109_WaterMons[] =
{
    { 15, 25, SPECIES_PELIPPER },
    { 10, 20, SPECIES_WINGULL },
    { 15, 25, SPECIES_SLOWPOKE },
    { 15, 25, SPECIES_STARYU },
    { 25, 30, SPECIES_SLOWBRO },
};

const struct WildPokemonInfo gRoute109_WaterMonsInfo = { 4, gRoute109_WaterMons };
const struct WildPokemon gRoute109_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 20, SPECIES_GOLDEEN },
    { 10, 20, SPECIES_STARYU },
    { 10, 20, SPECIES_LUVDISC },
    { 20, 25, SPECIES_LUVDISC },
    { 20, 25, SPECIES_STARYU },
    { 25, 30, SPECIES_SEAKING },
    { 25, 30, SPECIES_SLOWPOKE },
    { 28, 30, SPECIES_STARMIE },
};

const struct WildPokemonInfo gRoute109_FishingMonsInfo = { 30, gRoute109_FishingMons };
const struct WildPokemon gRoute115_LandMons[] =
{
    { 23, 25, SPECIES_SWABLU },
    { 23, 25, SPECIES_TAILLOW },
    { 24, 26, SPECIES_JIGGLYPUFF },
    { 23, 25, SPECIES_WINGULL },
    { 24, 26, SPECIES_GEODUDE },
    { 24, 26, SPECIES_NOSEPASS },
    { 25, 26, SPECIES_SWELLOW },
    { 24, 26, SPECIES_MACHOP },
    { 24, 26, SPECIES_MAKUHITA },
    { 25, 26, SPECIES_ABSOL },
    { 25, 26, SPECIES_GLIGAR },
    { 25, 26, SPECIES_PINSIR },
};

const struct WildPokemonInfo gRoute115_LandMonsInfo = { 20, gRoute115_LandMons };
const struct WildPokemon gRoute115_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute115_WaterMonsInfo = { 4, gRoute115_WaterMons };
const struct WildPokemon gRoute115_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gRoute115_FishingMonsInfo = { 30, gRoute115_FishingMons };
const struct WildPokemon gNewMauville_Inside_LandMons[] =
{
    { 24, 24, SPECIES_VOLTORB },
    { 24, 24, SPECIES_MAGNEMITE },
    { 25, 25, SPECIES_VOLTORB },
    { 25, 25, SPECIES_MAGNEMITE },
    { 23, 23, SPECIES_VOLTORB },
    { 23, 23, SPECIES_MAGNEMITE },
    { 26, 26, SPECIES_VOLTORB },
    { 25, 26, SPECIES_FLAAFFY },
    { 22, 22, SPECIES_VOLTORB },
    { 26, 26, SPECIES_ELECTABUZZ },
    { 26, 26, SPECIES_ELECTRODE },
    { 24, 24, SPECIES_RIOLU },
};

const struct WildPokemonInfo gNewMauville_Inside_LandMonsInfo = { 10, gNewMauville_Inside_LandMons };
const struct WildPokemon gRoute119_LandMons[] =
{
    { 26, 28, SPECIES_TROPIUS },
    { 25, 27, SPECIES_ODDISH },
    { 27, 29, SPECIES_LINOONE },
    { 26, 28, SPECIES_KECLEON },
    { 27, 29, SPECIES_GLOOM },
    { 26, 28, SPECIES_ROSELIA },
    { 25, 28, SPECIES_CHINCHOU },
    { 26, 28, SPECIES_YANMA },
    { 26, 28, SPECIES_BELLSPROUT },
    { 26, 28, SPECIES_STANTLER_HOENN },
    { 28, 30, SPECIES_HERACROSS },
    { 27, 29, SPECIES_CORSOLA },
};

const struct WildPokemonInfo gRoute119_LandMonsInfo = { 15, gRoute119_LandMons };
const struct WildPokemon gRoute119_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute119_WaterMonsInfo = { 4, gRoute119_WaterMons };
const struct WildPokemon gRoute119_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_CARVANHA },
    { 25, 30, SPECIES_CARVANHA },
    { 30, 35, SPECIES_CARVANHA },
    { 20, 25, SPECIES_CARVANHA },
    { 35, 40, SPECIES_CARVANHA },
    { 40, 45, SPECIES_CARVANHA },
};

const struct WildPokemonInfo gRoute119_FishingMonsInfo = { 30, gRoute119_FishingMons };
const struct WildPokemon gRoute119_SecondWave_LandMons[] =
{
    { 27, 29, SPECIES_ODDISH },
    { 27, 29, SPECIES_TROPIUS },
    { 28, 30, SPECIES_LINOONE },
    { 27, 29, SPECIES_KECLEON },
    { 27, 29, SPECIES_HOUNDOUR },
    { 27, 29, SPECIES_GROWLITHE },
    { 28, 30, SPECIES_HERACROSS },
    { 28, 30, SPECIES_SCYTHER },
    { 29, 31, SPECIES_GLOOM },
    { 29, 31, SPECIES_BRELOOM },
    { 30, 31, SPECIES_DRAGONAIR },
    { 30, 31, SPECIES_PUPITAR },
};

const struct WildPokemonInfo gRoute119_SecondWave_LandMonsInfo = { 15, gRoute119_SecondWave_LandMons };
const struct WildPokemon gRoute120_LandMons[] =
{
    { 26, 28, SPECIES_ABSOL },
    { 26, 28, SPECIES_LINOONE },
    { 27, 29, SPECIES_KECLEON },
    { 26, 28, SPECIES_ODDISH },
    { 27, 29, SPECIES_GLOOM },
    { 27, 29, SPECIES_MIGHTYENA },
    { 27, 29, SPECIES_EXEGGCUTE },
    { 26, 28, SPECIES_MARILL },
    { 27, 29, SPECIES_SEEDOT },
    { 27, 29, SPECIES_NUZLEAF },
    { 28, 30, SPECIES_TOGETIC },
    { 28, 30, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gRoute120_LandMonsInfo = { 20, gRoute120_LandMons };
const struct WildPokemon gRoute120_WaterMons[] =
{
    { 20, 30, SPECIES_MARILL },
    { 10, 20, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
    { 20, 30, SPECIES_GOLDEEN },
};

const struct WildPokemonInfo gRoute120_WaterMonsInfo = { 4, gRoute120_WaterMons };
const struct WildPokemon gRoute120_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 20, 25, SPECIES_BARBOACH },
    { 35, 40, SPECIES_BARBOACH },
    { 40, 45, SPECIES_BARBOACH },
};

const struct WildPokemonInfo gRoute120_FishingMonsInfo = { 30, gRoute120_FishingMons };
const struct WildPokemon gRoute120_SecondWave_LandMons[] =
{
    { 27, 29, SPECIES_ABSOL },
    { 27, 29, SPECIES_KECLEON },
    { 28, 30, SPECIES_MIGHTYENA },
    { 27, 29, SPECIES_ODDISH },
    { 27, 29, SPECIES_MARILL },
    { 27, 29, SPECIES_HOUNDOUR },
    { 28, 30, SPECIES_MURKROW },
    { 28, 30, SPECIES_MISDREAVUS },
    { 28, 30, SPECIES_TOGETIC },
    { 29, 31, SPECIES_GLOOM },
    { 30, 31, SPECIES_SHELGON },
    { 30, 31, SPECIES_HOUNDOOM },
};

const struct WildPokemonInfo gRoute120_SecondWave_LandMonsInfo = { 20, gRoute120_SecondWave_LandMons };
const struct WildPokemon gRoute121_LandMons[] =
{
    { 27, 29, SPECIES_CLEFAIRY },
    { 27, 29, SPECIES_POOCHYENA },
    { 28, 30, SPECIES_MIGHTYENA },
    { 27, 29, SPECIES_ODDISH },
    { 28, 30, SPECIES_GLOOM },
    { 27, 29, SPECIES_WINGULL },
    { 28, 30, SPECIES_KECLEON },
    { 28, 30, SPECIES_SHUPPET },
    { 28, 30, SPECIES_NUZLEAF },
    { 29, 31, SPECIES_PELIPPER },
    { 29, 31, SPECIES_JIGGLYPUFF },
    { 29, 31, SPECIES_ABSOL },
};

const struct WildPokemonInfo gRoute121_LandMonsInfo = { 20, gRoute121_LandMons };
const struct WildPokemon gRoute121_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute121_WaterMonsInfo = { 4, gRoute121_WaterMons };
const struct WildPokemon gRoute121_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gRoute121_FishingMonsInfo = { 30, gRoute121_FishingMons };
const struct WildPokemon gRoute121_SecondWave_LandMons[] =
{
    { 28, 30, SPECIES_CLEFAIRY },
    { 28, 30, SPECIES_POOCHYENA },
    { 28, 30, SPECIES_SHUPPET },
    { 29, 31, SPECIES_MIGHTYENA },
    { 28, 30, SPECIES_HOUNDOUR },
    { 28, 30, SPECIES_ODDISH },
    { 29, 31, SPECIES_TAUROS },
    { 29, 31, SPECIES_MILTANK },
    { 30, 32, SPECIES_GLOOM },
    { 30, 32, SPECIES_CLEFABLE },
    { 31, 32, SPECIES_URSARING },
    { 31, 32, SPECIES_DONPHAN },
};

const struct WildPokemonInfo gRoute121_SecondWave_LandMonsInfo = { 20, gRoute121_SecondWave_LandMons };
const struct WildPokemon gRoute122_WaterMons[] =
{
    { 25, 35, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_CARVANHA },
    { 25, 30, SPECIES_WINGULL },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute122_WaterMonsInfo = { 4, gRoute122_WaterMons };
const struct WildPokemon gRoute122_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_SHUPPET },
    { 15, 25, SPECIES_DUSKULL },
    { 15, 25, SPECIES_CARVANHA },
    { 25, 30, SPECIES_CARVANHA },
    { 25, 30, SPECIES_SHARPEDO },
    { 25, 30, SPECIES_DUSKULL },
    { 25, 30, SPECIES_SHUPPET },
    { 30, 35, SPECIES_DUSCLOPS },
};

const struct WildPokemonInfo gRoute122_FishingMonsInfo = { 30, gRoute122_FishingMons };
const struct WildPokemon gRoute123_LandMons[] =
{
    { 26, 28, SPECIES_ODDISH },
    { 27, 29, SPECIES_MIGHTYENA },
    { 27, 29, SPECIES_GLOOM },
    { 26, 28, SPECIES_ROSELIA },
    { 26, 28, SPECIES_KECLEON },
    { 27, 28, SPECIES_SHUPPET },
    { 26, 28, SPECIES_MEOWTH },
    { 27, 28, SPECIES_VOLBEAT },
    { 27, 29, SPECIES_EXEGGCUTE },
    { 26, 28, SPECIES_PARAS },
    { 28, 30, SPECIES_HERACROSS },
    { 28, 28, SPECIES_HOUNDOUR },
};

const struct WildPokemonInfo gRoute123_LandMonsInfo = { 20, gRoute123_LandMons };
const struct WildPokemon gRoute123_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gRoute123_WaterMonsInfo = { 4, gRoute123_WaterMons };
const struct WildPokemon gRoute123_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gRoute123_FishingMonsInfo = { 30, gRoute123_FishingMons };
const struct WildPokemon gRoute123_SecondWave_LandMons[] =
{
    { 28, 30, SPECIES_ODDISH },
    { 29, 31, SPECIES_MIGHTYENA },
    { 29, 31, SPECIES_GLOOM },
    { 28, 30, SPECIES_KECLEON },
    { 28, 30, SPECIES_HOUNDOUR },
    { 28, 30, SPECIES_GROWLITHE },
    { 29, 31, SPECIES_PINSIR },
    { 29, 31, SPECIES_STANTLER },
    { 30, 32, SPECIES_HOUNDOOM },
    { 30, 32, SPECIES_ARCANINE },
    { 31, 32, SPECIES_NIDOKING },
    { 31, 32, SPECIES_NIDOQUEEN },
};

const struct WildPokemonInfo gRoute123_SecondWave_LandMonsInfo = { 20, gRoute123_SecondWave_LandMons };
const struct WildPokemon gMtPyre_2F_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 24, 24, SPECIES_SHUPPET },
    { 23, 23, SPECIES_SHUPPET },
    { 22, 22, SPECIES_SHUPPET },
    { 27, 28, SPECIES_MISDREAVUS },
    { 27, 28, SPECIES_HOUNDOUR },
    { 28, 28, SPECIES_MISDREAVUS },
    { 28, 28, SPECIES_HOUNDOUR },
};

const struct WildPokemonInfo gMtPyre_2F_LandMonsInfo = { 10, gMtPyre_2F_LandMons };
const struct WildPokemon gMtPyre_3F_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 24, 24, SPECIES_SHUPPET },
    { 23, 23, SPECIES_SHUPPET },
    { 22, 22, SPECIES_SHUPPET },
    { 28, 29, SPECIES_MISDREAVUS },
    { 28, 29, SPECIES_HOUNDOUR },
    { 29, 29, SPECIES_HOUNDOUR },
    { 29, 29, SPECIES_MISDREAVUS },
};

const struct WildPokemonInfo gMtPyre_3F_LandMonsInfo = { 10, gMtPyre_3F_LandMons };
const struct WildPokemon gMtPyre_4F_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 24, 24, SPECIES_SHUPPET },
    { 28, 29, SPECIES_MISDREAVUS },
    { 28, 29, SPECIES_HOUNDOUR },
    { 27, 27, SPECIES_DUSKULL },
    { 28, 29, SPECIES_MURKROW },
    { 25, 25, SPECIES_DUSKULL },
    { 29, 29, SPECIES_MURKROW },
};

const struct WildPokemonInfo gMtPyre_4F_LandMonsInfo = { 10, gMtPyre_4F_LandMons };
const struct WildPokemon gMtPyre_5F_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 24, 24, SPECIES_SHUPPET },
    { 29, 30, SPECIES_MISDREAVUS },
    { 29, 30, SPECIES_HOUNDOUR },
    { 27, 27, SPECIES_DUSKULL },
    { 29, 30, SPECIES_MURKROW },
    { 29, 29, SPECIES_DUSKULL },
    { 30, 30, SPECIES_MURKROW },
};

const struct WildPokemonInfo gMtPyre_5F_LandMonsInfo = { 10, gMtPyre_5F_LandMons };
const struct WildPokemon gMtPyre_6F_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 24, 24, SPECIES_SHUPPET },
    { 29, 30, SPECIES_MISDREAVUS },
    { 29, 30, SPECIES_HOUNDOUR },
    { 29, 30, SPECIES_MURKROW },
    { 29, 30, SPECIES_SNEASEL },
    { 29, 29, SPECIES_DUSKULL },
    { 30, 30, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gMtPyre_6F_LandMonsInfo = { 10, gMtPyre_6F_LandMons };
const struct WildPokemon gMtPyre_Exterior_LandMons[] =
{
    { 27, 27, SPECIES_SHUPPET },
    { 27, 27, SPECIES_SHUPPET },
    { 28, 28, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 29, 29, SPECIES_VULPIX },
    { 27, 27, SPECIES_VULPIX },
    { 29, 29, SPECIES_VULPIX },
    { 25, 25, SPECIES_VULPIX },
    { 26, 28, SPECIES_CORSOLA_HOENN },
    { 27, 30, SPECIES_TORCHIC_HOENN },
    { 26, 26, SPECIES_WINGULL },
    { 28, 28, SPECIES_WINGULL },
};

const struct WildPokemonInfo gMtPyre_Exterior_LandMonsInfo = { 10, gMtPyre_Exterior_LandMons };
const struct WildPokemon gMtPyre_Summit_LandMons[] =
{
    { 28, 28, SPECIES_SHUPPET },
    { 29, 29, SPECIES_SHUPPET },
    { 27, 27, SPECIES_SHUPPET },
    { 26, 26, SPECIES_SHUPPET },
    { 30, 30, SPECIES_SHUPPET },
    { 25, 25, SPECIES_SHUPPET },
    { 30, 32, SPECIES_SNEASEL },
    { 30, 32, SPECIES_HOUNDOOM },
    { 30, 32, SPECIES_MISDREAVUS },
    { 32, 33, SPECIES_WEAVILE },
    { 28, 28, SPECIES_CHIMECHO },
    { 31, 32, SPECIES_MURKROW },
};

const struct WildPokemonInfo gMtPyre_Summit_LandMonsInfo = { 10, gMtPyre_Summit_LandMons };
const struct WildPokemon gGraniteCave_StevensRoom_LandMons[] =
{
    { 8, 10, SPECIES_ZUBAT },
    { 8, 10, SPECIES_GEODUDE },
    { 9, 11, SPECIES_ARON },
    { 9, 12, SPECIES_MAKUHITA },
    { 9, 11, SPECIES_MACHOP },
    { 10, 12, SPECIES_SABLEYE },
    { 10, 12, SPECIES_ZUBAT },
    { 10, 12, SPECIES_GEODUDE },
    { 10, 13, SPECIES_NOSEPASS },
    { 10, 13, SPECIES_MAWILE },
    { 11, 14, SPECIES_ABRA },
    { 12, 14, SPECIES_ARON },
};

const struct WildPokemonInfo gGraniteCave_StevensRoom_LandMonsInfo = { 10, gGraniteCave_StevensRoom_LandMons };
const struct WildPokemon gRoute125_WaterMons[] =
{
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WINGULL },
    { 25, 30, SPECIES_LUVDISC },
    { 30, 35, SPECIES_MANTINE },
};

const struct WildPokemonInfo gRoute125_WaterMonsInfo = { 4, gRoute125_WaterMons };
const struct WildPokemon gRoute125_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_WAILMER },
    { 15, 25, SPECIES_LUVDISC },
    { 15, 25, SPECIES_REMORAID },
    { 25, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_REMORAID },
    { 25, 30, SPECIES_LUVDISC },
    { 30, 35, SPECIES_OCTILLERY },
    { 30, 35, SPECIES_WAILORD },
};

const struct WildPokemonInfo gRoute125_FishingMonsInfo = { 30, gRoute125_FishingMons };
const struct WildPokemon gRoute126_WaterMons[] =
{
    { 25, 30, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_TENTACOOL },
    { 25, 30, SPECIES_CLAMPERL },
    { 25, 30, SPECIES_CORSOLA },
    { 30, 35, SPECIES_RELICANTH },
};

const struct WildPokemonInfo gRoute126_WaterMonsInfo = { 4, gRoute126_WaterMons };
const struct WildPokemon gRoute126_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_CLAMPERL },
    { 15, 25, SPECIES_CHINCHOU },
    { 15, 25, SPECIES_CORSOLA },
    { 25, 30, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_CLAMPERL },
    { 25, 30, SPECIES_CORSOLA },
    { 30, 35, SPECIES_RELICANTH },
    { 30, 35, SPECIES_HUNTAIL },
};

const struct WildPokemonInfo gRoute126_FishingMonsInfo = { 30, gRoute126_FishingMons };
const struct WildPokemon gRoute127_WaterMons[] =
{
    { 25, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_TENTACOOL },
    { 25, 30, SPECIES_HORSEA },
    { 28, 33, SPECIES_CARVANHA },
    { 30, 35, SPECIES_SHARPEDO },
};

const struct WildPokemonInfo gRoute127_WaterMonsInfo = { 4, gRoute127_WaterMons };
const struct WildPokemon gRoute127_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_WAILMER },
    { 15, 25, SPECIES_CARVANHA },
    { 15, 25, SPECIES_HORSEA },
    { 25, 30, SPECIES_CARVANHA },
    { 25, 30, SPECIES_HORSEA },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_SEADRA },
    { 30, 35, SPECIES_WAILORD },
};

const struct WildPokemonInfo gRoute127_FishingMonsInfo = { 30, gRoute127_FishingMons };
const struct WildPokemon gRoute128_WaterMons[] =
{
    { 25, 35, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_CORSOLA },
    { 25, 30, SPECIES_HORSEA },
    { 30, 35, SPECIES_RELICANTH },
};

const struct WildPokemonInfo gRoute128_WaterMonsInfo = { 4, gRoute128_WaterMons };
const struct WildPokemon gRoute128_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_HORSEA },
    { 15, 25, SPECIES_CORPHISH },
    { 15, 25, SPECIES_CORSOLA },
    { 25, 30, SPECIES_HORSEA },
    { 25, 30, SPECIES_CORPHISH },
    { 30, 35, SPECIES_SEADRA },
    { 30, 35, SPECIES_CRAWDAUNT },
    { 30, 35, SPECIES_RELICANTH },
};

const struct WildPokemonInfo gRoute128_FishingMonsInfo = { 30, gRoute128_FishingMons };
const struct WildPokemon gRoute129_WaterMons[] =
{
    { 25, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_CARVANHA },
    { 25, 30, SPECIES_TENTACOOL },
    { 28, 33, SPECIES_PELIPPER },
    { 30, 35, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute129_WaterMonsInfo = { 4, gRoute129_WaterMons };
const struct WildPokemon gRoute129_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_WAILMER },
    { 15, 25, SPECIES_CARVANHA },
    { 15, 25, SPECIES_STARYU },
    { 25, 35, SPECIES_WAILMER },
    { 25, 35, SPECIES_CARVANHA },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_STARYU },
    { 35, 40, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute129_FishingMonsInfo = { 30, gRoute129_FishingMons };
const struct WildPokemon gRoute130_LandMons[] =
{
    { 30, 30, SPECIES_WYNAUT },
    { 35, 35, SPECIES_WYNAUT },
    { 25, 25, SPECIES_WYNAUT },
    { 40, 40, SPECIES_WYNAUT },
    { 20, 20, SPECIES_WYNAUT },
    { 45, 45, SPECIES_WYNAUT },
    { 15, 15, SPECIES_WYNAUT },
    { 50, 50, SPECIES_WYNAUT },
    { 10, 10, SPECIES_WYNAUT },
    { 5, 5, SPECIES_WYNAUT },
    { 10, 10, SPECIES_WYNAUT },
    { 5, 5, SPECIES_WYNAUT },
};

const struct WildPokemonInfo gRoute130_LandMonsInfo = { 20, gRoute130_LandMons };
const struct WildPokemon gRoute130_WaterMons[] =
{
    { 25, 30, SPECIES_HORSEA },
    { 25, 30, SPECIES_WINGULL },
    { 25, 30, SPECIES_STARYU },
    { 25, 30, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_WYNAUT },
};

const struct WildPokemonInfo gRoute130_WaterMonsInfo = { 4, gRoute130_WaterMons };
const struct WildPokemon gRoute130_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_HORSEA },
    { 15, 25, SPECIES_STARYU },
    { 15, 25, SPECIES_CHINCHOU },
    { 25, 30, SPECIES_HORSEA },
    { 25, 30, SPECIES_STARYU },
    { 25, 30, SPECIES_CHINCHOU },
    { 30, 35, SPECIES_SEADRA },
    { 35, 40, SPECIES_STARMIE },
};

const struct WildPokemonInfo gRoute130_FishingMonsInfo = { 30, gRoute130_FishingMons };
const struct WildPokemon gRoute131_WaterMons[] =
{
    { 25, 35, SPECIES_WAILMER },
    { 28, 35, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_CARVANHA },
    { 28, 33, SPECIES_QWILFISH },
    { 30, 35, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute131_WaterMonsInfo = { 4, gRoute131_WaterMons };
const struct WildPokemon gRoute131_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 15, 25, SPECIES_WAILMER },
    { 15, 25, SPECIES_HORSEA },
    { 15, 25, SPECIES_CORPHISH },
    { 25, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_HORSEA },
    { 25, 30, SPECIES_CORPHISH },
    { 30, 35, SPECIES_SEADRA },
    { 35, 40, SPECIES_CRAWDAUNT },
};

const struct WildPokemonInfo gRoute131_FishingMonsInfo = { 30, gRoute131_FishingMons };
const struct WildPokemon gRoute132_WaterMons[] =
{
    { 30, 35, SPECIES_CARVANHA },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_WAILMER },
    { 35, 40, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gRoute132_WaterMonsInfo = { 4, gRoute132_WaterMons };
const struct WildPokemon gRoute132_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_CARVANHA },
    { 20, 30, SPECIES_CARVANHA },
    { 20, 30, SPECIES_WAILMER },
    { 20, 30, SPECIES_TENTACOOL },
    { 30, 40, SPECIES_CARVANHA },
    { 30, 40, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_WAILMER },
    { 35, 40, SPECIES_GYARADOS },
    { 35, 45, SPECIES_CRAWDAUNT },
};

const struct WildPokemonInfo gRoute132_FishingMonsInfo = { 30, gRoute132_FishingMons };
const struct WildPokemon gRoute133_WaterMons[] =
{
    { 30, 35, SPECIES_HORSEA },
    { 30, 35, SPECIES_SEADRA },
    { 30, 35, SPECIES_LUVDISC },
    { 30, 35, SPECIES_CORSOLA },
    { 35, 40, SPECIES_KINGDRA },
};

const struct WildPokemonInfo gRoute133_WaterMonsInfo = { 4, gRoute133_WaterMons };
const struct WildPokemon gRoute133_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_HORSEA },
    { 20, 30, SPECIES_HORSEA },
    { 20, 30, SPECIES_LUVDISC },
    { 20, 30, SPECIES_CORSOLA },
    { 30, 40, SPECIES_HORSEA },
    { 30, 40, SPECIES_SEADRA },
    { 30, 35, SPECIES_LUVDISC },
    { 35, 40, SPECIES_CORSOLA },
    { 35, 45, SPECIES_KINGDRA },
};

const struct WildPokemonInfo gRoute133_FishingMonsInfo = { 30, gRoute133_FishingMons };
const struct WildPokemon gRoute134_WaterMons[] =
{
    { 30, 35, SPECIES_WAILMER },
    { 30, 35, SPECIES_PELIPPER },
    { 30, 35, SPECIES_STARYU },
    { 30, 35, SPECIES_TENTACOOL },
    { 35, 40, SPECIES_LANTURN },
};

const struct WildPokemonInfo gRoute134_WaterMonsInfo = { 4, gRoute134_WaterMons };
const struct WildPokemon gRoute134_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 20, 30, SPECIES_WAILMER },
    { 20, 30, SPECIES_CHINCHOU },
    { 20, 30, SPECIES_HORSEA },
    { 30, 40, SPECIES_WAILMER },
    { 30, 40, SPECIES_CHINCHOU },
    { 30, 35, SPECIES_HORSEA },
    { 35, 40, SPECIES_LANTURN },
    { 35, 45, SPECIES_WAILORD },
};

const struct WildPokemonInfo gRoute134_FishingMonsInfo = { 30, gRoute134_FishingMons };
const struct WildPokemon gAbandonedShip_HiddenFloorCorridors_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACRUEL },
};

const struct WildPokemonInfo gAbandonedShip_HiddenFloorCorridors_WaterMonsInfo = { 4, gAbandonedShip_HiddenFloorCorridors_WaterMons };
const struct WildPokemon gAbandonedShip_HiddenFloorCorridors_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_TENTACOOL },
    { 25, 30, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACOOL },
    { 30, 35, SPECIES_TENTACRUEL },
    { 25, 30, SPECIES_TENTACRUEL },
    { 20, 25, SPECIES_TENTACRUEL },
};

const struct WildPokemonInfo gAbandonedShip_HiddenFloorCorridors_FishingMonsInfo = { 20, gAbandonedShip_HiddenFloorCorridors_FishingMons };
const struct WildPokemon gSeafloorCavern_Room1_LandMons[] =
{
    { 38, 40, SPECIES_GOLBAT },
    { 38, 40, SPECIES_TENTACOOL },
    { 39, 41, SPECIES_SEALEO },
    { 39, 41, SPECIES_GOLBAT },
    { 39, 41, SPECIES_CORSOLA },
    { 40, 42, SPECIES_SEALEO },
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_LANTURN },
    { 41, 43, SPECIES_RELICANTH },
    { 39, 41, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_HUNTAIL },
    { 42, 44, SPECIES_GOREBYSS },
};

const struct WildPokemonInfo gSeafloorCavern_Room1_LandMonsInfo = { 4, gSeafloorCavern_Room1_LandMons };
const struct WildPokemon gSeafloorCavern_Room2_LandMons[] =
{
    { 38, 40, SPECIES_GOLBAT },
    { 38, 40, SPECIES_TENTACOOL },
    { 39, 41, SPECIES_SEALEO },
    { 39, 41, SPECIES_GOLBAT },
    { 39, 41, SPECIES_CORSOLA },
    { 40, 42, SPECIES_SEALEO },
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_LANTURN },
    { 41, 43, SPECIES_RELICANTH },
    { 39, 41, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_HUNTAIL },
    { 42, 44, SPECIES_GOREBYSS },
};

const struct WildPokemonInfo gSeafloorCavern_Room2_LandMonsInfo = { 4, gSeafloorCavern_Room2_LandMons };
const struct WildPokemon gSeafloorCavern_Room3_LandMons[] =
{
    { 38, 40, SPECIES_GOLBAT },
    { 38, 40, SPECIES_TENTACOOL },
    { 39, 41, SPECIES_SEALEO },
    { 39, 41, SPECIES_GOLBAT },
    { 39, 41, SPECIES_CORSOLA },
    { 40, 42, SPECIES_SEALEO },
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_LANTURN },
    { 41, 43, SPECIES_RELICANTH },
    { 39, 41, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_HUNTAIL },
    { 42, 44, SPECIES_GOREBYSS },
};

const struct WildPokemonInfo gSeafloorCavern_Room3_LandMonsInfo = { 4, gSeafloorCavern_Room3_LandMons };
const struct WildPokemon gSeafloorCavern_Room4_LandMons[] =
{
    { 38, 40, SPECIES_GOLBAT },
    { 38, 40, SPECIES_TENTACOOL },
    { 39, 41, SPECIES_SEALEO },
    { 39, 41, SPECIES_GOLBAT },
    { 39, 41, SPECIES_CORSOLA },
    { 40, 42, SPECIES_SEALEO },
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_LANTURN },
    { 41, 43, SPECIES_RELICANTH },
    { 39, 41, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_HUNTAIL },
    { 42, 44, SPECIES_GOREBYSS },
};

const struct WildPokemonInfo gSeafloorCavern_Room4_LandMonsInfo = { 4, gSeafloorCavern_Room4_LandMons };
const struct WildPokemon gSeafloorCavern_Room5_LandMons[] =
{
    { 40, 42, SPECIES_GOLBAT },
    { 40, 42, SPECIES_SEALEO },
    { 41, 43, SPECIES_TENTACRUEL },
    { 41, 43, SPECIES_CORSOLA },
    { 41, 43, SPECIES_LANTURN },
    { 40, 42, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_RELICANTH },
    { 42, 44, SPECIES_SHARPEDO },
    { 43, 45, SPECIES_HUNTAIL },
    { 43, 45, SPECIES_GOREBYSS },
    { 43, 45, SPECIES_SHELLDER },
    { 43, 45, SPECIES_SNORUNT },
};

const struct WildPokemonInfo gSeafloorCavern_Room5_LandMonsInfo = { 4, gSeafloorCavern_Room5_LandMons };
const struct WildPokemon gSeafloorCavern_Room6_LandMons[] =
{
    { 40, 42, SPECIES_GOLBAT },
    { 40, 42, SPECIES_SEALEO },
    { 41, 43, SPECIES_TENTACRUEL },
    { 41, 43, SPECIES_CORSOLA },
    { 41, 43, SPECIES_LANTURN },
    { 40, 42, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_RELICANTH },
    { 42, 44, SPECIES_SHARPEDO },
    { 43, 45, SPECIES_HUNTAIL },
    { 43, 45, SPECIES_GOREBYSS },
    { 43, 45, SPECIES_SHELLDER },
    { 43, 45, SPECIES_SNORUNT },
};

const struct WildPokemonInfo gSeafloorCavern_Room6_LandMonsInfo = { 4, gSeafloorCavern_Room6_LandMons };
const struct WildPokemon gSeafloorCavern_Room6_WaterMons[] =
{
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_SHARPEDO },
    { 41, 43, SPECIES_LANTURN },
    { 42, 44, SPECIES_RELICANTH },
    { 43, 45, SPECIES_WAILORD },
};

const struct WildPokemonInfo gSeafloorCavern_Room6_WaterMonsInfo = { 4, gSeafloorCavern_Room6_WaterMons };
const struct WildPokemon gSeafloorCavern_Room6_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gSeafloorCavern_Room6_FishingMonsInfo = { 10, gSeafloorCavern_Room6_FishingMons };
const struct WildPokemon gSeafloorCavern_Room7_LandMons[] =
{
    { 40, 42, SPECIES_GOLBAT },
    { 40, 42, SPECIES_SEALEO },
    { 41, 43, SPECIES_TENTACRUEL },
    { 41, 43, SPECIES_CORSOLA },
    { 41, 43, SPECIES_LANTURN },
    { 40, 42, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_RELICANTH },
    { 42, 44, SPECIES_SHARPEDO },
    { 43, 45, SPECIES_HUNTAIL },
    { 43, 45, SPECIES_GOREBYSS },
    { 43, 45, SPECIES_SHELLDER },
    { 43, 45, SPECIES_SNORUNT },
};

const struct WildPokemonInfo gSeafloorCavern_Room7_LandMonsInfo = { 4, gSeafloorCavern_Room7_LandMons };
const struct WildPokemon gSeafloorCavern_Room7_WaterMons[] =
{
    { 40, 42, SPECIES_TENTACRUEL },
    { 40, 42, SPECIES_SHARPEDO },
    { 41, 43, SPECIES_LANTURN },
    { 42, 44, SPECIES_RELICANTH },
    { 43, 45, SPECIES_WAILORD },
};

const struct WildPokemonInfo gSeafloorCavern_Room7_WaterMonsInfo = { 4, gSeafloorCavern_Room7_WaterMons };
const struct WildPokemon gSeafloorCavern_Room7_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gSeafloorCavern_Room7_FishingMonsInfo = { 10, gSeafloorCavern_Room7_FishingMons };
const struct WildPokemon gSeafloorCavern_Room8_LandMons[] =
{
    { 40, 42, SPECIES_GOLBAT },
    { 40, 42, SPECIES_SEALEO },
    { 41, 43, SPECIES_TENTACRUEL },
    { 41, 43, SPECIES_CORSOLA },
    { 41, 43, SPECIES_LANTURN },
    { 40, 42, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_RELICANTH },
    { 42, 44, SPECIES_SHARPEDO },
    { 43, 45, SPECIES_HUNTAIL },
    { 43, 45, SPECIES_GOREBYSS },
    { 43, 45, SPECIES_SHELLDER },
    { 43, 45, SPECIES_SNORUNT },
};

const struct WildPokemonInfo gSeafloorCavern_Room8_LandMonsInfo = { 4, gSeafloorCavern_Room8_LandMons };
const struct WildPokemon gSeafloorCavern_Room9_LandMons[] =
{
    { 42, 44, SPECIES_SEALEO },
    { 42, 44, SPECIES_GOLBAT },
    { 43, 45, SPECIES_TENTACRUEL },
    { 43, 45, SPECIES_RELICANTH },
    { 43, 45, SPECIES_LANTURN },
    { 43, 45, SPECIES_SHARPEDO },
    { 43, 45, SPECIES_HUNTAIL },
    { 43, 45, SPECIES_GOREBYSS },
    { 42, 44, SPECIES_CLAMPERL },
    { 42, 44, SPECIES_CORSOLA },
    { 44, 45, SPECIES_SHELLDER },
    { 44, 45, SPECIES_SNORUNT },
};

const struct WildPokemonInfo gSeafloorCavern_Room9_LandMonsInfo = { 4, gSeafloorCavern_Room9_LandMons };
const struct WildPokemon gSeafloorCavern_Room9_WaterMons[] =
{
    { 42, 44, SPECIES_SHARPEDO },
    { 42, 44, SPECIES_TENTACRUEL },
    { 43, 45, SPECIES_RELICANTH },
    { 43, 45, SPECIES_LANTURN },
    { 44, 45, SPECIES_WAILORD },
};

const struct WildPokemonInfo gSeafloorCavern_Room9_WaterMonsInfo = { 4, gSeafloorCavern_Room9_WaterMons };
const struct WildPokemon gSeafloorCavern_Entrance_WaterMons[] =
{
    { 38, 40, SPECIES_TENTACRUEL },
    { 38, 40, SPECIES_WAILMER },
    { 39, 41, SPECIES_CLAMPERL },
    { 40, 42, SPECIES_LANTURN },
    { 41, 43, SPECIES_SHARPEDO },
};

const struct WildPokemonInfo gSeafloorCavern_Entrance_WaterMonsInfo = { 4, gSeafloorCavern_Entrance_WaterMons };
const struct WildPokemon gSeafloorCavern_Entrance_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gSeafloorCavern_Entrance_FishingMonsInfo = { 10, gSeafloorCavern_Entrance_FishingMons };
const struct WildPokemon gTerraCave_Entrance_LandMons[] =
{
    { 38, 40, SPECIES_GRAVELER },
    { 38, 40, SPECIES_NUMEL },
    { 39, 41, SPECIES_MACHOKE },
    { 39, 41, SPECIES_TORKOAL },
    { 39, 41, SPECIES_MAGCARGO },
    { 40, 42, SPECIES_CAMERUPT },
    { 40, 42, SPECIES_LAIRON },
    { 40, 42, SPECIES_GOLEM },
    { 41, 43, SPECIES_PUPITAR },
    { 41, 43, SPECIES_DONPHAN },
    { 44, 45, SPECIES_CAMERUPT },
    { 44, 45, SPECIES_CLAYDOL },
};

const struct WildPokemonInfo gTerraCave_Entrance_LandMonsInfo = { 10, gTerraCave_Entrance_LandMons };
const struct WildPokemon gTerraCave_End_LandMons[] =
{
    { 40, 42, SPECIES_CAMERUPT },
    { 40, 42, SPECIES_GRAVELER },
    { 41, 43, SPECIES_TORKOAL },
    { 41, 43, SPECIES_MAGCARGO },
    { 41, 43, SPECIES_GOLEM },
    { 41, 43, SPECIES_MACHOKE },
    { 42, 44, SPECIES_LAIRON },
    { 42, 44, SPECIES_DONPHAN },
    { 43, 45, SPECIES_PUPITAR },
    { 44, 45, SPECIES_CAMERUPT },
    { 44, 45, SPECIES_CLAYDOL },
    { 44, 45, SPECIES_DONPHAN },
};

const struct WildPokemonInfo gTerraCave_End_LandMonsInfo = { 10, gTerraCave_End_LandMons };
const struct WildPokemon gCaveOfOrigin_Entrance_LandMons[] =
{
    { 35, 40, SPECIES_DRATINI },
    { 38, 43, SPECIES_DRAGONAIR },
    { 35, 40, SPECIES_BAGON },
    { 38, 43, SPECIES_SHELGON },
    { 35, 40, SPECIES_LARVITAR },
    { 38, 43, SPECIES_PUPITAR },
    { 37, 42, SPECIES_ABSOL },
    { 36, 41, SPECIES_MISDREAVUS },
    { 40, 45, SPECIES_GENGAR },
    { 40, 45, SPECIES_DUSCLOPS },
    { 42, 47, SPECIES_SALAMENCE },
    { 43, 48, SPECIES_DRAGONITE },
};

const struct WildPokemonInfo gCaveOfOrigin_Entrance_LandMonsInfo = { 4, gCaveOfOrigin_Entrance_LandMons };
const struct WildPokemon gCaveOfOrigin_1F_LandMons[] =
{
    { 35, 40, SPECIES_DRATINI },
    { 38, 43, SPECIES_DRAGONAIR },
    { 35, 40, SPECIES_BAGON },
    { 38, 43, SPECIES_SHELGON },
    { 35, 40, SPECIES_LARVITAR },
    { 38, 43, SPECIES_PUPITAR },
    { 37, 42, SPECIES_ABSOL },
    { 36, 41, SPECIES_MISDREAVUS },
    { 40, 45, SPECIES_GENGAR },
    { 40, 45, SPECIES_DUSCLOPS },
    { 42, 47, SPECIES_SALAMENCE },
    { 43, 48, SPECIES_DRAGONITE },
};

const struct WildPokemonInfo gCaveOfOrigin_1F_LandMonsInfo = { 4, gCaveOfOrigin_1F_LandMons };
const struct WildPokemon gCaveOfOrigin_UnusedRubySapphireMap1_LandMons[] =
{
    { 35, 40, SPECIES_DRATINI },
    { 38, 43, SPECIES_DRAGONAIR },
    { 35, 40, SPECIES_BAGON },
    { 38, 43, SPECIES_SHELGON },
    { 35, 40, SPECIES_LARVITAR },
    { 38, 43, SPECIES_PUPITAR },
    { 37, 42, SPECIES_ABSOL },
    { 36, 41, SPECIES_MISDREAVUS },
    { 40, 45, SPECIES_GENGAR },
    { 40, 45, SPECIES_DUSCLOPS },
    { 42, 47, SPECIES_SALAMENCE },
    { 43, 48, SPECIES_DRAGONITE },
};

const struct WildPokemonInfo gCaveOfOrigin_UnusedRubySapphireMap1_LandMonsInfo = { 4, gCaveOfOrigin_UnusedRubySapphireMap1_LandMons };
const struct WildPokemon gCaveOfOrigin_UnusedRubySapphireMap2_LandMons[] =
{
    { 35, 40, SPECIES_DRATINI },
    { 38, 43, SPECIES_DRAGONAIR },
    { 35, 40, SPECIES_BAGON },
    { 38, 43, SPECIES_SHELGON },
    { 35, 40, SPECIES_LARVITAR },
    { 38, 43, SPECIES_PUPITAR },
    { 37, 42, SPECIES_ABSOL },
    { 36, 41, SPECIES_MISDREAVUS },
    { 40, 45, SPECIES_GENGAR },
    { 40, 45, SPECIES_DUSCLOPS },
    { 42, 47, SPECIES_SALAMENCE },
    { 43, 48, SPECIES_DRAGONITE },
};

const struct WildPokemonInfo gCaveOfOrigin_UnusedRubySapphireMap2_LandMonsInfo = { 4, gCaveOfOrigin_UnusedRubySapphireMap2_LandMons };
const struct WildPokemon gCaveOfOrigin_UnusedRubySapphireMap3_LandMons[] =
{
    { 35, 40, SPECIES_DRATINI },
    { 38, 43, SPECIES_DRAGONAIR },
    { 35, 40, SPECIES_BAGON },
    { 38, 43, SPECIES_SHELGON },
    { 35, 40, SPECIES_LARVITAR },
    { 38, 43, SPECIES_PUPITAR },
    { 37, 42, SPECIES_ABSOL },
    { 36, 41, SPECIES_MISDREAVUS },
    { 40, 45, SPECIES_GENGAR },
    { 40, 45, SPECIES_DUSCLOPS },
    { 42, 47, SPECIES_SALAMENCE },
    { 43, 48, SPECIES_DRAGONITE },
};

const struct WildPokemonInfo gCaveOfOrigin_UnusedRubySapphireMap3_LandMonsInfo = { 4, gCaveOfOrigin_UnusedRubySapphireMap3_LandMons };
const struct WildPokemon gNewMauville_Entrance_LandMons[] =
{
    { 24, 24, SPECIES_VOLTORB },
    { 24, 24, SPECIES_MAGNEMITE },
    { 25, 25, SPECIES_VOLTORB },
    { 25, 25, SPECIES_MAGNEMITE },
    { 23, 23, SPECIES_VOLTORB },
    { 23, 23, SPECIES_MAGNEMITE },
    { 26, 26, SPECIES_VOLTORB },
    { 25, 26, SPECIES_FLAAFFY },
    { 22, 22, SPECIES_VOLTORB },
    { 26, 26, SPECIES_ELECTABUZZ },
    { 22, 22, SPECIES_VOLTORB },
    { 24, 24, SPECIES_RIOLU },
};

const struct WildPokemonInfo gNewMauville_Entrance_LandMonsInfo = { 10, gNewMauville_Entrance_LandMons };
const struct WildPokemon gSafariZone_Southwest_LandMons[] =
{
    { 25, 25, SPECIES_ODDISH },
    { 27, 27, SPECIES_ODDISH },
    { 25, 25, SPECIES_GIRAFARIG },
    { 27, 27, SPECIES_GIRAFARIG },
    { 25, 25, SPECIES_NATU },
    { 27, 27, SPECIES_DODUO },
    { 25, 25, SPECIES_GLOOM },
    { 27, 27, SPECIES_WOBBUFFET },
    { 25, 25, SPECIES_PIKACHU },
    { 27, 27, SPECIES_WOBBUFFET },
    { 27, 27, SPECIES_PIKACHU },
    { 29, 29, SPECIES_WOBBUFFET },
};

const struct WildPokemonInfo gSafariZone_Southwest_LandMonsInfo = { 25, gSafariZone_Southwest_LandMons };
const struct WildPokemon gSafariZone_Southwest_WaterMons[] =
{
    { 20, 30, SPECIES_PSYDUCK },
    { 20, 30, SPECIES_PSYDUCK },
    { 30, 35, SPECIES_PSYDUCK },
    { 30, 35, SPECIES_PSYDUCK },
    { 30, 35, SPECIES_PSYDUCK },
};

const struct WildPokemonInfo gSafariZone_Southwest_WaterMonsInfo = { 9, gSafariZone_Southwest_WaterMons };
const struct WildPokemon gSafariZone_Southwest_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 25, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_GOLDEEN },
    { 25, 30, SPECIES_GOLDEEN },
    { 30, 35, SPECIES_GOLDEEN },
    { 30, 35, SPECIES_SEAKING },
    { 35, 40, SPECIES_SEAKING },
    { 25, 30, SPECIES_SEAKING },
};

const struct WildPokemonInfo gSafariZone_Southwest_FishingMonsInfo = { 35, gSafariZone_Southwest_FishingMons };
const struct WildPokemon gSafariZone_North_LandMons[] =
{
    { 27, 27, SPECIES_PHANPY },
    { 27, 27, SPECIES_ODDISH },
    { 29, 29, SPECIES_PHANPY },
    { 29, 29, SPECIES_ODDISH },
    { 27, 27, SPECIES_NATU },
    { 29, 29, SPECIES_GLOOM },
    { 31, 31, SPECIES_GLOOM },
    { 29, 29, SPECIES_NATU },
    { 29, 29, SPECIES_XATU },
    { 27, 27, SPECIES_HERACROSS },
    { 31, 31, SPECIES_XATU },
    { 29, 29, SPECIES_HERACROSS },
};

const struct WildPokemonInfo gSafariZone_North_LandMonsInfo = { 25, gSafariZone_North_LandMons };
const struct WildPokemon gSafariZone_North_RockSmashMons[] =
{
    { 10, 15, SPECIES_GEODUDE },
    { 5, 10, SPECIES_GEODUDE },
    { 15, 20, SPECIES_GEODUDE },
    { 20, 25, SPECIES_GEODUDE },
    { 25, 30, SPECIES_GEODUDE },
};

const struct WildPokemonInfo gSafariZone_North_RockSmashMonsInfo = { 25, gSafariZone_North_RockSmashMons };
const struct WildPokemon gSafariZone_Northwest_LandMons[] =
{
    { 27, 27, SPECIES_RHYHORN },
    { 27, 27, SPECIES_ODDISH },
    { 29, 29, SPECIES_RHYHORN },
    { 29, 29, SPECIES_ODDISH },
    { 27, 27, SPECIES_DODUO },
    { 29, 29, SPECIES_GLOOM },
    { 31, 31, SPECIES_GLOOM },
    { 29, 29, SPECIES_DODUO },
    { 29, 29, SPECIES_DODRIO },
    { 27, 27, SPECIES_PINSIR },
    { 31, 31, SPECIES_DODRIO },
    { 29, 29, SPECIES_PINSIR },
};

const struct WildPokemonInfo gSafariZone_Northwest_LandMonsInfo = { 25, gSafariZone_Northwest_LandMons };
const struct WildPokemon gSafariZone_Northwest_WaterMons[] =
{
    { 20, 30, SPECIES_PSYDUCK },
    { 20, 30, SPECIES_PSYDUCK },
    { 30, 35, SPECIES_PSYDUCK },
    { 30, 35, SPECIES_GOLDUCK },
    { 25, 40, SPECIES_GOLDUCK },
};

const struct WildPokemonInfo gSafariZone_Northwest_WaterMonsInfo = { 9, gSafariZone_Northwest_WaterMons };
const struct WildPokemon gSafariZone_Northwest_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 25, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_GOLDEEN },
    { 25, 30, SPECIES_GOLDEEN },
    { 30, 35, SPECIES_GOLDEEN },
    { 30, 35, SPECIES_SEAKING },
    { 35, 40, SPECIES_SEAKING },
    { 25, 30, SPECIES_SEAKING },
};

const struct WildPokemonInfo gSafariZone_Northwest_FishingMonsInfo = { 35, gSafariZone_Northwest_FishingMons };
const struct WildPokemon gVictoryRoad_B1F_LandMons[] =
{
    { 40, 44, SPECIES_GOLBAT },
    { 40, 44, SPECIES_HARIYAMA },
    { 42, 46, SPECIES_LAIRON },
    { 42, 46, SPECIES_GRAVELER },
    { 42, 46, SPECIES_MEDICHAM },
    { 42, 46, SPECIES_LOUDRED },
    { 43, 47, SPECIES_MAWILE },
    { 44, 48, SPECIES_GOLBAT },
    { 44, 48, SPECIES_PUPITAR },
    { 46, 50, SPECIES_LAIRON },
    { 46, 50, SPECIES_SHELGON },
    { 46, 50, SPECIES_MEDICHAM },
};

const struct WildPokemonInfo gVictoryRoad_B1F_LandMonsInfo = { 10, gVictoryRoad_B1F_LandMons };
const struct WildPokemon gVictoryRoad_B1F_RockSmashMons[] =
{
    { 30, 40, SPECIES_GRAVELER },
    { 30, 40, SPECIES_GEODUDE },
    { 35, 40, SPECIES_GRAVELER },
    { 35, 40, SPECIES_GRAVELER },
    { 35, 40, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gVictoryRoad_B1F_RockSmashMonsInfo = { 20, gVictoryRoad_B1F_RockSmashMons };
const struct WildPokemon gVictoryRoad_B2F_LandMons[] =
{
    { 40, 44, SPECIES_GOLBAT },
    { 40, 44, SPECIES_HARIYAMA },
    { 42, 46, SPECIES_LAIRON },
    { 42, 46, SPECIES_GRAVELER },
    { 42, 46, SPECIES_MEDICHAM },
    { 42, 46, SPECIES_LOUDRED },
    { 43, 47, SPECIES_MAWILE },
    { 44, 48, SPECIES_GOLBAT },
    { 44, 48, SPECIES_PUPITAR },
    { 46, 50, SPECIES_LAIRON },
    { 44, 44, SPECIES_GABITE },
    { 46, 46, SPECIES_GABITE },
};

const struct WildPokemonInfo gVictoryRoad_B2F_LandMonsInfo = { 10, gVictoryRoad_B2F_LandMons };
const struct WildPokemon gVictoryRoad_B2F_WaterMons[] =
{
    { 30, 35, SPECIES_GOLBAT },
    { 25, 30, SPECIES_GOLBAT },
    { 35, 40, SPECIES_GOLBAT },
    { 35, 40, SPECIES_GOLBAT },
    { 35, 40, SPECIES_GOLBAT },
};

const struct WildPokemonInfo gVictoryRoad_B2F_WaterMonsInfo = { 4, gVictoryRoad_B2F_WaterMons };
const struct WildPokemon gVictoryRoad_B2F_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 30, 35, SPECIES_WHISCASH },
    { 35, 40, SPECIES_WHISCASH },
    { 40, 45, SPECIES_WHISCASH },
};

const struct WildPokemonInfo gVictoryRoad_B2F_FishingMonsInfo = { 30, gVictoryRoad_B2F_FishingMons };
const struct WildPokemon gMeteorFalls_1F_1R_LandMons[] =
{
    { 16, 16, SPECIES_ZUBAT },
    { 17, 17, SPECIES_ZUBAT },
    { 18, 18, SPECIES_ZUBAT },
    { 15, 15, SPECIES_ZUBAT },
    { 14, 14, SPECIES_ZUBAT },
    { 16, 16, SPECIES_SOLROCK },
    { 18, 22, SPECIES_ARON },
    { 14, 14, SPECIES_SOLROCK },
    { 16, 20, SPECIES_LARVITAR },
    { 20, 20, SPECIES_ZUBAT },
    { 28, 32, SPECIES_PUPITAR },
    { 20, 20, SPECIES_ZUBAT },
};

const struct WildPokemonInfo gMeteorFalls_1F_1R_LandMonsInfo = { 10, gMeteorFalls_1F_1R_LandMons };
const struct WildPokemon gMeteorFalls_1F_1R_WaterMons[] =
{
    { 5, 35, SPECIES_ZUBAT },
    { 30, 35, SPECIES_ZUBAT },
    { 25, 35, SPECIES_SOLROCK },
    { 15, 25, SPECIES_SOLROCK },
    { 5, 15, SPECIES_SOLROCK },
};

const struct WildPokemonInfo gMeteorFalls_1F_1R_WaterMonsInfo = { 4, gMeteorFalls_1F_1R_WaterMons };
const struct WildPokemon gMeteorFalls_1F_1R_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 20, 25, SPECIES_BARBOACH },
    { 35, 40, SPECIES_BARBOACH },
    { 40, 45, SPECIES_BARBOACH },
};

const struct WildPokemonInfo gMeteorFalls_1F_1R_FishingMonsInfo = { 30, gMeteorFalls_1F_1R_FishingMons };
const struct WildPokemon gMeteorFalls_1F_2R_LandMons[] =
{
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_GOLBAT },
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_SOLROCK },
    { 33, 33, SPECIES_SOLROCK },
    { 37, 37, SPECIES_SOLROCK },
    { 35, 35, SPECIES_GOLBAT },
    { 39, 39, SPECIES_SOLROCK },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
};

const struct WildPokemonInfo gMeteorFalls_1F_2R_LandMonsInfo = { 10, gMeteorFalls_1F_2R_LandMons };
const struct WildPokemon gMeteorFalls_1F_2R_WaterMons[] =
{
    { 30, 35, SPECIES_GOLBAT },
    { 30, 35, SPECIES_GOLBAT },
    { 25, 35, SPECIES_SOLROCK },
    { 15, 25, SPECIES_SOLROCK },
    { 5, 15, SPECIES_SOLROCK },
};

const struct WildPokemonInfo gMeteorFalls_1F_2R_WaterMonsInfo = { 4, gMeteorFalls_1F_2R_WaterMons };
const struct WildPokemon gMeteorFalls_1F_2R_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 30, 35, SPECIES_WHISCASH },
    { 35, 40, SPECIES_WHISCASH },
    { 40, 45, SPECIES_WHISCASH },
};

const struct WildPokemonInfo gMeteorFalls_1F_2R_FishingMonsInfo = { 30, gMeteorFalls_1F_2R_FishingMons };
const struct WildPokemon gMeteorFalls_B1F_1R_LandMons[] =
{
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_GOLBAT },
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_SOLROCK },
    { 33, 33, SPECIES_SOLROCK },
    { 37, 37, SPECIES_SOLROCK },
    { 35, 35, SPECIES_GOLBAT },
    { 39, 39, SPECIES_SOLROCK },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
    { 25, 30, SPECIES_GIBLE },
    { 25, 30, SPECIES_GIBLE },
};

const struct WildPokemonInfo gMeteorFalls_B1F_1R_LandMonsInfo = { 10, gMeteorFalls_B1F_1R_LandMons };
const struct WildPokemon gMeteorFalls_B1F_1R_WaterMons[] =
{
    { 30, 35, SPECIES_GOLBAT },
    { 30, 35, SPECIES_GOLBAT },
    { 25, 35, SPECIES_SOLROCK },
    { 15, 25, SPECIES_SOLROCK },
    { 5, 15, SPECIES_SOLROCK },
};

const struct WildPokemonInfo gMeteorFalls_B1F_1R_WaterMonsInfo = { 4, gMeteorFalls_B1F_1R_WaterMons };
const struct WildPokemon gMeteorFalls_B1F_1R_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_BARBOACH },
    { 25, 30, SPECIES_BARBOACH },
    { 30, 35, SPECIES_BARBOACH },
    { 30, 35, SPECIES_WHISCASH },
    { 35, 40, SPECIES_WHISCASH },
    { 40, 45, SPECIES_WHISCASH },
};

const struct WildPokemonInfo gMeteorFalls_B1F_1R_FishingMonsInfo = { 30, gMeteorFalls_B1F_1R_FishingMons };
const struct WildPokemon gShoalCave_LowTideStairsRoom_LandMons[] =
{
    { 26, 28, SPECIES_SPHEAL },
    { 26, 28, SPECIES_ZUBAT },
    { 27, 29, SPECIES_SNORUNT },
    { 27, 30, SPECIES_GOLBAT },
    { 28, 30, SPECIES_SEALEO },
    { 28, 30, SPECIES_SPHEAL },
    { 28, 31, SPECIES_SNEASEL },
    { 28, 31, SPECIES_SNORUNT },
    { 26, 29, SPECIES_GEODUDE },
    { 28, 31, SPECIES_SABLEYE },
    { 30, 32, SPECIES_GLALIE },
    { 30, 32, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gShoalCave_LowTideStairsRoom_LandMonsInfo = { 10, gShoalCave_LowTideStairsRoom_LandMons };
const struct WildPokemon gShoalCave_LowTideLowerRoom_LandMons[] =
{
    { 26, 28, SPECIES_SPHEAL },
    { 26, 28, SPECIES_ZUBAT },
    { 27, 29, SPECIES_SNORUNT },
    { 27, 30, SPECIES_GOLBAT },
    { 28, 30, SPECIES_SEALEO },
    { 28, 30, SPECIES_SPHEAL },
    { 28, 31, SPECIES_SNEASEL },
    { 28, 31, SPECIES_SNORUNT },
    { 26, 29, SPECIES_GEODUDE },
    { 28, 31, SPECIES_SABLEYE },
    { 30, 32, SPECIES_GLALIE },
    { 30, 32, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gShoalCave_LowTideLowerRoom_LandMonsInfo = { 10, gShoalCave_LowTideLowerRoom_LandMons };
const struct WildPokemon gShoalCave_LowTideInnerRoom_LandMons[] =
{
    { 26, 28, SPECIES_SPHEAL },
    { 26, 28, SPECIES_ZUBAT },
    { 27, 29, SPECIES_SNORUNT },
    { 27, 30, SPECIES_GOLBAT },
    { 28, 30, SPECIES_SEALEO },
    { 28, 30, SPECIES_SPHEAL },
    { 28, 31, SPECIES_SNEASEL },
    { 28, 31, SPECIES_SNORUNT },
    { 28, 32, SPECIES_MUDKIP_HOENN },
    { 28, 31, SPECIES_SABLEYE },
    { 30, 32, SPECIES_GLALIE },
    { 30, 32, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gShoalCave_LowTideInnerRoom_LandMonsInfo = { 10, gShoalCave_LowTideInnerRoom_LandMons };
const struct WildPokemon gShoalCave_LowTideInnerRoom_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_ZUBAT },
    { 25, 30, SPECIES_SPHEAL },
    { 25, 30, SPECIES_SPHEAL },
    { 25, 35, SPECIES_SPHEAL },
};

const struct WildPokemonInfo gShoalCave_LowTideInnerRoom_WaterMonsInfo = { 4, gShoalCave_LowTideInnerRoom_WaterMons };
const struct WildPokemon gShoalCave_LowTideInnerRoom_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gShoalCave_LowTideInnerRoom_FishingMonsInfo = { 10, gShoalCave_LowTideInnerRoom_FishingMons };
const struct WildPokemon gShoalCave_LowTideEntranceRoom_LandMons[] =
{
    { 26, 28, SPECIES_SPHEAL },
    { 26, 28, SPECIES_ZUBAT },
    { 27, 29, SPECIES_SNORUNT },
    { 27, 30, SPECIES_GOLBAT },
    { 28, 30, SPECIES_SEALEO },
    { 28, 30, SPECIES_SPHEAL },
    { 28, 31, SPECIES_SNEASEL },
    { 28, 31, SPECIES_SNORUNT },
    { 26, 29, SPECIES_GEODUDE },
    { 28, 31, SPECIES_SABLEYE },
    { 30, 32, SPECIES_GLALIE },
    { 30, 32, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gShoalCave_LowTideEntranceRoom_LandMonsInfo = { 10, gShoalCave_LowTideEntranceRoom_LandMons };
const struct WildPokemon gShoalCave_LowTideEntranceRoom_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 5, 35, SPECIES_ZUBAT },
    { 25, 30, SPECIES_SPHEAL },
    { 25, 30, SPECIES_SPHEAL },
    { 25, 35, SPECIES_SPHEAL },
};

const struct WildPokemonInfo gShoalCave_LowTideEntranceRoom_WaterMonsInfo = { 4, gShoalCave_LowTideEntranceRoom_WaterMons };
const struct WildPokemon gShoalCave_LowTideEntranceRoom_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gShoalCave_LowTideEntranceRoom_FishingMonsInfo = { 10, gShoalCave_LowTideEntranceRoom_FishingMons };
const struct WildPokemon gLilycoveCity_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gLilycoveCity_WaterMonsInfo = { 4, gLilycoveCity_WaterMons };
const struct WildPokemon gLilycoveCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_STARYU },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gLilycoveCity_FishingMonsInfo = { 10, gLilycoveCity_FishingMons };
const struct WildPokemon gDewfordTown_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gDewfordTown_WaterMonsInfo = { 4, gDewfordTown_WaterMons };
const struct WildPokemon gDewfordTown_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gDewfordTown_FishingMonsInfo = { 10, gDewfordTown_FishingMons };
const struct WildPokemon gSlateportCity_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gSlateportCity_WaterMonsInfo = { 4, gSlateportCity_WaterMons };
const struct WildPokemon gSlateportCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_WAILMER },
    { 20, 25, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gSlateportCity_FishingMonsInfo = { 10, gSlateportCity_FishingMons };
const struct WildPokemon gMossdeepCity_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gMossdeepCity_WaterMonsInfo = { 4, gMossdeepCity_WaterMons };
const struct WildPokemon gMossdeepCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gMossdeepCity_FishingMonsInfo = { 10, gMossdeepCity_FishingMons };
const struct WildPokemon gPacifidlogTown_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gPacifidlogTown_WaterMonsInfo = { 4, gPacifidlogTown_WaterMons };
const struct WildPokemon gPacifidlogTown_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_SHARPEDO },
    { 30, 35, SPECIES_WAILMER },
    { 25, 30, SPECIES_WAILMER },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gPacifidlogTown_FishingMonsInfo = { 10, gPacifidlogTown_FishingMons };
const struct WildPokemon gEverGrandeCity_WaterMons[] =
{
    { 5, 35, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_WINGULL },
    { 15, 25, SPECIES_WINGULL },
    { 25, 30, SPECIES_PELIPPER },
    { 25, 30, SPECIES_PELIPPER },
};

const struct WildPokemonInfo gEverGrandeCity_WaterMonsInfo = { 4, gEverGrandeCity_WaterMons };
const struct WildPokemon gEverGrandeCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_LUVDISC },
    { 10, 30, SPECIES_WAILMER },
    { 30, 35, SPECIES_LUVDISC },
    { 30, 35, SPECIES_WAILMER },
    { 30, 35, SPECIES_CORSOLA },
    { 35, 40, SPECIES_WAILMER },
    { 40, 45, SPECIES_WAILMER },
};

const struct WildPokemonInfo gEverGrandeCity_FishingMonsInfo = { 10, gEverGrandeCity_FishingMons };
const struct WildPokemon gPetalburgCity_WaterMons[] =
{
    { 20, 30, SPECIES_MARILL },
    { 10, 20, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
    { 5, 10, SPECIES_MARILL },
};

const struct WildPokemonInfo gPetalburgCity_WaterMonsInfo = { 1, gPetalburgCity_WaterMons };
const struct WildPokemon gPetalburgCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_GOLDEEN },
    { 10, 30, SPECIES_CORPHISH },
    { 25, 30, SPECIES_CORPHISH },
    { 30, 35, SPECIES_CORPHISH },
    { 20, 25, SPECIES_CORPHISH },
    { 35, 40, SPECIES_CORPHISH },
    { 40, 45, SPECIES_CORPHISH },
};

const struct WildPokemonInfo gPetalburgCity_FishingMonsInfo = { 10, gPetalburgCity_FishingMons };
const struct WildPokemon gUnderwater_Route124_WaterMons[] =
{
    { 20, 30, SPECIES_CLAMPERL },
    { 20, 30, SPECIES_CHINCHOU },
    { 30, 35, SPECIES_CLAMPERL },
    { 30, 35, SPECIES_RELICANTH },
    { 30, 35, SPECIES_RELICANTH },
};

const struct WildPokemonInfo gUnderwater_Route124_WaterMonsInfo = { 4, gUnderwater_Route124_WaterMons };
const struct WildPokemon gShoalCave_LowTideIceRoom_LandMons[] =
{
    { 26, 28, SPECIES_SPHEAL },
    { 26, 28, SPECIES_ZUBAT },
    { 27, 29, SPECIES_SNORUNT },
    { 27, 30, SPECIES_GOLBAT },
    { 28, 30, SPECIES_SEALEO },
    { 28, 30, SPECIES_SWINUB },
    { 28, 31, SPECIES_SNEASEL },
    { 28, 31, SPECIES_SNORUNT },
    { 26, 29, SPECIES_GEODUDE },
    { 28, 31, SPECIES_SABLEYE },
    { 30, 32, SPECIES_GLALIE },
    { 30, 32, SPECIES_SNEASEL },
};

const struct WildPokemonInfo gShoalCave_LowTideIceRoom_LandMonsInfo = { 10, gShoalCave_LowTideIceRoom_LandMons };
const struct WildPokemon gSkyPillar_1F_LandMons[] =
{
    { 45, 45, SPECIES_GOLBAT },
    { 45, 45, SPECIES_GOLBAT },
    { 46, 46, SPECIES_CLAYDOL },
    { 46, 46, SPECIES_CLAYDOL },
    { 46, 47, SPECIES_BANETTE },
    { 46, 47, SPECIES_BANETTE },
    { 45, 46, SPECIES_SABLEYE },
    { 45, 46, SPECIES_SABLEYE },
    { 47, 48, SPECIES_DUSCLOPS },
    { 47, 48, SPECIES_DUSCLOPS },
    { 48, 48, SPECIES_XATU },
    { 48, 48, SPECIES_XATU },
};

const struct WildPokemonInfo gSkyPillar_1F_LandMonsInfo = { 10, gSkyPillar_1F_LandMons };
const struct WildPokemon gSootopolisCity_WaterMons[] =
{
    { 5, 35, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 15, 25, SPECIES_MAGIKARP },
    { 25, 30, SPECIES_MAGIKARP },
    { 25, 30, SPECIES_MAGIKARP },
};

const struct WildPokemonInfo gSootopolisCity_WaterMonsInfo = { 1, gSootopolisCity_WaterMons };
const struct WildPokemon gSootopolisCity_FishingMons[] =
{
    { 5, 10, SPECIES_MAGIKARP },
    { 5, 10, SPECIES_TENTACOOL },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 10, 30, SPECIES_MAGIKARP },
    { 30, 35, SPECIES_MAGIKARP },
    { 30, 35, SPECIES_MAGIKARP },
    { 35, 40, SPECIES_GYARADOS },
    { 35, 45, SPECIES_GYARADOS },
    { 5, 45, SPECIES_GYARADOS },
};

const struct WildPokemonInfo gSootopolisCity_FishingMonsInfo = { 10, gSootopolisCity_FishingMons };
const struct WildPokemon gSkyPillar_3F_LandMons[] =
{
    { 48, 49, SPECIES_CLAYDOL },
    { 48, 49, SPECIES_CLAYDOL },
    { 49, 50, SPECIES_ALTARIA },
    { 49, 50, SPECIES_ALTARIA },
    { 48, 49, SPECIES_DUSCLOPS },
    { 48, 49, SPECIES_DUSCLOPS },
    { 49, 50, SPECIES_XATU },
    { 49, 50, SPECIES_XATU },
    { 49, 50, SPECIES_BANETTE },
    { 49, 50, SPECIES_BANETTE },
    { 51, 51, SPECIES_FLYGON },
    { 51, 51, SPECIES_FLYGON },
};

const struct WildPokemonInfo gSkyPillar_3F_LandMonsInfo = { 10, gSkyPillar_3F_LandMons };
const struct WildPokemon gSkyPillar_5F_LandMons[] =
{
    { 51, 52, SPECIES_ALTARIA },
    { 51, 52, SPECIES_ALTARIA },
    { 52, 53, SPECIES_FLYGON },
    { 52, 53, SPECIES_FLYGON },
    { 51, 52, SPECIES_CLAYDOL },
    { 51, 52, SPECIES_CLAYDOL },
    { 53, 54, SPECIES_AERODACTYL },
    { 53, 54, SPECIES_AERODACTYL },
    { 53, 54, SPECIES_SHELGON },
    { 53, 54, SPECIES_SHELGON },
    { 55, 55, SPECIES_SALAMENCE },
    { 55, 55, SPECIES_SALAMENCE },
};

const struct WildPokemonInfo gSkyPillar_5F_LandMonsInfo = { 10, gSkyPillar_5F_LandMons };
const struct WildPokemon gSafariZone_Southeast_LandMons[] =
{
    { 33, 33, SPECIES_SUNKERN },
    { 34, 34, SPECIES_MAREEP },
    { 35, 35, SPECIES_SUNKERN },
    { 36, 36, SPECIES_MAREEP },
    { 34, 34, SPECIES_AIPOM },
    { 33, 33, SPECIES_SPINARAK },
    { 35, 35, SPECIES_HOOTHOOT },
    { 34, 34, SPECIES_SNUBBULL },
    { 36, 36, SPECIES_STANTLER },
    { 37, 37, SPECIES_GLIGAR },
    { 39, 39, SPECIES_STANTLER },
    { 40, 40, SPECIES_GLIGAR },
};

const struct WildPokemonInfo gSafariZone_Southeast_LandMonsInfo = { 25, gSafariZone_Southeast_LandMons };
const struct WildPokemon gSafariZone_Southeast_WaterMons[] =
{
    { 25, 30, SPECIES_WOOPER },
    { 25, 30, SPECIES_MARILL },
    { 25, 30, SPECIES_MARILL },
    { 30, 35, SPECIES_MARILL },
    { 35, 40, SPECIES_QUAGSIRE },
};

const struct WildPokemonInfo gSafariZone_Southeast_WaterMonsInfo = { 9, gSafariZone_Southeast_WaterMons };
const struct WildPokemon gSafariZone_Southeast_FishingMons[] =
{
    { 25, 30, SPECIES_MAGIKARP },
    { 25, 30, SPECIES_GOLDEEN },
    { 25, 30, SPECIES_MAGIKARP },
    { 25, 30, SPECIES_GOLDEEN },
    { 30, 35, SPECIES_REMORAID },
    { 25, 30, SPECIES_GOLDEEN },
    { 25, 30, SPECIES_REMORAID },
    { 30, 35, SPECIES_REMORAID },
    { 30, 35, SPECIES_REMORAID },
    { 35, 40, SPECIES_OCTILLERY },
};

const struct WildPokemonInfo gSafariZone_Southeast_FishingMonsInfo = { 35, gSafariZone_Southeast_FishingMons };
const struct WildPokemon gSafariZone_Northeast_LandMons[] =
{
    { 33, 33, SPECIES_AIPOM },
    { 34, 34, SPECIES_TEDDIURSA },
    { 35, 35, SPECIES_AIPOM },
    { 36, 36, SPECIES_TEDDIURSA },
    { 34, 34, SPECIES_SUNKERN },
    { 33, 33, SPECIES_LEDYBA },
    { 35, 35, SPECIES_HOOTHOOT },
    { 34, 34, SPECIES_PINECO },
    { 36, 36, SPECIES_HOUNDOUR },
    { 37, 37, SPECIES_MILTANK },
    { 39, 39, SPECIES_HOUNDOUR },
    { 40, 40, SPECIES_MILTANK },
};

const struct WildPokemonInfo gSafariZone_Northeast_LandMonsInfo = { 25, gSafariZone_Northeast_LandMons };
const struct WildPokemon gSafariZone_Northeast_RockSmashMons[] =
{
    { 25, 30, SPECIES_SHUCKLE },
    { 20, 25, SPECIES_SHUCKLE },
    { 30, 35, SPECIES_SHUCKLE },
    { 30, 35, SPECIES_SHUCKLE },
    { 35, 40, SPECIES_SHUCKLE },
};

const struct WildPokemonInfo gSafariZone_Northeast_RockSmashMonsInfo = { 25, gSafariZone_Northeast_RockSmashMons };
const struct WildPokemon gMagmaHideout_1F_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_1F_LandMonsInfo = { 10, gMagmaHideout_1F_LandMons };
const struct WildPokemon gMagmaHideout_2F_1R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_2F_1R_LandMonsInfo = { 10, gMagmaHideout_2F_1R_LandMons };
const struct WildPokemon gMagmaHideout_2F_2R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_2F_2R_LandMonsInfo = { 10, gMagmaHideout_2F_2R_LandMons };
const struct WildPokemon gMagmaHideout_3F_1R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_3F_1R_LandMonsInfo = { 10, gMagmaHideout_3F_1R_LandMons };
const struct WildPokemon gMagmaHideout_3F_2R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_3F_2R_LandMonsInfo = { 10, gMagmaHideout_3F_2R_LandMons };
const struct WildPokemon gMagmaHideout_4F_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_4F_LandMonsInfo = { 10, gMagmaHideout_4F_LandMons };
const struct WildPokemon gMagmaHideout_3F_3R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_3F_3R_LandMonsInfo = { 10, gMagmaHideout_3F_3R_LandMons };
const struct WildPokemon gMagmaHideout_2F_3R_LandMons[] =
{
    { 27, 27, SPECIES_GEODUDE },
    { 28, 28, SPECIES_TORKOAL },
    { 28, 28, SPECIES_GEODUDE },
    { 30, 30, SPECIES_TORKOAL },
    { 29, 29, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GEODUDE },
    { 30, 30, SPECIES_GRAVELER },
    { 30, 30, SPECIES_GRAVELER },
    { 31, 31, SPECIES_GRAVELER },
    { 32, 32, SPECIES_GRAVELER },
    { 33, 33, SPECIES_GRAVELER },
};

const struct WildPokemonInfo gMagmaHideout_2F_3R_LandMonsInfo = { 10, gMagmaHideout_2F_3R_LandMons };
const struct WildPokemon gMirageTower_1F_LandMons[] =
{
    { 21, 21, SPECIES_SANDSHREW },
    { 21, 21, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 22, 22, SPECIES_SANDSHREW },
    { 22, 22, SPECIES_TRAPINCH },
    { 23, 23, SPECIES_SANDSHREW },
    { 23, 23, SPECIES_TRAPINCH },
    { 24, 24, SPECIES_SANDSHREW },
    { 24, 24, SPECIES_TRAPINCH },
};

const struct WildPokemonInfo gMirageTower_1F_LandMonsInfo = { 10, gMirageTower_1F_LandMons };
const struct WildPokemon gMirageTower_2F_LandMons[] =
{
    { 21, 21, SPECIES_SANDSHREW },
    { 21, 21, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 22, 22, SPECIES_SANDSHREW },
    { 22, 22, SPECIES_TRAPINCH },
    { 23, 23, SPECIES_SANDSHREW },
    { 23, 23, SPECIES_TRAPINCH },
    { 24, 24, SPECIES_SANDSHREW },
    { 24, 24, SPECIES_TRAPINCH },
};

const struct WildPokemonInfo gMirageTower_2F_LandMonsInfo = { 10, gMirageTower_2F_LandMons };
const struct WildPokemon gMirageTower_3F_LandMons[] =
{
    { 21, 21, SPECIES_SANDSHREW },
    { 21, 21, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 22, 22, SPECIES_SANDSHREW },
    { 22, 22, SPECIES_TRAPINCH },
    { 23, 23, SPECIES_SANDSHREW },
    { 23, 23, SPECIES_TRAPINCH },
    { 24, 24, SPECIES_SANDSHREW },
    { 24, 24, SPECIES_TRAPINCH },
};

const struct WildPokemonInfo gMirageTower_3F_LandMonsInfo = { 10, gMirageTower_3F_LandMons };
const struct WildPokemon gMirageTower_4F_LandMons[] =
{
    { 21, 21, SPECIES_SANDSHREW },
    { 21, 21, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 20, 20, SPECIES_SANDSHREW },
    { 20, 20, SPECIES_TRAPINCH },
    { 22, 22, SPECIES_SANDSHREW },
    { 22, 22, SPECIES_TRAPINCH },
    { 23, 23, SPECIES_SANDSHREW },
    { 23, 23, SPECIES_TRAPINCH },
    { 24, 24, SPECIES_SANDSHREW },
    { 24, 24, SPECIES_TRAPINCH },
};

const struct WildPokemonInfo gMirageTower_4F_LandMonsInfo = { 10, gMirageTower_4F_LandMons };
const struct WildPokemon gDesertUnderpass_LandMons[] =
{
    { 38, 38, SPECIES_DITTO },
    { 35, 35, SPECIES_WHISMUR },
    { 40, 40, SPECIES_DITTO },
    { 40, 40, SPECIES_LOUDRED },
    { 41, 41, SPECIES_DITTO },
    { 36, 36, SPECIES_WHISMUR },
    { 38, 38, SPECIES_LOUDRED },
    { 42, 42, SPECIES_DITTO },
    { 38, 38, SPECIES_WHISMUR },
    { 43, 43, SPECIES_DITTO },
    { 44, 44, SPECIES_LOUDRED },
    { 45, 45, SPECIES_DITTO },
};

const struct WildPokemonInfo gDesertUnderpass_LandMonsInfo = { 10, gDesertUnderpass_LandMons };
const struct WildPokemon gArtisanCave_B1F_LandMons[] =
{
    { 50, 58, SPECIES_SMEARGLE },
    { 52, 60, SPECIES_SMEARGLE },
    { 52, 57, SPECIES_ABSOL },
    { 52, 57, SPECIES_SNEASEL },
    { 52, 57, SPECIES_HOUNDOOM },
    { 52, 57, SPECIES_ALAKAZAM },
    { 52, 57, SPECIES_GENGAR },
    { 52, 57, SPECIES_MISDREAVUS },
    { 55, 60, SPECIES_DRAGONITE },
    { 55, 60, SPECIES_SALAMENCE },
    { 55, 60, SPECIES_METAGROSS },
    { 55, 60, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gArtisanCave_B1F_LandMonsInfo = { 10, gArtisanCave_B1F_LandMons };
const struct WildPokemon gArtisanCave_1F_LandMons[] =
{
    { 50, 58, SPECIES_SMEARGLE },
    { 52, 60, SPECIES_SMEARGLE },
    { 52, 57, SPECIES_ABSOL },
    { 52, 57, SPECIES_SNEASEL },
    { 52, 57, SPECIES_HOUNDOOM },
    { 52, 57, SPECIES_ALAKAZAM },
    { 52, 57, SPECIES_GENGAR },
    { 52, 57, SPECIES_MISDREAVUS },
    { 55, 60, SPECIES_DRAGONITE },
    { 55, 60, SPECIES_SALAMENCE },
    { 55, 60, SPECIES_METAGROSS },
    { 55, 60, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gArtisanCave_1F_LandMonsInfo = { 10, gArtisanCave_1F_LandMons };
const struct WildPokemon gAlteringCave1_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave1_LandMonsInfo = { 7, gAlteringCave1_LandMons };
const struct WildPokemon gAlteringCave2_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave2_LandMonsInfo = { 7, gAlteringCave2_LandMons };
const struct WildPokemon gAlteringCave3_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave3_LandMonsInfo = { 7, gAlteringCave3_LandMons };
const struct WildPokemon gAlteringCave4_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave4_LandMonsInfo = { 7, gAlteringCave4_LandMons };
const struct WildPokemon gAlteringCave5_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave5_LandMonsInfo = { 7, gAlteringCave5_LandMons };
const struct WildPokemon gAlteringCave6_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave6_LandMonsInfo = { 7, gAlteringCave6_LandMons };
const struct WildPokemon gAlteringCave7_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave7_LandMonsInfo = { 7, gAlteringCave7_LandMons };
const struct WildPokemon gAlteringCave8_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave8_LandMonsInfo = { 7, gAlteringCave8_LandMons };
const struct WildPokemon gAlteringCave9_LandMons[] =
{
    { 40, 50, SPECIES_LARVITAR },
    { 40, 50, SPECIES_BAGON },
    { 40, 50, SPECIES_DRATINI },
    { 42, 52, SPECIES_DRAGONAIR },
    { 40, 50, SPECIES_BELDUM },
    { 42, 52, SPECIES_METANG },
    { 42, 52, SPECIES_ABSOL },
    { 42, 52, SPECIES_SNEASEL },
    { 45, 55, SPECIES_SALAMENCE },
    { 45, 55, SPECIES_METAGROSS },
    { 48, 58, SPECIES_DRAGONITE },
    { 48, 58, SPECIES_TYRANITAR },
};

const struct WildPokemonInfo gAlteringCave9_LandMonsInfo = { 7, gAlteringCave9_LandMons };
const struct WildPokemon gMeteorFalls_StevensCave_LandMons[] =
{
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_GOLBAT },
    { 33, 33, SPECIES_GOLBAT },
    { 35, 35, SPECIES_SOLROCK },
    { 33, 33, SPECIES_SOLROCK },
    { 37, 37, SPECIES_SOLROCK },
    { 35, 35, SPECIES_GOLBAT },
    { 39, 39, SPECIES_SOLROCK },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
    { 38, 38, SPECIES_GOLBAT },
    { 40, 40, SPECIES_GOLBAT },
};

const struct WildPokemonInfo gMeteorFalls_StevensCave_LandMonsInfo = { 10, gMeteorFalls_StevensCave_LandMons };

const struct WildPokemonHeader gWildMonHeaders[] =
{
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE101),
        .mapNum = MAP_NUM(MAP_ROUTE101),
        .landMonsInfo = &gRoute101_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE102),
        .mapNum = MAP_NUM(MAP_ROUTE102),
        .landMonsInfo = &gRoute102_LandMonsInfo,
        .waterMonsInfo = &gRoute102_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute102_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE103),
        .mapNum = MAP_NUM(MAP_ROUTE103),
        .landMonsInfo = &gRoute103_LandMonsInfo,
        .waterMonsInfo = &gRoute103_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute103_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE104),
        .mapNum = MAP_NUM(MAP_ROUTE104),
        .landMonsInfo = &gRoute104_LandMonsInfo,
        .waterMonsInfo = &gRoute104_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute104_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE105),
        .mapNum = MAP_NUM(MAP_ROUTE105),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute105_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute105_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE110),
        .mapNum = MAP_NUM(MAP_ROUTE110),
        .landMonsInfo = &gRoute110_LandMonsInfo,
        .waterMonsInfo = &gRoute110_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute110_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE111),
        .mapNum = MAP_NUM(MAP_ROUTE111),
        .landMonsInfo = &gRoute111_LandMonsInfo,
        .waterMonsInfo = &gRoute111_WaterMonsInfo,
        .rockSmashMonsInfo = &gRoute111_RockSmashMonsInfo,
        .fishingMonsInfo = &gRoute111_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE112),
        .mapNum = MAP_NUM(MAP_ROUTE112),
        .landMonsInfo = &gRoute112_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE113),
        .mapNum = MAP_NUM(MAP_ROUTE113),
        .landMonsInfo = &gRoute113_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE114),
        .mapNum = MAP_NUM(MAP_ROUTE114),
        .landMonsInfo = &gRoute114_LandMonsInfo,
        .waterMonsInfo = &gRoute114_WaterMonsInfo,
        .rockSmashMonsInfo = &gRoute114_RockSmashMonsInfo,
        .fishingMonsInfo = &gRoute114_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE116),
        .mapNum = MAP_NUM(MAP_ROUTE116),
        .landMonsInfo = &gRoute116_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE117),
        .mapNum = MAP_NUM(MAP_ROUTE117),
        .landMonsInfo = &gRoute117_LandMonsInfo,
        .waterMonsInfo = &gRoute117_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute117_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE118),
        .mapNum = MAP_NUM(MAP_ROUTE118),
        .landMonsInfo = &gRoute118_LandMonsInfo,
        .waterMonsInfo = &gRoute118_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute118_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE118),
        .mapNum = MAP_NUM(MAP_ROUTE118),
        .landMonsInfo = &gRoute118_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE124),
        .mapNum = MAP_NUM(MAP_ROUTE124),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute124_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute124_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_PETALBURG_WOODS),
        .mapNum = MAP_NUM(MAP_PETALBURG_WOODS),
        .landMonsInfo = &gPetalburgWoods_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_RUSTURF_TUNNEL),
        .mapNum = MAP_NUM(MAP_RUSTURF_TUNNEL),
        .landMonsInfo = &gRusturfTunnel_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_GRANITE_CAVE_1F),
        .mapNum = MAP_NUM(MAP_GRANITE_CAVE_1F),
        .landMonsInfo = &gGraniteCave_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_GRANITE_CAVE_B1F),
        .mapNum = MAP_NUM(MAP_GRANITE_CAVE_B1F),
        .landMonsInfo = &gGraniteCave_B1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_1F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_1F),
        .landMonsInfo = &gMtPyre_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_1F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_1F),
        .landMonsInfo = &gMtPyre_1F_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_VICTORY_ROAD_1F),
        .mapNum = MAP_NUM(MAP_VICTORY_ROAD_1F),
        .landMonsInfo = &gVictoryRoad_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_SOUTH),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_SOUTH),
        .landMonsInfo = &gSafariZone_South_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_UNDERWATER_ROUTE126),
        .mapNum = MAP_NUM(MAP_UNDERWATER_ROUTE126),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gUnderwater_Route126_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ABANDONED_SHIP_ROOMS_B1F),
        .mapNum = MAP_NUM(MAP_ABANDONED_SHIP_ROOMS_B1F),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gAbandonedShip_Rooms_B1F_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gAbandonedShip_Rooms_B1F_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_GRANITE_CAVE_B2F),
        .mapNum = MAP_NUM(MAP_GRANITE_CAVE_B2F),
        .landMonsInfo = &gGraniteCave_B2F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = &gGraniteCave_B2F_RockSmashMonsInfo,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_FIERY_PATH),
        .mapNum = MAP_NUM(MAP_FIERY_PATH),
        .landMonsInfo = &gFieryPath_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_METEOR_FALLS_B1F_2R),
        .mapNum = MAP_NUM(MAP_METEOR_FALLS_B1F_2R),
        .landMonsInfo = &gMeteorFalls_B1F_2R_LandMonsInfo,
        .waterMonsInfo = &gMeteorFalls_B1F_2R_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gMeteorFalls_B1F_2R_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_JAGGED_PASS),
        .mapNum = MAP_NUM(MAP_JAGGED_PASS),
        .landMonsInfo = &gJaggedPass_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE106),
        .mapNum = MAP_NUM(MAP_ROUTE106),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute106_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute106_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE107),
        .mapNum = MAP_NUM(MAP_ROUTE107),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute107_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute107_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE108),
        .mapNum = MAP_NUM(MAP_ROUTE108),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute108_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute108_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE109),
        .mapNum = MAP_NUM(MAP_ROUTE109),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute109_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute109_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE115),
        .mapNum = MAP_NUM(MAP_ROUTE115),
        .landMonsInfo = &gRoute115_LandMonsInfo,
        .waterMonsInfo = &gRoute115_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute115_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_NEW_MAUVILLE_INSIDE),
        .mapNum = MAP_NUM(MAP_NEW_MAUVILLE_INSIDE),
        .landMonsInfo = &gNewMauville_Inside_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE119),
        .mapNum = MAP_NUM(MAP_ROUTE119),
        .landMonsInfo = &gRoute119_LandMonsInfo,
        .waterMonsInfo = &gRoute119_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute119_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE119),
        .mapNum = MAP_NUM(MAP_ROUTE119),
        .landMonsInfo = &gRoute119_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE120),
        .mapNum = MAP_NUM(MAP_ROUTE120),
        .landMonsInfo = &gRoute120_LandMonsInfo,
        .waterMonsInfo = &gRoute120_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute120_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE120),
        .mapNum = MAP_NUM(MAP_ROUTE120),
        .landMonsInfo = &gRoute120_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE121),
        .mapNum = MAP_NUM(MAP_ROUTE121),
        .landMonsInfo = &gRoute121_LandMonsInfo,
        .waterMonsInfo = &gRoute121_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute121_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE121),
        .mapNum = MAP_NUM(MAP_ROUTE121),
        .landMonsInfo = &gRoute121_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE122),
        .mapNum = MAP_NUM(MAP_ROUTE122),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute122_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute122_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE123),
        .mapNum = MAP_NUM(MAP_ROUTE123),
        .landMonsInfo = &gRoute123_LandMonsInfo,
        .waterMonsInfo = &gRoute123_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute123_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE123),
        .mapNum = MAP_NUM(MAP_ROUTE123),
        .landMonsInfo = &gRoute123_SecondWave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_2F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_2F),
        .landMonsInfo = &gMtPyre_2F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_3F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_3F),
        .landMonsInfo = &gMtPyre_3F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_4F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_4F),
        .landMonsInfo = &gMtPyre_4F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_5F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_5F),
        .landMonsInfo = &gMtPyre_5F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_6F),
        .mapNum = MAP_NUM(MAP_MT_PYRE_6F),
        .landMonsInfo = &gMtPyre_6F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_EXTERIOR),
        .mapNum = MAP_NUM(MAP_MT_PYRE_EXTERIOR),
        .landMonsInfo = &gMtPyre_Exterior_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MT_PYRE_SUMMIT),
        .mapNum = MAP_NUM(MAP_MT_PYRE_SUMMIT),
        .landMonsInfo = &gMtPyre_Summit_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_GRANITE_CAVE_STEVENS_ROOM),
        .mapNum = MAP_NUM(MAP_GRANITE_CAVE_STEVENS_ROOM),
        .landMonsInfo = &gGraniteCave_StevensRoom_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE125),
        .mapNum = MAP_NUM(MAP_ROUTE125),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute125_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute125_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE126),
        .mapNum = MAP_NUM(MAP_ROUTE126),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute126_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute126_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE127),
        .mapNum = MAP_NUM(MAP_ROUTE127),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute127_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute127_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE128),
        .mapNum = MAP_NUM(MAP_ROUTE128),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute128_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute128_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE129),
        .mapNum = MAP_NUM(MAP_ROUTE129),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute129_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute129_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE130),
        .mapNum = MAP_NUM(MAP_ROUTE130),
        .landMonsInfo = &gRoute130_LandMonsInfo,
        .waterMonsInfo = &gRoute130_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute130_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE131),
        .mapNum = MAP_NUM(MAP_ROUTE131),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute131_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute131_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE132),
        .mapNum = MAP_NUM(MAP_ROUTE132),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute132_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute132_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE133),
        .mapNum = MAP_NUM(MAP_ROUTE133),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute133_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute133_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ROUTE134),
        .mapNum = MAP_NUM(MAP_ROUTE134),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gRoute134_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gRoute134_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS),
        .mapNum = MAP_NUM(MAP_ABANDONED_SHIP_HIDDEN_FLOOR_CORRIDORS),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gAbandonedShip_HiddenFloorCorridors_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gAbandonedShip_HiddenFloorCorridors_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM1),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM1),
        .landMonsInfo = &gSeafloorCavern_Room1_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM2),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM2),
        .landMonsInfo = &gSeafloorCavern_Room2_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM3),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM3),
        .landMonsInfo = &gSeafloorCavern_Room3_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM4),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM4),
        .landMonsInfo = &gSeafloorCavern_Room4_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM5),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM5),
        .landMonsInfo = &gSeafloorCavern_Room5_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM6),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM6),
        .landMonsInfo = &gSeafloorCavern_Room6_LandMonsInfo,
        .waterMonsInfo = &gSeafloorCavern_Room6_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSeafloorCavern_Room6_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM7),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM7),
        .landMonsInfo = &gSeafloorCavern_Room7_LandMonsInfo,
        .waterMonsInfo = &gSeafloorCavern_Room7_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSeafloorCavern_Room7_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM8),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM8),
        .landMonsInfo = &gSeafloorCavern_Room8_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ROOM9),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ROOM9),
        .landMonsInfo = &gSeafloorCavern_Room9_LandMonsInfo,
        .waterMonsInfo = &gSeafloorCavern_Room9_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SEAFLOOR_CAVERN_ENTRANCE),
        .mapNum = MAP_NUM(MAP_SEAFLOOR_CAVERN_ENTRANCE),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gSeafloorCavern_Entrance_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSeafloorCavern_Entrance_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_TERRA_CAVE_ENTRANCE),
        .mapNum = MAP_NUM(MAP_TERRA_CAVE_ENTRANCE),
        .landMonsInfo = &gTerraCave_Entrance_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_TERRA_CAVE_END),
        .mapNum = MAP_NUM(MAP_TERRA_CAVE_END),
        .landMonsInfo = &gTerraCave_End_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_CAVE_OF_ORIGIN_ENTRANCE),
        .mapNum = MAP_NUM(MAP_CAVE_OF_ORIGIN_ENTRANCE),
        .landMonsInfo = &gCaveOfOrigin_Entrance_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_CAVE_OF_ORIGIN_1F),
        .mapNum = MAP_NUM(MAP_CAVE_OF_ORIGIN_1F),
        .landMonsInfo = &gCaveOfOrigin_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP1),
        .mapNum = MAP_NUM(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP1),
        .landMonsInfo = &gCaveOfOrigin_UnusedRubySapphireMap1_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP2),
        .mapNum = MAP_NUM(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP2),
        .landMonsInfo = &gCaveOfOrigin_UnusedRubySapphireMap2_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP3),
        .mapNum = MAP_NUM(MAP_CAVE_OF_ORIGIN_UNUSED_RUBY_SAPPHIRE_MAP3),
        .landMonsInfo = &gCaveOfOrigin_UnusedRubySapphireMap3_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_NEW_MAUVILLE_ENTRANCE),
        .mapNum = MAP_NUM(MAP_NEW_MAUVILLE_ENTRANCE),
        .landMonsInfo = &gNewMauville_Entrance_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_SOUTHWEST),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_SOUTHWEST),
        .landMonsInfo = &gSafariZone_Southwest_LandMonsInfo,
        .waterMonsInfo = &gSafariZone_Southwest_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSafariZone_Southwest_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_NORTH),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_NORTH),
        .landMonsInfo = &gSafariZone_North_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = &gSafariZone_North_RockSmashMonsInfo,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_NORTHWEST),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_NORTHWEST),
        .landMonsInfo = &gSafariZone_Northwest_LandMonsInfo,
        .waterMonsInfo = &gSafariZone_Northwest_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSafariZone_Northwest_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_VICTORY_ROAD_B1F),
        .mapNum = MAP_NUM(MAP_VICTORY_ROAD_B1F),
        .landMonsInfo = &gVictoryRoad_B1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = &gVictoryRoad_B1F_RockSmashMonsInfo,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_VICTORY_ROAD_B2F),
        .mapNum = MAP_NUM(MAP_VICTORY_ROAD_B2F),
        .landMonsInfo = &gVictoryRoad_B2F_LandMonsInfo,
        .waterMonsInfo = &gVictoryRoad_B2F_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gVictoryRoad_B2F_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_METEOR_FALLS_1F_1R),
        .mapNum = MAP_NUM(MAP_METEOR_FALLS_1F_1R),
        .landMonsInfo = &gMeteorFalls_1F_1R_LandMonsInfo,
        .waterMonsInfo = &gMeteorFalls_1F_1R_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gMeteorFalls_1F_1R_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_METEOR_FALLS_1F_2R),
        .mapNum = MAP_NUM(MAP_METEOR_FALLS_1F_2R),
        .landMonsInfo = &gMeteorFalls_1F_2R_LandMonsInfo,
        .waterMonsInfo = &gMeteorFalls_1F_2R_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gMeteorFalls_1F_2R_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_METEOR_FALLS_B1F_1R),
        .mapNum = MAP_NUM(MAP_METEOR_FALLS_B1F_1R),
        .landMonsInfo = &gMeteorFalls_B1F_1R_LandMonsInfo,
        .waterMonsInfo = &gMeteorFalls_B1F_1R_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gMeteorFalls_B1F_1R_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SHOAL_CAVE_LOW_TIDE_STAIRS_ROOM),
        .mapNum = MAP_NUM(MAP_SHOAL_CAVE_LOW_TIDE_STAIRS_ROOM),
        .landMonsInfo = &gShoalCave_LowTideStairsRoom_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SHOAL_CAVE_LOW_TIDE_LOWER_ROOM),
        .mapNum = MAP_NUM(MAP_SHOAL_CAVE_LOW_TIDE_LOWER_ROOM),
        .landMonsInfo = &gShoalCave_LowTideLowerRoom_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SHOAL_CAVE_LOW_TIDE_INNER_ROOM),
        .mapNum = MAP_NUM(MAP_SHOAL_CAVE_LOW_TIDE_INNER_ROOM),
        .landMonsInfo = &gShoalCave_LowTideInnerRoom_LandMonsInfo,
        .waterMonsInfo = &gShoalCave_LowTideInnerRoom_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gShoalCave_LowTideInnerRoom_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SHOAL_CAVE_LOW_TIDE_ENTRANCE_ROOM),
        .mapNum = MAP_NUM(MAP_SHOAL_CAVE_LOW_TIDE_ENTRANCE_ROOM),
        .landMonsInfo = &gShoalCave_LowTideEntranceRoom_LandMonsInfo,
        .waterMonsInfo = &gShoalCave_LowTideEntranceRoom_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gShoalCave_LowTideEntranceRoom_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_LILYCOVE_CITY),
        .mapNum = MAP_NUM(MAP_LILYCOVE_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gLilycoveCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gLilycoveCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_DEWFORD_TOWN),
        .mapNum = MAP_NUM(MAP_DEWFORD_TOWN),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gDewfordTown_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gDewfordTown_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SLATEPORT_CITY),
        .mapNum = MAP_NUM(MAP_SLATEPORT_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gSlateportCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSlateportCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MOSSDEEP_CITY),
        .mapNum = MAP_NUM(MAP_MOSSDEEP_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gMossdeepCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gMossdeepCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_PACIFIDLOG_TOWN),
        .mapNum = MAP_NUM(MAP_PACIFIDLOG_TOWN),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gPacifidlogTown_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gPacifidlogTown_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_EVER_GRANDE_CITY),
        .mapNum = MAP_NUM(MAP_EVER_GRANDE_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gEverGrandeCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gEverGrandeCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_PETALBURG_CITY),
        .mapNum = MAP_NUM(MAP_PETALBURG_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gPetalburgCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gPetalburgCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_UNDERWATER_ROUTE124),
        .mapNum = MAP_NUM(MAP_UNDERWATER_ROUTE124),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gUnderwater_Route124_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SHOAL_CAVE_LOW_TIDE_ICE_ROOM),
        .mapNum = MAP_NUM(MAP_SHOAL_CAVE_LOW_TIDE_ICE_ROOM),
        .landMonsInfo = &gShoalCave_LowTideIceRoom_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SKY_PILLAR_1F),
        .mapNum = MAP_NUM(MAP_SKY_PILLAR_1F),
        .landMonsInfo = &gSkyPillar_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SOOTOPOLIS_CITY),
        .mapNum = MAP_NUM(MAP_SOOTOPOLIS_CITY),
        .landMonsInfo = NULL,
        .waterMonsInfo = &gSootopolisCity_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSootopolisCity_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SKY_PILLAR_3F),
        .mapNum = MAP_NUM(MAP_SKY_PILLAR_3F),
        .landMonsInfo = &gSkyPillar_3F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SKY_PILLAR_5F),
        .mapNum = MAP_NUM(MAP_SKY_PILLAR_5F),
        .landMonsInfo = &gSkyPillar_5F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_SOUTHEAST),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_SOUTHEAST),
        .landMonsInfo = &gSafariZone_Southeast_LandMonsInfo,
        .waterMonsInfo = &gSafariZone_Southeast_WaterMonsInfo,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = &gSafariZone_Southeast_FishingMonsInfo,
    },
    {
        .mapGroup = MAP_GROUP(MAP_SAFARI_ZONE_NORTHEAST),
        .mapNum = MAP_NUM(MAP_SAFARI_ZONE_NORTHEAST),
        .landMonsInfo = &gSafariZone_Northeast_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = &gSafariZone_Northeast_RockSmashMonsInfo,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_1F),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_1F),
        .landMonsInfo = &gMagmaHideout_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_2F_1R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_2F_1R),
        .landMonsInfo = &gMagmaHideout_2F_1R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_2F_2R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_2F_2R),
        .landMonsInfo = &gMagmaHideout_2F_2R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_3F_1R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_3F_1R),
        .landMonsInfo = &gMagmaHideout_3F_1R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_3F_2R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_3F_2R),
        .landMonsInfo = &gMagmaHideout_3F_2R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_4F),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_4F),
        .landMonsInfo = &gMagmaHideout_4F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_3F_3R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_3F_3R),
        .landMonsInfo = &gMagmaHideout_3F_3R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MAGMA_HIDEOUT_2F_3R),
        .mapNum = MAP_NUM(MAP_MAGMA_HIDEOUT_2F_3R),
        .landMonsInfo = &gMagmaHideout_2F_3R_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MIRAGE_TOWER_1F),
        .mapNum = MAP_NUM(MAP_MIRAGE_TOWER_1F),
        .landMonsInfo = &gMirageTower_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MIRAGE_TOWER_2F),
        .mapNum = MAP_NUM(MAP_MIRAGE_TOWER_2F),
        .landMonsInfo = &gMirageTower_2F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MIRAGE_TOWER_3F),
        .mapNum = MAP_NUM(MAP_MIRAGE_TOWER_3F),
        .landMonsInfo = &gMirageTower_3F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_MIRAGE_TOWER_4F),
        .mapNum = MAP_NUM(MAP_MIRAGE_TOWER_4F),
        .landMonsInfo = &gMirageTower_4F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_DESERT_UNDERPASS),
        .mapNum = MAP_NUM(MAP_DESERT_UNDERPASS),
        .landMonsInfo = &gDesertUnderpass_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ARTISAN_CAVE_B1F),
        .mapNum = MAP_NUM(MAP_ARTISAN_CAVE_B1F),
        .landMonsInfo = &gArtisanCave_B1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ARTISAN_CAVE_1F),
        .mapNum = MAP_NUM(MAP_ARTISAN_CAVE_1F),
        .landMonsInfo = &gArtisanCave_1F_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave1_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave2_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave3_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave4_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave5_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave6_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave7_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave8_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_ALTERING_CAVE),
        .mapNum = MAP_NUM(MAP_ALTERING_CAVE),
        .landMonsInfo = &gAlteringCave9_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_METEOR_FALLS_STEVENS_CAVE),
        .mapNum = MAP_NUM(MAP_METEOR_FALLS_STEVENS_CAVE),
        .landMonsInfo = &gMeteorFalls_StevensCave_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_UNDEFINED),
        .mapNum = MAP_NUM(MAP_UNDEFINED),
        .landMonsInfo = NULL,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
};



const struct WildPokemon gBattlePyramid_1_LandMons[] =
{
    { 5, 5, SPECIES_BULBASAUR },
    { 5, 5, SPECIES_BULBASAUR },
    { 5, 5, SPECIES_BULBASAUR },
    { 5, 5, SPECIES_BULBASAUR },
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_CHARMANDER },
};

const struct WildPokemonInfo gBattlePyramid_1_LandMonsInfo = { 4, gBattlePyramid_1_LandMons };
const struct WildPokemon gBattlePyramid_2_LandMons[] =
{
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_IVYSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMANDER },
};

const struct WildPokemonInfo gBattlePyramid_2_LandMonsInfo = { 4, gBattlePyramid_2_LandMons };
const struct WildPokemon gBattlePyramid_3_LandMons[] =
{
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_VENUSAUR },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARIZARD },
};

const struct WildPokemonInfo gBattlePyramid_3_LandMonsInfo = { 4, gBattlePyramid_3_LandMons };
const struct WildPokemon gBattlePyramid_4_LandMons[] =
{
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMANDER },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_SQUIRTLE },
};

const struct WildPokemonInfo gBattlePyramid_4_LandMonsInfo = { 4, gBattlePyramid_4_LandMons };
const struct WildPokemon gBattlePyramid_5_LandMons[] =
{
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_WARTORTLE },
};

const struct WildPokemonInfo gBattlePyramid_5_LandMonsInfo = { 4, gBattlePyramid_5_LandMons };
const struct WildPokemon gBattlePyramid_6_LandMons[] =
{
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
};

const struct WildPokemonInfo gBattlePyramid_6_LandMonsInfo = { 4, gBattlePyramid_6_LandMons };
const struct WildPokemon gBattlePyramid_7_LandMons[] =
{
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_WARTORTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_SQUIRTLE },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARIZARD },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
    { 5, 5, SPECIES_CHARMELEON },
};

const struct WildPokemonInfo gBattlePyramid_7_LandMonsInfo = { 8, gBattlePyramid_7_LandMons };

const struct WildPokemonHeader gBattlePyramidWildMonHeaders[] =
{
    {
        .mapGroup = 0,
        .mapNum = 1,
        .landMonsInfo = &gBattlePyramid_1_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 2,
        .landMonsInfo = &gBattlePyramid_2_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 3,
        .landMonsInfo = &gBattlePyramid_3_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 4,
        .landMonsInfo = &gBattlePyramid_4_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 5,
        .landMonsInfo = &gBattlePyramid_5_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 6,
        .landMonsInfo = &gBattlePyramid_6_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 7,
        .landMonsInfo = &gBattlePyramid_7_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_UNDEFINED),
        .mapNum = MAP_NUM(MAP_UNDEFINED),
        .landMonsInfo = NULL,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
};



const struct WildPokemon gBattlePike_1_LandMons[] =
{
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_DUSCLOPS },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
};

const struct WildPokemonInfo gBattlePike_1_LandMonsInfo = { 10, gBattlePike_1_LandMons };
const struct WildPokemon gBattlePike_2_LandMons[] =
{
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_ELECTRODE },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
};

const struct WildPokemonInfo gBattlePike_2_LandMonsInfo = { 10, gBattlePike_2_LandMons };
const struct WildPokemon gBattlePike_3_LandMons[] =
{
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_BRELOOM },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
};

const struct WildPokemonInfo gBattlePike_3_LandMonsInfo = { 10, gBattlePike_3_LandMons };
const struct WildPokemon gBattlePike_4_LandMons[] =
{
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_WOBBUFFET },
    { 5, 5, SPECIES_SEVIPER },
    { 5, 5, SPECIES_MILOTIC },
};

const struct WildPokemonInfo gBattlePike_4_LandMonsInfo = { 10, gBattlePike_4_LandMons };

const struct WildPokemonHeader gBattlePikeWildMonHeaders[] =
{
    {
        .mapGroup = 0,
        .mapNum = 1,
        .landMonsInfo = &gBattlePike_1_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 2,
        .landMonsInfo = &gBattlePike_2_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 3,
        .landMonsInfo = &gBattlePike_3_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = 0,
        .mapNum = 4,
        .landMonsInfo = &gBattlePike_4_LandMonsInfo,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
    {
        .mapGroup = MAP_GROUP(MAP_UNDEFINED),
        .mapNum = MAP_NUM(MAP_UNDEFINED),
        .landMonsInfo = NULL,
        .waterMonsInfo = NULL,
        .rockSmashMonsInfo = NULL,
        .fishingMonsInfo = NULL,
    },
};
