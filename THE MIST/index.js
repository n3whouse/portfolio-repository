//TODO: help/look fx's
//* sameRoom() skips room descriptions after room actions when player didn't change room. look/help fx's can repeat description or show available commands
//TODO: weapon class constructor? (how will that change inventory rules? e.g. rifle)
//*ideas: HP, fx for randomized hits (maybe), inventory influences stats or something like that?
//TODO: enemies constructor (enemies extends Location? maybe to attach each enemy to locations??) + hp system + enemies locations
//TODO: build out player class to incl. inventory, weapons, equip/unequip
//TODO: look for DOM directions in sdb repo to add to this project


const { Stats } = require('fs');
const readline = require('readline');
const readLineInterface = readline.createInterface(
  process.stdin,
  process.stdout
);

async function ask(textPrompt) {
  return new Promise((resolve, reject) =>
    readLineInterface.question(textPrompt, resolve)
  )
};

start();
//! LOCATIONS ------------------------------------
class Location {
  constructor(
    name,
    description,
    availableMoves,
    availableActions,
    availableItems,
    enemies
  ) {
    this.name = name;
    this.description = description;
    this.availableMoves = availableMoves;
    this.availableActions = availableActions;
    this.availableItems = availableItems;
    this.enemies = enemies;
  }
}

let currentLocation = "bedroom";
let inventory = [];

let firstRoom = new Location(
  "bedroom",
  `It's dark and this bedroom looks like it hasn't been occupied in years. There is a lamp in the far corner and the window on the north side is boarded shut. Cobwebs line the ceiling and dust hangs choking and heavy in the air, stinging your eyes.. \n
  Looks like the only way out is into the hallway.`,
  { n: null, e: "hallway", s: null, w: null },
  ["inspect", "take", "look"],
  { lamp: "It is a normal lamp. Y'know the kind." },
  []
);

let hallway = new Location(
  "hallway",
  `You leave the bedroom and walk out into a long corridor --- seemingly too big for the house that contained it.
  This room wasn't old and decrepit like the bedroom. It was.... interestingly well-maintained.
  Paintings adorn the walls on each side of the corridor. Beautiful ones. To the south, there is a doorway that appears to open up into a living room.\n`,
  { n: null, e: null, s: "living room", w: "bedroom" },
  ["inspect", "take"],
  {
    "oil portrait":
      "The painting seems of another time. An oil portrait of a stately looking man looking rather serious. He seems important. It has to be from a couple centuries ago..",
    "abstract painting":
      "Is... is this a real Rothko? You run your fingers over the paint marks. It's not a print, but it seems too new to be legit. Who can afford a repainted Rothko? Probably someone who has a whole decrepit house and gives all their energy and attention to their pristine art gallery... Who is this guy?"
  },
  []
)

let livingRoom = new Location(
  "living room",
  `You enter the living room. It doesn't look from this century. Cast iron pans and quirky antique signs line the walls. The only area of the room that betrays modernity is a wooden bar complete with a Kegerator, each tap topped with an antique-but-shiny handle. \n
  In the center of the living room, there is a table in the room adorned with a tapestry. On the east side of the room, there is a stone fireplace. To the west, there is a door that leads to the outside.\n`,
  { n: "hallway", e: "fireplace", s: null, w: "front yard" },
  ["take", "inspect"],
  {
    lantern: "It's a cool old lamp. Might be an antique",
    bottle: "It's a small glass bottle. It's in great condition.",
  },
  []
);

let fireplace = new Location(
  "fireplace",
  `The fireplace is made of stone and has a rocking chair in front of it. It looks as if someone was here recently. Embers still glow in the firepit. It is empty.\n
  Above the cobbled stone making up the fireplace's arch sits a rifle. `,
  { n: null, e: null, s: null, w: "living room" },
  ["inspect", "take"],
  {
    rifle:
      "An old Winchester rifle. Looks like it still functions. No ammo, though. Hmm. There's gotta be some around here somewhere...",
  },
  []
);

let frontYard = new Location(
  "front yard",
  `You step outside to the front yard. It is overgrown with weeds. There is a gravel path out to the main dirt road and you are facing west. The weather is gray and ominous. Mist and fog shroud your surroundings in all directions. If you go out to the dirt road and follow it north, it sounds like running water is close.\n `,
  { n: null, e: "living room", s: null, w: "dirt road" },
  [],
  {},
  []
);

let dirtRoad = new Location(
  "dirt road",
  `You walk out onto the dirt road. The fog and mist make it impossible to see in either direction, but the running water sound was coming form the north.\n `,
  { n: "river", e: "living room", s: null, w: null },
  [],
  {},
  []
);

let river = new Location(
  "river",
  `After walking north toward the sound of rushing water for what seems like a mile, you come across a rushing river with a bridge over it. You see a small plaque with an engraving on the bridge. It can probably give you a hint about where you are...\n `,
  { n: null, e: null, s: "dirt road", w: null },
  ["inspect"],
  {
    plaque: `The plaque reads: Henbane River - Holland Valley, Hope County, Montana`,
  },
  []
);


// ! Location Lookup
let locationLookUp = {
  bedroom: firstRoom,
  hallway: hallway,
  'living room': livingRoom,
  fireplace: fireplace,
  "front yard": frontYard,
  "dirt road": dirtRoad,
  river: river,
};

//! All Available Moves

function Directions(directions) {
  this.n = directions.n || "north";
  this.s = directions.s || "south";
  this.e = directions.e || "east";
  this.w = directions.w || "west";
}

function RoomActions(actions) {
  this.inspect = actions.inspect || "inspect an item";
  this.take = actions.take || "take an item";
  this.look = actions.look || "Room details";
  this.help = actions.help || "help";
}

function PlayerActions(actions) {
  this.weapons = actions.weapons || "view all available weapons";
  this.stats = actions.stats || "view your stats";
  this.inventory = actions.inventory || "view your inventory";
  this.equip = actions.equip || "equip a weapon";
  this.unequip = actions.unequip || "unequip a weapon";
}

const directionsObj = new Directions({
  n: "north",
  s: "south",
  e: "east",
  w: "west",
});

const roomActionsObj = new RoomActions({
  inspect: "inspect an item",
  take: "take an item",
  look: "Room details",
  help: "help",
});

const playerActionsObj = new PlayerActions({
  weapons: "view all available weapons",
  stats: "view your stats",
  inventory: "view your inventory",
  equip: "equip a weapon",
  unequip: "unequip a weapon",
});

const allAvailableMoves = [directionsObj, roomActionsObj, playerActionsObj];

//TODO: Need to put Look/help fx's in here
// handleQueries(answerArray[0]) {
//   let query = answerArray[0]
  
//   switch (query) {
//     case "help":
//       return console.log(allAvailableMoves);
    
//   }
// }
console.log(allAvailableMoves);

//! END OF LOCATIONS ----------------------------

// ! Start Function

async function start() {
  const startMessage = `\n
  The frosty smell of dew on grass indicated the arrival of morning 
  before you even opened your eyes. A splitting headache sits heavy on your temples as you sit up,
  dust yourself off and try to stand.

  The house you are in is unfamiliar to you, and you don’t know how you got here. \n
  To the north, there is a window and it is boarded shut. \n
  To the east, there is the door that leads out into a hallway.. \n
  Set stats before starting game?`
  let startingAnswer = await ask(startMessage);
  let startingAnswerLowercase = startingAnswer.toLowerCase();
  switch (startingAnswerLowercase) {
    case "yes":
    case "y":
      upgradeStats();
      break;
    case "no":
    case "n":
      nextRoom(currentLocation);
      const playerAnswer = await ask(`\n Which way would you like to go?`)
      moveCommands(playerAnswer);
    }
    nextRoom(currentLocation);
  
  

  // if (playerAnswer === "e") {
  //   let newLocation = locationLookUp[currentLocation].availableMoves[playerAnswer];
  //   nextRoom(newLocation);
  // } else {
  //   console.log(`You can't go that way! Try again.\n`);
  //   sameRoom(currentLocation);
  // }
};


logged = false;


// ! nextRoom function - this takes the newLocation from the Start Fx
//* (handles move to next room)
async function nextRoom(newLocation) {
  
  currentLocation = newLocation;
  
  let room = locationLookUp[currentLocation];
  let roomDescription = room.description;
  
  console.log(`         Your location: ${currentLocation}\n
  ${roomDescription}`);
  
  
  console.log(`ITEMS:`)
  for (let [itemName] of Object.entries(room.availableItems)) {
    console.log("*" + itemName);
  }
  console.log('\n \n')
  let playerAnswer = await ask(`What would you like to do? \n`);
  let answerArray = playerAnswer.split(" ");
  let moves = ["n", "s", "e", "w"];
  let playerQueries = ["stats", "weapons", "inventory"];
  if (moves.includes(answerArray[0])) {
    moveCommands(answerArray[0]);
  } else if (answerArray.length >= 2) {
    roomActions(answerArray);
  } else if (playerQueries.includes(playerAnswer)) {
    playerActions(playerAnswer);
  } else {
    console.log("You can't do that!");
    nextRoom(currentLocation);
  }
}

//! sameRoom fx
// This fx is very similar to nextRoom, but to specifically handle roomActions so that, when one is carried out, the intro information for the room is not repeated.
async function sameRoom(currentLocation) {
  
  let room = locationLookUp[currentLocation];
  
  console.log(`         Your location: ${currentLocation}\n`);
  
  
  console.log(`ITEMS:`)
  for (let [itemName] of Object.entries(room.availableItems)) {
    console.log(`* ${itemName}`);
  }
  console.log(`\n`)
  
  let playerAnswer = await ask(`What would you like to do? \n`);
  let answerArray = playerAnswer.split(" ");
  let moves = ["n", "s", "e", "w"];
  let playerQueries = ["stats", "weapons", "inventory"];
  if (moves.includes(answerArray[0])) {
    moveCommands(answerArray[0]);
  } else if (answerArray.length >= 2) {
    roomActions(answerArray);
  } else if (playerQueries.includes(playerAnswer)) {
    playerActions(playerAnswer);
  } else {
    console.log("You can't do that!");
    nextRoom(currentLocation);
  }
}

// ! Move commands

function handleInvalidMove() {
console.log("\n   You can't do that! Try again... \n");
        sameRoom(currentLocation);
}
async function moveCommands(moveInput) {
  let room = locationLookUp[currentLocation]; // accesses the current location object from the locationLookUp

  switch (moveInput) { //checks user input (moveInput). 
    case "n":
      if (!room.availableMoves[moveInput]) { //if user input is not valid... 
        handleInvalidMove(); //call handleInvalidMove fx...
        return; //and stop moveCommands fx.
      }
      newArea = room.availableMoves[moveInput]; //otherwise, store the target room as the newArea...
      nextRoom(newArea); // and call the nextRoom fx with the newArea passed into it.
      break;
    case "s":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
    case "e":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
    case "w":
      if (!room.availableMoves[moveInput]) {
        handleInvalidMove();
        return;
      }
      newArea = room.availableMoves[moveInput];
      nextRoom(newArea);
      break;
  }
};

// ? TODO: finish roomActions function
async function roomActions(answerArray) {

  let room = locationLookUp[currentLocation];
  let action = answerArray[0]
  let targetArray = answerArray.slice(1)
  let target = targetArray.join(' ');
  let availableItems = room.availableItems;
  let roomDescription = room.description;

      switch (action) {
        case "inspect":
          if (action == "inspect" && availableItems[target]) {
            
            console.log(`You inspect the ${target}. \n
            ${availableItems[target]} \n`);
            sameRoom(currentLocation);
            break;

          }
        case "take":
          if (action == "take" && availableItems[target]) {
            console.log(`\n               You take the ${target}.\n`)
            inventory.push(target);
            delete availableItems[target];
            sameRoom(currentLocation);
            break;
          } else {
            handleInvalidMove();
            break;
          }
        case "look":
          if (action == "look") {
            console.log(roomDescription);
          }
          sameRoom(currentLocation);
          break;
        default:
          console.log(`Can't perform that action "${action}" on "${target}". Try again..`);
          nextRoom(currentLocation);
  }
}

//TODO: create a stats object that holds default player stats
//* these stats will be affected by several functions, e.g. interactions with enemies, controlling entrance access/wield ability (must be a certain level), and will affect damage done by each weapon. certain body stat will unlock escape methods. stealth will give ability to avoid enemies
// Perhaps in future will implement a certain amount of skill points available by default and earned by in-game actions.
//! Player Objects Below------------------------------
function Player(player) {
  this.hp = player.hp || 100;
  this.strength = player.strength || 2;
  this.stealth = player.stealth || 2;
  this.body = player.body || 2;
  this.combat = player.combat || 2;
      this.skillPoints = player.skillPoints || 2
};

const defaultStats = new Player({
  hp: 100,
  strength: 1,
  stealth: 1,
  body: 1,
  combat: 1,
  skillPoints: 12
});

let stats = defaultStats;

function displayStats() {
  return defaultStats;
}

const upgradeStats = async (stats) => {
  console.log("Player Stats: " + defaultStats);
  //!-----Stat Upgrade Functions Below -------
  const stat = await ask(`\n Which stat would you like to upgrade?`);

  const upgradeStrengthStat = async (stat) => {
    if (stat == "strength") {
      let spentSkillPoints = await ask(`\n How many points would you like to add to the Strength category? \n     `);
      let points = Number(spentSkillPoints);

      skillPoints -= points
      strength += points;
      hp += points * 10;
      print(`Strength Points: ${strength}\n
            Skill Points remaining: ${skillPoints}`);
    } else {
      handleInvalidMove();
    }
  }

  const upgradeStealthStat = async (stat) => {
    if (stat == "stealth") {
      let spentSkillPoints = await ask(`\n How many points would you like to add to the Stealth category? \n     `);
      let points = Number(spentSkillPoints);

      skillPoints -= points
      stealth += points;
      hp += points * 10;
      print(`Stealth Points: ${stealth}\n
            Skill Points remaining: ${skillPoints}`);
    } else {
      handleInvalidMove();
    }
  }

  const upgradeBodyStat = async (stat) => {
    if (stat == "body") {
      let spentSkillPoints = await ask(`\n How many points would you like to add to the Body category? \n     `);
      let points = Number(spentSkillPoints);

      skillPoints -= points
      body += points;
      hp += points * 10;
      print(`Body Points: ${body}\n
            Skill Points remaining: ${skillPoints}`);
    } else {
      handleInvalidMove();
    }
  }
      
  const upgradeCombatStat = async (stat) => {
    if (stat == "combat") {
      let spentSkillPoints = await ask(`\n How many points would you like to add to the Combat category? \n     `);
      let points = Number(spentSkillPoints);

      skillPoints -= points
      combat += points;
      hp += points * 10;
      print(`Combat Points: ${combat}\n
            Skill Points remaining: ${skillPoints}`);
    } else {
      handleInvalidMove();
    }
  }


  
    
  if (stat) {
    console.log(`/\n Upgrading: ${stat} \n`)
    switch (stat) {
      case "strength":
        upgradeStrengthStat();
      case "stealth":
        upgradeStealthStat();
    }
  }
};

  async function playerActions(playerAction) {
    let action = playerAction;
    switch (action) {
      case "stats":
        if (action == "stats") {
          console.log(defaultStats);
          sameRoom(currentLocation);
        }
      
      case "weapons":
        if (action == "weapons") {
          //display weapons and mark equipped as [Equipped] and unequipped as [Equip], with option to change 
          console.log("works from weapons");
          sameRoom(currentLocation);
        }
    
      case "inventory":
        if (playerAction == "inventory") {
          //display inventory
          console.log(`\n
          INVENTORY:
          `);
          console.log(inventory)
          console.log(`\n`)
          sameRoom(currentLocation);
        }
    }
  }
