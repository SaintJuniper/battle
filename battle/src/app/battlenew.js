function battle(playerMinions, enemyMinions, checkBestOrdering) {
  // player - array of minions
  // opponent - array of minions
  // flag - TRUE = permutation simulations, FALSE = single simulation

  var playerCurrentBoard = [];
  var enemyCurrentBoard = [];
  let indexOfPlayerAttacker = 0;
  let indexOfEnemyAttacker = 0;
  let playerTurn = 0;
  let numberOfSimulations = 1000;

  function resetBoards() {
    playerCurrentBoard = [];
    enemyCurrentBoard = [];

    for (let i = 0; i < playerMinions.length; i++) {
      playerCurrentBoard[i] = JSON.parse(JSON.stringify(playerMinions[i]));
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
    resetBoards();
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

  function attack(attackerBoard, defenderBoard, indexOfAttacker) {
    var indexOfDefender = Math.floor(Math.random() * defenderBoard.length);

    var attackerAttack = attackerBoard[indexOfAttacker].attack;
    var attackerHealth = attackerBoard[indexOfAttacker].health;

    var defenderAttack = defenderBoard[indexOfDefender].attack;
    var defenderHealth = defenderBoard[indexOfDefender].health;

    inflictDamage(defenderBoard, indexOfDefender, attackerAttack);
    inflictDamage(attackerBoard, indexOfAttacker, defenderAttack);
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

  function simulateCombats() {
    var winTally = 0;
    var lossTally = 0;
    var drawTally = 0;

    for (let i = 0; i < numberOfSimulations; i++) {
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

  console.log(simulateCombats());
  //   runCombat();
}

// Test data

let playerA = [
  { attack: 1, health: 1 },
  { attack: 2, health: 2 },
  { attack: 3, health: 3 },
];
let playerB = [
  { attack: 3, health: 3 },
  { attack: 2, health: 2 },
  { attack: 1, health: 1 },
];

battle(playerA, playerB, false);

// todo: simulations, permutations, permutations simulations
