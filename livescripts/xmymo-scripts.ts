import { eventNames } from "node:process";

const COMMAND_PREFIX = "-";
const GEARUP_COMMAND = COMMAND_PREFIX + "gearup";

const TANK_ROLE = "tank";
const HEALER_ROLE = "healer";
const DPS_ROLE = "dps";
const INVALID_ROLE = "invalid";

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
    entries:Array<ML_Entry> = new Array<ML_Entry>();

    public AddEntry(player:TSPlayer, dmg:TSMutable<number>) 
    {
        this.entries.push(
            new ML_Entry(
                player.GetClass(),
                dmg.get(),
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
                dmg.get()
                ));
    }

    public GetLastEntry():ML_Entry
    {
        return this.entries.get(this.entries.length-1);
    }
}

// TODO: Append data to dataset file every Interval and reset variables.
const data:ML_Data = new ML_Data();

//Pos(0,-8824.375000,800.609314,97.657875,0.497085),
const STORMWIND_STOCKADES_TP:TeleportData = new TeleportData(
    0,
    -8824.375000,
    800.609314,
    97.657875,
    0.497085)

const BOSS_ID:int = 1696;

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

            player.SetLevel(25);
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
            if (!dmgInfo.GetAttacker().IsPlayer()) return;
            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            data.AddEntry(dmgInfo.GetAttacker().ToPlayer(), dmg);
            dmgInfo.GetTarget().AddThreat(
                dmgInfo.GetAttacker().ToPlayer(), 
                dmg.get(), 
                undefined, 
                undefined, 
                undefined, 
                undefined,  
                true);
        })
        
    
    events.Formula.OnSpellDamageEarly((dmgInfo, spell, typeId, isCrit, dmg) =>
        {
            if (!dmgInfo.GetAttacker().IsPlayer()) return;
            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            data.AddEntry(dmgInfo.GetAttacker().ToPlayer(), dmg);
            dmgInfo.GetTarget().AddThreat(
                dmgInfo.GetAttacker().ToPlayer(), 
                dmg.get(), 
                undefined, 
                undefined, 
                undefined, 
                undefined,  
                true);
        })


    // Owner is the mob, target is the player.
    events.Formula.OnAddThreatEarly((owner, target, spell, isRaw, value)=>
        {
            if (isRaw) return;
            if (value.get() == 0.0) return;

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

    function IsBoss(id:int):bool
    {
        return id == BOSS_ID;
    } 

    
    // events.Formula.OnAddThreatLate((owner,target,spell,israw,value)=>
    //     {
    //         if (value.get() == 0.0) return;

    //         //value.set(value.get()+1);
    //         owner.SendUnitSay("[LATE] Threat towards: " + target.GetName() + " = " + value.get(), 0);
    //     }
    // )



    // events.Player.OnSay((player, type, lang, msg) => 
    //     {
    //         if (msg.get().length < GEARUP_COMMAND.length) return;

    //         if (msg.get() == GEARUP_COMMAND)
    //         {
    //             InformGearupUsage(player);
    //             return;
    //         }

    //         var splitMsg = msg.get().split(' ');

    //         if (splitMsg.length > 3 || splitMsg.length < 3) InformGearupUsage(player);
    //         else if (!CheckIsClassName(splitMsg[1])) InformGearupUsage(player);
    //         else
    //         {
    //             var role = CheckGetRole(splitMsg[2]);

    //             if (role == INVALID_ROLE) InformGearupUsage(player);
    //             else if (!CheckClassCanPlayRole(splitMsg[1], role)) InformGearupUsage(player);
    //             else HandleGearUp(splitMsg[1], role, player);
    //         }
    //     }
    // )
}

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

// function CheckIsClassName(msg:string) : bool
// {
//     var temp = msg.toLowerCase();

//     return (
//         temp == "warrior" ||
//         temp == "paladin" ||
//         temp == "hunter" ||
//         temp == "rogue" ||
//         temp == "priest" ||
//         temp == "deathknight" ||
//         temp == "shaman" ||
//         temp == "mage" ||
//         temp == "warlock" ||
//         temp == "druid");
// }

// function CheckGetRole(msg:string) : string
// {
//     var temp = msg.toLowerCase();

//     if (temp == DPS_ROLE) return DPS_ROLE;
//     if (temp == TANK_ROLE) return TANK_ROLE;
//     if (temp == HEALER_ROLE) return HEALER_ROLE;

//     return INVALID_ROLE;
// }

// function CheckClassCanPlayRole(className: string, role: string) : bool
// {
//     if (role == DPS_ROLE) return true;
//     if (role == HEALER_ROLE) return CheckClassCanHeal(className);
//     if (role == TANK_ROLE) return CheckClassCanTank(className);
//     return false;
// }

// function CheckClassCanTank(className: string) : bool
// {
//     var temp =className.toLowerCase();

//     return (
//         temp == "warrior" ||
//         temp == "paladin" ||
//         temp == "deathknight" ||
//         temp == "druid");
// }

// function CheckClassCanHeal(className: string) : bool
// {
//     var temp =className.toLowerCase();

//     return (
//         temp == "paladin" ||
//         temp == "priest" ||
//         temp == "shaman" ||
//         temp == "druid");
// }

// function InformGearupUsage(player: TSPlayer)
// {
//     player.SendBroadcastMessage("Usage:");
//     player.SendBroadcastMessage(GEARUP_COMMAND + " [class] [dps/tank/healer]");
//     player.SendBroadcastMessage("i.e: " + GEARUP_COMMAND + " deathknight tank");
//     return;
// }

// function HandleGearUp(className:string, role:string, player:TSPlayer)
// {
//     // This part is only reached if a valid gearup command is given, i.e. class & role are valid
//     // both separately and as as combination.

//     if (role == DPS_ROLE) GiveDPSGear(className, player);
//     else if (role == HEALER_ROLE) GiveHealerGear(className, player);
//     else GiveTankGear(className, player);
// }

// function GiveDPSGear(className:string, player:TSPlayer)
// {
//     switch (player.GetClass())
//             {
//                 // Warrior
//                 case 1:
//                     break;
//                 // Paladin
//                 case 2:
//                     break;
//                 // Hunter
//                 case 3:
//                     break;
//                 // Rogue
//                 case 4:
//                     break;
//                 // Priest
//                 case 5:
//                     break;
//                 // Death Knight
//                 case 6:
//                     break;
//                 // Shaman
//                 case 7:
//                     break;
//                 // Mage
//                 case 8:
//                     break;
//                 // Warlock
//                 case 9:
//                     break;
//                 // Druid
//                 case 11:
//                     break;
                    
//             }
// }

// function GiveTankGear(className:string, player:TSPlayer)
// {
//     if (className == "warrior"){
//         // TODO...
//         player.GetLevel
//     }
//     else if (className == "paladin"){
//         // TODO...
//     }
//     else if (className = "deathknight"){
//         // TODO...
//     }
//     // druid
//     else 
//     {
//         // TODO...
//     }
// }

// function GiveHealerGear(className:string, player:TSPlayer)
// {
//     if (className == "paladin"){
//         // TODO...
//     }
//     else if (className == "priest"){
//         // TODO...
//     }
//     else if (className = "shaman"){
//         // TODO...
//     }
//     // druid
//     else 
//     {
//         // TODO...
//     }
// }