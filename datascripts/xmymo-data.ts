import { writeFileSync } from 'fs';
import { std } from 'tswow-stdlib';
import { DBC } from 'wotlkdata/dbc/DBCFiles';

export const NECROMANCER_CLASS = 
    std.Classes.create(
        // Mod id
        'myname-mymod',
        // Entity id
        'necromancer',
        // The parent name of our class.
        'MAGE');

NECROMANCER_CLASS.addRaces(['HUMAN','ORC','BLOODELF']);

// Changes the english display name to "Necromancer"
NECROMANCER_CLASS.Name.enGB.set('Necromancer');

// Change display color
NECROMANCER_CLASS.UI.Color.set(0xcc0077)

// Add character creation description
NECROMANCER_CLASS.UI.Info.add('- Role: Damage, Tank')
NECROMANCER_CLASS.UI.Info.add('- Light Armor (Cloth)')
NECROMANCER_CLASS.UI.Info.add('- Controls multiple undead servants')
NECROMANCER_CLASS.UI.Info.add('- Uses mana as a resource')
NECROMANCER_CLASS.UI.Description.set("Necromancers raise and control the undead.")

// Attack power = 1337*intellect
NECROMANCER_CLASS.Stats.MeleeAttackPower.set('1337*int')
// Spell Crit = 0.1*level
NECROMANCER_CLASS.Stats.SpellCrit.set((x,level)=>1337*level)
// Melee crit = 0.1*level
NECROMANCER_CLASS.Stats.MeleeCrit.set((x,level)=>1337*level)

export const NECROMANCY_SKILL = std.SkillLines
    .createClass('tswow-introduction','necromancy-skill',NECROMANCER_CLASS.ID)
NECROMANCY_SKILL.Name.enGB.set(`Necromancy`)

export const DEATH_SKILL = std.SkillLines
    .createClass('tswow-introduction','death-skill',NECROMANCER_CLASS.ID)
DEATH_SKILL.Name.enGB.set(`Death`)

// let desiredSpells = [14747,14791,15008,15286,15308,15316,15317,15331,15336,15338,15407,15448,15473,15487,17191,17322,27816,27840,27904,33193,33213,33225,33371,34914,47570,47581,47585,51167,63627,64044
// ];

// var stringToDump = "";

// DBC.Talent.filter({})
//     // we want the functional filter
//     .filter
//     (
//         x =>
//         {
//             // Get all the ranks available for this talent.
//             let ranks = x.SpellRank.get();

//             // Foreach desired spellId..
//             desiredSpells.forEach
//             (
//                 y => 
//                 {
//                     let rank = ranks.indexOf(y);

//                     if(rank>=0) 
//                     {
//                         let id = x.ID.get();

//                         // now we have talent id + rank for this spell
//                         stringToDump += id + "," + rank + ";";
//                     }
//                 }
//             );
//         }
//     );

// // CLASSID_SPECID.csv
// writeFileSync("C:\\Users\\xmymo\\Desktop\\Final Project\\5_3.csv", stringToDump);