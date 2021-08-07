import { eventNames, stderr } from "process";

const COMMAND_PREFIX = "-";

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

class DPS_Entry
{
    player:uint32;
    dmg:uint32;

    constructor(player:uint32,
        dmg:uint32)
    {
        this.player = player;
        this.dmg = dmg;
    }
}

class ML_Data
{
    entries:TSArray<DPS_Entry> = [];

    public ResetEntries()
    {
        this.entries = <TSArray<DPS_Entry>> [];    
    }

    public AddEntry(player:uint32, dmg:uint32) 
    {
        this.entries.push(new DPS_Entry(player, dmg));
    }

    public GetLastEntry():DPS_Entry
    {
        return this.entries.get(this.entries.length-1);
    }

    public GetDPS(player:uint32):uint32{

        let dmg:uint32 = 0;
        let entryCount:uint32 = 0;

        this.entries.forEach(dps_entry => {
            if (dps_entry.player == player){
                entryCount++;
                dmg += dps_entry.dmg;
            }
        });

        if (entryCount == 0){
            entryCount = 1;
        }

        return dmg/entryCount;
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

/*
This should only be used for bags OnLogin ideally.
*/
function ForceAddItem(player:TSPlayer, id:int, slot:int)
{
    var item = player.AddItem(id, 1);
    player.EquipItem(item, slot, id);
}

function AddItem(player:TSPlayer, id:int, slot:int, equip:boolean)
{
    let fingerSlots = [ 10 , 11];
    let trinketSlots = [ 12, 13 ];

    var isFinger = false;
    var isTrinket = false;
    var otherFingerTrinketSlot = -1;

    if (slot == fingerSlots[0]){
        otherFingerTrinketSlot = fingerSlots[1];
        isFinger = true;
    }
    else if (slot == fingerSlots[1]){
        otherFingerTrinketSlot = fingerSlots[0];
        isFinger = true;
    }
    else if (slot == trinketSlots[0]){
        otherFingerTrinketSlot = trinketSlots[1];
        isTrinket = true;
    }
    else if (slot == trinketSlots[1]){
        otherFingerTrinketSlot = trinketSlots[0];
        isTrinket = true;
    }

    var item = player.AddItem(id, 1);

    // This is true either when that item is already equipped or when the item ID is invalid.
    if (item.IsNull()){

        // Item is finger or trinket and already equipped on one of the 2 available slots.
        if ((isFinger || isTrinket) && (player.GetEquippedItemBySlot(slot).GetEntry() == id || player.GetEquippedItemBySlot(otherFingerTrinketSlot).GetEntry() == id)) return;

        // Item is not finger or trinket and is already equipped!
        if (player.GetEquippedItemBySlot(slot).GetEntry() == id) return;

        player.Say("Item ID:["+id+"] is null and NOT equipped on the same slot!", 0);
        return;
    }

    if (equip) 
    {
        if (!player.CanEquipItem(item, slot, item.GetEntry()))
        {
            let remove = player.GetEquippedItemBySlot(slot)

            if (remove.IsNull()){
                player.Say("I can't equip ["+item.GetName()+"] but not because something else is equipped there!", 0);
                return;
            }

            player.RemoveItem(remove, remove.GetCount(), remove.GetEntry())
        }
        
        player.EquipItem(item, slot, id);
    }   
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

    player.LearnClassSpells(true, true);
}

function GearUp(player:TSPlayer, specId:uint32)
{
    var classId = player.GetClass();

    var gearUpStr = ReadFile(classId+"_"+specId+"g.txt").split(';');

    // For each [equipSlot, itemId] pair, equip!
    gearUpStr.forEach
    (
        gearupSlotIdPair => 
        {
            var pair = gearupSlotIdPair.split(',');
            AddItem(player, ToUInt32(pair[1]), ToUInt32(pair[0]), true);
        }
    );
}

function GearAndTalentUp(player:TSPlayer, specId:uint32)
{
    // Druid Feral Tank!
    if (specId == 4) TalentUp(player, 2);
    else TalentUp(player, specId);

    GearUp(player, specId);
}

function HandleDmgToBoss(attacker:TSUnit, target:TSUnit, dmg:number)
{
    data.AddEntry(attacker.ToPlayer().GetGUID(), dmg);

    let party:TSArray<TSPlayer> = attacker.ToPlayer().GetMap().GetPlayers(2);
    let msgArgs:String = "";

    for (var i = 0; i < party.length; i++)
    {
        let player:TSPlayer = party.get(i);
        
        let dps:uint32 = data.GetDPS(player.GetGUID());

        if (dps >= 3000) {
            dps = 2999;
        }

        let runSpeed:uint32 = player.GetSpeed(1);

        if (runSpeed < 0) runSpeed = 0;
        if (runSpeed >= 10) runSpeed = 9;

        let maxHP:uint32 = player.GetMaxHealth();

        if (maxHP > 29999){
            maxHP = maxHP = 29999
        }

        msgArgs += dps + ",";
        msgArgs += runSpeed + ",";
        msgArgs += maxHP + "";

        // Only add a semicolon if another player will be added
        if (i < party.length - 1) msgArgs += ";";
    }
    
    var targetId = ToInt32(SyncHttpGet("localhost:5555/"+msgArgs));

    attacker.ToPlayer().Say("BOSS WANTS " + targetId, 0);

    if (party.length >= targetId){
        targetId = party.length - 1;
    }

    let targetPlayer:TSUnit = party.get(targetId);

    target.AddThreat(targetPlayer, 25000, 0, 0, false, false, true);
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

            ForceAddItem(player, 51809, 20);
            ForceAddItem(player, 51809, 21);
            ForceAddItem(player, 51809, 22);

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
            if (dmg.get() <= 0) return;
            if (!dmgInfo.GetAttacker().IsPlayer()) return;
            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            HandleDmgToBoss(dmgInfo.GetAttacker(), dmgInfo.GetTarget(), dmg.get());
        })
        
    
    events.Formula.OnSpellDamageEarly((dmgInfo, spell, typeId, isCrit, dmg) =>
        {
            if (dmg.get() <= 0) return;
            if (!dmgInfo.GetAttacker().IsPlayer()) return;

            if (!IsBoss(dmgInfo.GetTarget().ToCreature().GetEntry())) return;

            HandleDmgToBoss(dmgInfo.GetAttacker(), dmgInfo.GetTarget(), dmg.get());
        })


    // // Fires when the given npc id dies.
    // events.CreatureID.OnDeath(BOSS_ID, (creature, killer) => 
    //     {
    //         killer.SendUnitSay("Killed the boss, dumping data...", 0);
    //         WriteFile("data", data.GetString());
    //     })

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

        var isValid = split[0] == "gearup" && (split[1] == "1" || split[1] == "2" || split[1] == "3");

        if (!isValid && player.GetClass() == 11 && split[0] == "gearup" && split[1] == "4") isValid = true;

        if (isValid)
        {
            GearAndTalentUp(player, ToUInt32(split[1]));

            found.set(true);
        }
    })
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