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

//Pos(0,-8824.375000,800.609314,97.657875,0.497085),
const STORMWIND_STOCKADES_TP:TeleportData = new TeleportData(
    0,
    -8824.375000,
    800.609314,
    97.657875,
    0.497085)

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

    // events.Formula.OnAddThreatEarly((owner, target, spell, isRaw, value)=>
    //     {
    //         if (value.get() == 0.0) return;

    //         owner.SendUnitSay("[EARLY] Threat towards: " + target.GetName() + " = " + value.get(), 0);
    //     }
    // )

    
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