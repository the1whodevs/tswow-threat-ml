import { eventNames, stderr } from "process";

const COMMAND_PREFIX = "-";
const GEARUP_COMMAND = COMMAND_PREFIX + "gearup";

class TeleportData 
{
    mapId:uint32 = 0;
    xCoord:float = 0.0;
    yCoord:float = 0.0;
    zCoord:float = 0.0;
    orientation:float = 0.0;

    constructor(mapId:uint32, xCoord:float, yCoord:float, zCoord:float, orientation:float)
    {
        this.mapId = mapId;
        this.xCoord = xCoord;
        this.yCoord= yCoord;
        this.zCoord = zCoord;
        this.orientation = orientation;
    }
}

class ML_Entry
{
    class_id:int;
    dmg_dealt:int;
    stat_3:int; // extra agi from items
    stat_4:int; // extra str from items
    stat_5:int; // extra int from items
    stat_6:int; // extra spi from items
    stat_7:int; // extra sta from items
    stat_12:int; // extra def rating from items
    stat_13:int; // extra dodge rating from items
    stat_14:int; // extra parry rating from items
    stat_15:int; // extra block rating from items
    stat_31:int; // extra hit rating from items
    stat_32:int; // extra crit rating from items
    stat_33:int; // extra hit taken from items
    stat_34:int; // extra crit taken from items
    stat_38:int; // extra attack power from items
    stat_39:int; // extra ranged attack power from items
    stat_41:int; // extra spell healing done from items
    stat_42:int; // extra spell damage done from items
    stat_44:int; // extra armor penetration rating from items
    stat_45:int; // extra spell power from items
    stat_46:int; // extra health regen from items
    stat_47:int; // extra spell penetration from items
    stat_48:int; // extra block value from items
    threat:int; // (1 dmg = 1 threat)

    constructor(class_id:int,
        dmg_dealt:int,
        stat_3:int,
        stat_4:int,
        stat_5:int,
        stat_6:int,
        stat_7:int,
        stat_12:int,
        stat_13:int,
        stat_14:int,
        stat_15:int,
        stat_31:int,
        stat_32:int,
        stat_33:int,
        stat_34:int,
        stat_38:int,
        stat_39:int,
        stat_41:int,
        stat_42:int,
        stat_44:int,
        stat_45:int,
        stat_46:int,
        stat_47:int,
        stat_48:int,
        threat:int)
    {
        this.class_id  = class_id;
        this.dmg_dealt = dmg_dealt;
        this.stat_3 = stat_3;
        this.stat_4 = stat_4;
        this.stat_5 = stat_5;
        this.stat_6 = stat_6;
        this.stat_7 = stat_7;
        this.stat_12 = stat_12;
        this.stat_13 = stat_13;
        this.stat_14 = stat_14;
        this.stat_15 = stat_15;
        this.stat_31 = stat_31;
        this.stat_32 = stat_32;
        this.stat_33 = stat_33;
        this.stat_34 = stat_34;
        this.stat_38 = stat_38;
        this.stat_39 = stat_39;
        this.stat_41 = stat_41;
        this.stat_42 = stat_42;
        this.stat_44 = stat_44;
        this.stat_45 = stat_45;
        this.stat_46 = stat_46;
        this.stat_47 = stat_47;
        this.stat_48 = stat_48;
        this.threat = threat;
    }
}

class ML_Data
{
    entries:TSArray<ML_Entry> = [];

    public ResetEntries()
    {
        this.entries = <TSArray<ML_Entry>> [];    
    }

    public AddEntry(player:TSPlayer, dmg:number) 
    {
        this.entries.push(
            new ML_Entry(
                player.GetClass(),
                dmg,
                player.GetStat(3),
                player.GetStat(4),
                player.GetStat(5),
                player.GetStat(6),
                player.GetStat(7),
                player.GetStat(12),
                player.GetStat(13),
                player.GetStat(14),
                player.GetStat(15),
                player.GetStat(31),
                player.GetStat(32),
                player.GetStat(33),
                player.GetStat(34),
                player.GetStat(38),
                player.GetStat(39),
                player.GetStat(41),
                player.GetStat(42),
                player.GetStat(44),
                player.GetStat(45),
                player.GetStat(46),
                player.GetStat(47),
                player.GetStat(48),
                dmg
                ));
    }

    public GetString():string
    {
        let dump = ""

        for (let entry of this.entries)
        {
            dump += entry.class_id + "," +
            entry.dmg_dealt + "," +
            entry.stat_3 + "," +
            entry.stat_4 + "," +
            entry.stat_5 + "," +
            entry.stat_6 + "," +
            entry.stat_7 + "," +
            entry.stat_12 + "," +
            entry.stat_13 + "," +
            entry.stat_14 + "," +
            entry.stat_15 + "," +
            entry.stat_31 + "," +
            entry.stat_32 + "," +
            entry.stat_33 + "," +
            entry.stat_34 + "," +
            entry.stat_38 + "," +
            entry.stat_39 + "," +
            entry.stat_41 + "," +
            entry.stat_42 + "," +
            entry.stat_44 + "," +
            entry.stat_45 + "," +
            entry.stat_46 + "," +
            entry.stat_47 + "," +
            entry.stat_48 + "," +
            entry.threat + ";"
        }

        return dump;
    }

    public GetStringWithoutThreat():string
    {
        let dump = ""

        for (let entry of this.entries)
        {
            dump += entry.class_id + "," +
            entry.dmg_dealt + "," +
            entry.stat_3 + "," +
            entry.stat_4 + "," +
            entry.stat_5 + "," +
            entry.stat_6 + "," +
            entry.stat_7 + "," +
            entry.stat_12 + "," +
            entry.stat_13 + "," +
            entry.stat_14 + "," +
            entry.stat_15 + "," +
            entry.stat_31 + "," +
            entry.stat_32 + "," +
            entry.stat_33 + "," +
            entry.stat_34 + "," +
            entry.stat_38 + "," +
            entry.stat_39 + "," +
            entry.stat_41 + "," +
            entry.stat_42 + "," +
            entry.stat_44 + "," +
            entry.stat_45 + "," +
            entry.stat_46 + "," +
            entry.stat_47 + "," +
            entry.stat_48;
        }

        return dump;
    }

    public GetLastEntry():ML_Entry
    {
        return this.entries.get(this.entries.length-1);
    }
}

const data:ML_Data = new ML_Data();

//Pos(0,-8824.375000,800.609314,97.657875,0.497085),
const STORMWIND_STOCKADES_TP:TeleportData = new TeleportData(
    0,
    -8824.375000,
    800.609314,
    97.657875,
    0.497085)

const BOSS_ID:int = 1696;

function IsBoss(id:int):bool
{
    return id == BOSS_ID;
}

function AddItem(player:TSPlayer, id:int, slot:int, equip:boolean)
{
    var item = player.AddItem(id, 1);

    if (equip) player.EquipItem(item, slot, id);
}

function TalentUp(player:TSPlayer, specId:uint32)
{
    var classId = player.GetClass();

    player.ResetTalents(true);

    var talentStr = ReadFile(classId+"_"+specId+".csv").split(';');

    // For each [talentId, rank] pair, learn!
    talentStr.forEach
    (
        talentIdRankPair => 
        {
            var pair = talentIdRankPair.split(',');
            player.LearnTalent(ToUInt32(pair[0]), ToUInt32(pair[1]));
        }
    );
}

function Gearup(player:TSPlayer, specId:uint32)
{
    var classId = player.GetClass();

    TalentUp(player, specId);


}

// Register your events here!
export function Main(events: TSEventHandlers) 
{    
    // Prevent players from getting XP
    events.Player.OnGiveXP((player, amount, victim)=>
        {
            amount.set(0);
        }
    )

    events.Player.OnLogin((player, firstLogin) => 
        {
            if (!firstLogin) return;

            player.SetLevel(80);

            player.LearnClassSpells(true, true);
            player.AdvanceSkillsToMax();
            player.ModifyMoney(10000000000);

            AddItem(player, 51809, 20, true);
            AddItem(player, 51809, 21, true);
            AddItem(player, 51809, 22, true);

            if (player.IsAlliance())
            {
                player.SetReputation(1068, 100000);
                player.SetReputation(1094, 100000);
                player.SetReputation(1050, 100000);
            }
            else
            {
                player.SetReputation(1085, 100000);
                player.SetReputation(1064, 100000);
                player.SetReputation(1124, 100000);       
                player.SetReputation(1067, 100000);      
            }
            
            player.SetReputation(1106, 100000);
            player.SetReputation(1104, 2500);
            player.SetReputation(1090, 100000);
            player.SetReputation(1098, 100000);
            player.SetReputation(1156, 100000);
            player.SetReputation(1073, 100000);
            player.SetReputation(1105, 100000);
            player.SetReputation(1119, 100000);
            player.SetReputation(1091, 100000);

            // InformGearupUsage(player);

            player.Teleport(
                STORMWIND_STOCKADES_TP.mapId, 
                STORMWIND_STOCKADES_TP.xCoord, 
                STORMWIND_STOCKADES_TP.yCoord, 
                STORMWIND_STOCKADES_TP.zCoord, 
                STORMWIND_STOCKADES_TP.orientation);
        }
    )

    events.Formula.OnMeleeDamageEarly((dmgInfo, typeId, id, dmg) =>
        {
            if (dmg.get() == 0) return;
            if (!dmgInfo.GetAttacker().IsPlayer()) return;
            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            data.AddEntry(dmgInfo.GetAttacker().ToPlayer(), dmg.get());
            dmgInfo.GetTarget().AddThreat(
                dmgInfo.GetAttacker().ToPlayer(), 
                dmg.get(), 0, 0, false, false, true);

            // data.GetStringWithoutThreat().split(',')
        })
        
    
    events.Formula.OnSpellDamageEarly((dmgInfo, spell, typeId, isCrit, dmg) =>
        {
            if (dmg.get() == 0) return;
            if (!dmgInfo.GetAttacker().IsPlayer()) return;

            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            // dmgInfo.GetAttacker().ToPlayer().SendUnitSay("(OSDE) Adding entry with threat : " + dmg.get(), 0);

            data.AddEntry(dmgInfo.GetAttacker().ToPlayer(), dmg.get());
            dmgInfo.GetTarget().AddThreat(
                dmgInfo.GetAttacker().ToPlayer(), 
                dmg.get(), 0, 0, false, false, true);
        })


    // Fires when the given npc id dies.
    events.CreatureID.OnDeath(BOSS_ID, (creature, killer) => 
        {
            killer.SendUnitSay("Killed the boss, dumping data...", 0);
            WriteFile("data", data.GetString());
        })

    // Owner is the mob, target is the player.
    events.Formula.OnAddThreatEarly((owner, target, spell, isRaw, value)=>
        {
            if (value.get() == 0.0) return;

            if (isRaw)
            {
                // target.SendUnitSay("AddThreatEarly! Owner : " + owner.GetName() + " Target : " + target.GetName() + " Threat : " + value.get(), 0);
                return;
            } 

            if (IsBoss(owner.ToCreature().GetEntry()))
            {
                /*
                This does set added threat to 0 BUT last attacked player
                will still be attacked unless the mob is reset!
                */
                value.set(0);
                owner.ScaleThreat(target, 0, true);

                /*
                Use target.ToPlayer().GetClass() to read from the ml_data var,
                and calculate threat
                */
            }
        }
    )

    events.Player.OnCommand((player, command, found) => 
    {
        var split = command.get().split(' ');

        if (split[0] == "gearup" && 
            (split[1] == "1" || split[1] == "2" || split[1] == "3"))
        {
            Gearup(player, ToUInt32(split[1]));

            found.set(true);
        }
    })
}

function InformGearupUsage(player: TSPlayer)
{
    player.SendBroadcastMessage("Usage:");
    player.SendBroadcastMessage(GEARUP_COMMAND + " [class] [dps/tank/healer]");
    player.SendBroadcastMessage("i.e: " + GEARUP_COMMAND + " deathknight tank");
    return;
}



/*
ENHANCEMENT SHAMAN GEAR
//HEAD
AddItem(player, 51242, 0, true);
//NECK
AddItem(player, 50633, 1, true);
//SHOULDERS
AddItem(player, 51240, 2, true);
//BACK
AddItem(player, 50653, 14, true);
//CHEST
AddItem(player, 50689, 4, true);
//WRISTS
AddItem(player, 50655, 8, true);
//HANDS
AddItem(player, 51243, 9, true);
//WAIST
AddItem(player, 50688, 5, true);
//LEGS
AddItem(player, 51241, 6, true);
//FEET
AddItem(player, 54577, 7, true);
//FINGER1
AddItem(player, 50678, 10, true);
//FINGER2
AddItem(player, 50402, 11, true);
//TRINKET1
AddItem(player, 50706, 12, true);
//TRINKET2
AddItem(player, 54590, 13, true);
//MAINHAND
AddItem(player, 50737, 15, true);
//OFFHAND
AddItem(player, 50737, 16, true);
//RANGED(totems/wands/etc)
AddItem(player, 50463, 17, true);
*/

//     switch (player.GetClass())
        //     {
        //         // Warrior
        //         case 1:
        //             break;
        //         // Paladin
        //         case 2:
        //             break;
        //         // Hunter
        //         case 3:
        //             break;
        //         // Rogue
        //         case 4:
        //             break;
        //         // Priest
        //         case 5:
        //             break;
        //         // Death Knight
        //         case 6:
        //             break;
        //         // Shaman
        //         case 7:
        //             break;
        //         // Mage
        //         case 8:
        //             break;
        //         // Warlock
        //         case 9:
        //             break;
        //         // Druid
        //         case 11:
        //             break;
                    
        //     }