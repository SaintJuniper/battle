export function battle(playerMinions, enemyMinions, checkBestOrdering) {
  var playerCurrentBoard = [];
  var enemyCurrentBoard = [];
  let indexOfPlayerAttacker = 0;
  let indexOfEnemyAttacker = 0;
  let playerTurn = 0;
  let numberOfSimulations = 1000;

  function resetBoards(seed) {
    playerCurrentBoard = [];
    enemyCurrentBoard = [];

    if (seed) {
      for (let i = 0; i < playerMinions.length; i++) {
        playerCurrentBoard[i] = JSON.parse(
          JSON.stringify(playerMinions[seed[i]])
        );
      }
    } else {
      for (let i = 0; i < playerMinions.length; i++) {
        playerCurrentBoard[i] = JSON.parse(JSON.stringify(playerMinions[i]));
      }
    }

    for (let i = 0; i < enemyMinions.length; i++) {
      enemyCurrentBoard[i] = JSON.parse(JSON.stringify(enemyMinions[i]));
    }
  }

  function printBoards() {
    console.log(`Player Board:`);
    for (let i = 0; i < playerCurrentBoard.length; i++) {
      console.log(playerCurrentBoard[i]);
    }
    console.log(`Enemy Board:`);
    for (let i = 0; i < enemyCurrentBoard.length; i++) {
      console.log(enemyCurrentBoard[i]);
    }
    console.log(`------`);
  }

  function runCombat() {
    playerTurn = Math.random() >= 0.5;
    while (bothAlive()) {
      if (playerTurn) {
        attack(playerCurrentBoard, enemyCurrentBoard, indexOfPlayerAttacker);
        incrementIndexOfPlayerAttacker();
      } else {
        attack(enemyCurrentBoard, playerCurrentBoard, indexOfEnemyAttacker);
        incrementIndexOfEnemyAttacker();
      }

      playerTurn = !playerTurn;
    }
  }

  function checkPlayerWin() {
    return playerCurrentBoard.length > 0 && enemyCurrentBoard.length == 0;
  }

  function checkPlayerLoss() {
    return playerCurrentBoard.length == 0 && enemyCurrentBoard.length > 0;
  }

  function checkDraw() {
    return playerCurrentBoard.length == 0 && enemyCurrentBoard.length == 0;
  }

  function incrementIndexOfPlayerAttacker() {
    if (playerCurrentBoard.length == 0) {
      return;
    }
    indexOfPlayerAttacker =
      (indexOfPlayerAttacker + 1) % playerCurrentBoard.length;
  }

  function incrementIndexOfEnemyAttacker() {
    if (enemyCurrentBoard.length == 0) {
      return;
    }
    indexOfEnemyAttacker =
      (indexOfEnemyAttacker + 1) % enemyCurrentBoard.length;
  }

  function normaliseIndices() {
    if (indexOfPlayerAttacker >= playerCurrentBoard.length) {
      indexOfPlayerAttacker = 0;
    }
    if (indexOfEnemyAttacker >= enemyCurrentBoard.length) {
      indexOfEnemyAttacker = 0;
    }
  }

  function getTauntMinions(board) {
    return board
      .filter((minion) =>
        minion.effects.some((attribute) => attribute.item_text == "Taunt")
      )
      .map((x) => board.indexOf(x));
  }

  function isMinionPoisonous(minion) {
    return minion.effects.some(
      (attribute) => attribute.item_text == "Poisonous"
    );
  }

  function isMinionDivineShield(minion) {
    return minion.effects.some(
      (attribute) => attribute.item_text == "Divine Shield"
    );
  }

  function attack(attackerBoard, defenderBoard, indexOfAttacker) {
    var indicesOfDefenderTauntMinions = getTauntMinions(defenderBoard);

    var indexOfDefender = Math.floor(Math.random() * defenderBoard.length);

    if (indicesOfDefenderTauntMinions.length > 0) {
      indexOfDefender =
        indicesOfDefenderTauntMinions[
          Math.floor(Math.random() * indicesOfDefenderTauntMinions.length)
        ];
    }

    var attackerAttack = attackerBoard[indexOfAttacker].attack;
    var attackerHealth = attackerBoard[indexOfAttacker].health;

    var defenderAttack = defenderBoard[indexOfDefender].attack;
    var defenderHealth = defenderBoard[indexOfDefender].health;

    if (isMinionPoisonous(attackerBoard[indexOfAttacker])) {
      attackerAttack = Number.POSITIVE_INFINITY;
    }

    if (isMinionPoisonous(defenderBoard[indexOfDefender])) {
      defenderAttack = Number.POSITIVE_INFINITY;
    }

    let divineShieldAttackerFlag = false;
    let divineShieldDefenderFlag = false;

    if (isMinionDivineShield(attackerBoard[indexOfAttacker])) {
      attackerBoard[indexOfAttacker].effects = attackerBoard[
        indexOfAttacker
      ].effects.filter((effect) => effect.item_text !== "Divine Shield");
      divineShieldAttackerFlag = true;
    }

    if (isMinionDivineShield(defenderBoard[indexOfDefender])) {
      defenderBoard[indexOfDefender].effects = defenderBoard[
        indexOfDefender
      ].effects.filter((effect) => effect.item_text !== "Divine Shield");
      divineShieldDefenderFlag = true;
    }

    if (!divineShieldDefenderFlag) {
      inflictDamage(defenderBoard, indexOfDefender, attackerAttack);
    }

    if (!divineShieldAttackerFlag) {
      inflictDamage(attackerBoard, indexOfAttacker, defenderAttack);
    }
  }

  function inflictDamage(recipientBoard, recipientIndex, damage) {
    if (damage >= recipientBoard[recipientIndex].health) {
      kill(recipientBoard, recipientIndex);
      return;
    }

    recipientBoard[recipientIndex].health -= damage;
  }

  function kill(recipientBoard, recipientIndex) {
    recipientBoard.splice(recipientIndex, 1);
    normaliseIndices();
  }

  function bothAlive() {
    return playerCurrentBoard.length > 0 && enemyCurrentBoard.length > 0;
  }

  function asPercentage(tally) {
    return ((100 * tally) / numberOfSimulations).toFixed(2);
  }

  function simulateCombats(orderingSeed) {
    var winTally = 0;
    var lossTally = 0;
    var drawTally = 0;

    for (let i = 0; i < numberOfSimulations; i++) {
      resetBoards(orderingSeed);
      runCombat();

      if (checkDraw()) {
        drawTally++;
        continue;
      }

      if (checkPlayerWin()) {
        winTally++;
        continue;
      }

      lossTally++;
    }

    var value = (winTally - lossTally) / numberOfSimulations;
    let winPercentage = asPercentage(winTally);
    let lossPercentage = asPercentage(lossTally);
    let drawPercentage = asPercentage(drawTally);

    return [value, winPercentage, lossPercentage, drawPercentage];
  }

  function generateAllPossibleOrderings(n) {
    let combsArr = [];
    let arrStart = [];
    for (let i = 0; i < n; i++) {
      arrStart[i] = i;
    }
    function combs(arr, build) {
      if (arr.length > 0) {
        for (let i = 0; i < arr.length; i++) {
          let ele = arr[i];
          let newArr = arr.filter((j) => j !== arr[i]);
          combs(newArr, build.concat(ele));
        }
      } else {
        combsArr.push(build);
      }
    }
    combs(arrStart, []);
    return combsArr;
  }

  function calculateBestBoardOrdering() {
    let orderings = generateAllPossibleOrderings(playerMinions.length);

    let highestValue = -1;
    let bestOrdering = [];
    let bestOrderingValue = [];
    let bestResult = [];

    for (let i = 0; i < orderings.length; i++) {
      let currentOrdering = orderings[i];
      let results = simulateCombats(currentOrdering);
      if (results[0] > highestValue) {
        bestOrdering = currentOrdering;
        bestOrderingValue = results[0];
        bestResult = results;
      }
    }

    // Name combination Best Array
    let bestNameArray = [];

    for (let i = 0; i < bestOrdering.length; i++) {
      bestNameArray.push(playerMinions[bestOrdering[i]].name);
    }

    return [bestResult, bestNameArray];
  }

  return checkBestOrdering ? calculateBestBoardOrdering() : simulateCombats();
}

// Test data

// let playerA = [
//   { attack: 1, health: 1 },
//   { attack: 2, health: 2 },
//   { attack: 3, health: 3 },
// ];
// let playerB = [
//   { attack: 3, health: 3 },
//   { attack: 2, health: 2 },
//   { attack: 1, health: 1 },
// ];

// battle(playerA, playerB, false);
