function battle(playerMinions, enemyMinions, checkBestOrdering) {
  // player - array of minions
  // opponent - array of minions
  // flag - TRUE = permutation simulations, FALSE = single simulation

  var playerCurrentBoard = [];
  var enemyCurrentBoard = [];
  let indexOfPlayerAttacker = 0;
  let indexOfEnemyAttacker = 0;
  let playerTurn = 0;

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
      printBoards();
      if (playerTurn) {
        attack(playerCurrentBoard, enemyCurrentBoard, indexOfPlayerAttacker);
        incrementIndexOfPlayerAttacker();
      } else {
        attack(enemyCurrentBoard, playerCurrentBoard, indexOfEnemyAttacker);
        incrementIndexOfEnemyAttacker();
      }

      playerTurn = !playerTurn;
    }

    // todo: check who wins and return it or a code of who wins
    console.log(`combat finished`);
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

    console.log(`AttackerBoard: ${attackerBoard}`);
    console.log(`indexOfAttacker:  ${indexOfAttacker}`);
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
  runCombat();
}

// Test data

let playerA = [
  { attack: 1, health: 14 },
  { attack: 2, health: 14 },
  { attack: 1, health: 14 },
];
let playerB = [
  { attack: 1, health: 14 },
  { attack: 2, health: 9 },
  { attack: 1, health: 8 },
];

battle(playerA, playerB, false);

// todo: simulations, permutations, permutations simulations
