// --------------------------------------------------------------- //
export function battleTime(player, opponent) {
  // Global boards
  var boardA = [];
  var boardB = [];

  // My cards
  let myCards = player;

  // This is the order of the enemy cards
  let enemyCardsOrdered = opponent;

  // --------------------------------------------------------------- //

  // Rests the board normally using the default ordering
  function resetBoard() {
    boardA = [];
    boardB = [];

    // Your board
    for (let i = 0; i < myCards.length; i++) {
      addToBoard(boardA, i, { attack: myCards[i].attack, health: myCards[i].health });
    }

    // Enemy board
    for (let i = 0; i < enemyCardsOrdered.length; i++) {
      addToBoard(boardB, i, {
        attack: enemyCardsOrdered[i].attack,
        health: enemyCardsOrdered[i].health,
      });
    }
  }

  // Resets the board according to an ordering seed
  function resetBoardWithSeed(seed) {
    boardA = [];
    boardB = [];

    // Your board uses an order seed like [0,1,2] or [0,2,1] to determine positioning
    // Have to copy from global cards variable
    for (let i = 0; i < myCards.length; i++) {
      addToBoard(boardA, i, {
        attack: myCards[seed[i]].attack,
        health: myCards[seed[i]].health,
      });
    }

    // Enemy board
    // for (let i = 0; i < enemyCardsOrdered.length; i++) {
    //   addToBoard(boardB, i, JSON.parse(JSON.stringify(enemyCardsOrdered[i])));
    // }
    // Enemy board
    for (let i = 0; i < enemyCardsOrdered.length; i++) {
      addToBoard(boardB, i, {
        attack: enemyCardsOrdered[i].attack,
        health: enemyCardsOrdered[i].health,
      });
    }
  }

  function removeFromBoard(board, i) {
    board.splice(i, 1);
  }

  function addToBoard(board, i, card) {
    if (board[i] == undefined) {
      board[i] = card;
    } else {
      board.splice(i, 0, card);
    }
  }

  function checkWin() {
    if (boardA.length == 0 && boardB.length == 0) {
      return -1;
    }

    if (boardA.length == 0) {
      return 0;
    }

    if (boardB.length == 0) {
      return 1;
    }

    return 2;
  }

  function fight(attackerBoard, defenderBoard, attackerIndex, defenderIndex) {
    //   console.log(
    //     `attackerIndex : ${attackerIndex} and defenderIndex : ${defenderIndex}`
    //   );

    var attackerAtk = attackerBoard[attackerIndex].attack;
    var defenderAtk = defenderBoard[defenderIndex].attack;

    var attackerHp = attackerBoard[attackerIndex].health;
    var defenderHp = defenderBoard[defenderIndex].health;

    if (attackerAtk >= defenderHp) {
      removeFromBoard(defenderBoard, defenderIndex);
    } else {
      defenderBoard[defenderIndex].health -= attackerAtk;
    }

    if (defenderAtk >= attackerHp) {
      removeFromBoard(attackerBoard, attackerIndex);
    } else {
      attackerBoard[attackerIndex].health -= defenderAtk;
    }
  }

  function resolve(n) {
    if (n == -1) {
      console.log(`Draw`);
    }

    if (n == 0) {
      console.log(`Lose`);
    }

    if (n == 1) {
      console.log(`Win`);
    }
  }

  function printBoards() {
    console.log(`BoardA:`);
    for (let i = 0; i < boardA.length; i++) {
      console.log(boardA[i]);
    }
    console.log(`BoardB:`);
    for (let i = 0; i < boardB.length; i++) {
      console.log(boardB[i]);
    }
    console.log(`------`);
  }

  function startCombat() {
    let turn = Math.random() >= 0.5;
    let initA = 0;
    let initB = 0;

    while (checkWin() > 1) {
      // printBoards();

      if (turn == true) {
        var enemyTargetIndex = Math.floor(Math.random() * boardB.length);
        fight(boardA, boardB, initA, enemyTargetIndex);
        initA = (initA + 1) % boardA.length;
      } else {
        var enemyTargetIndex = Math.floor(Math.random() * boardA.length);
        fight(boardB, boardA, initB, enemyTargetIndex);
        initB = (initB + 1) % boardB.length;
      }
    }

    return checkWin();
    // printBoards();
    // resolve(checkWin());
  }

  function simulateCombats() {
    let nSims = 10;
    let winTally = 0;
    let loseTally = 0;
    let drawTally = 0;

    for (let i = 0; i < nSims; i++) {
      resetBoard();
      let result = startCombat();

      if (result == -1) {
        drawTally++;
      }

      if (result == 0) {
        loseTally++;
      }

      if (result == 1) {
        winTally++;
      }
    }

    let EV = (winTally / nSims + 0.5 * (drawTally / nSims)).toFixed(3);
    let winPercent = ((100 * winTally) / nSims).toFixed(3);
    let lossPercent = ((100 * loseTally) / nSims).toFixed(3);
    let drawPercent = ((100 * drawTally) / nSims).toFixed(3);

    console.log(`Current order of minions: `);
    console.log(`Value: ${EV}`);
    console.log(
      `Win: ${winPercent}%, Loss: ${lossPercent}%, Draw: ${drawPercent}%`
    );
    console.log(`-----`);
    return [EV, winPercent, lossPercent, drawPercent];
  }

  function simulateCombatsWithSeed(seed) {
    let nSims = 10000;
    let winTally = 0;
    let loseTally = 0;
    let drawTally = 0;

    for (let i = 0; i < nSims; i++) {
      resetBoardWithSeed(seed);
      let result = startCombat();

      if (result == -1) {
        drawTally++;
      }

      if (result == 0) {
        loseTally++;
      }

      if (result == 1) {
        winTally++;
      }
    }

    let EV = (winTally / nSims + 0.5 * (drawTally / nSims)).toFixed(3);
    let winPercent = ((100 * winTally) / nSims).toFixed(3);
    let lossPercent = ((100 * loseTally) / nSims).toFixed(3);
    let drawPercent = ((100 * drawTally) / nSims).toFixed(3);
    return [EV, winPercent, lossPercent, drawPercent];
  }

  // Generates all combinations for n numbers
  // n = 3 will produce [0,1,2], [1,0,2], [1,2,0]... etc
  function generateCombs(n) {
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

  function permutationSimulations() {
    let combinations = generateCombs(myCards.length);

    let valHighest = -1;
    let highestCombination = [];
    let bestResult = [];

    for (let i = 0; i < combinations.length; i++) {
     var boardSig = combinations[i];
      // return format : [EV, winPercent, lossPercent, drawPercent]
      let result = simulateCombatsWithSeed(boardSig);

      // -- SHOW THE FOLLOWING IF YOU WANT TO SEE WIN % OF ALL COMBINATIONS -- //
      // console.log(`${boardSig} : VALUE: ${result[0]}, WIN: ${result[1]}%`);

      if (result[0] > valHighest) {
        valHighest = result[0];
        bestResult = result;
        highestCombination = combinations[i];
      }
    }

    // Name combination Best Array
    let bestNameArray = [];

    for (let i = 0; i < highestCombination.length; i++) {
      bestNameArray.push(myCards[highestCombination[i]].name);
    }

    console.log(`Best possible positions of your minions: `);

    // console.log(`[${highestCombination}] with a value of ${valHighest}`);
    console.log(`[${bestNameArray}] with a value of ${valHighest}`);

    console.log(
      `Win: ${bestResult[1]}%, Loss: ${bestResult[2]}%, Draw: ${bestResult[3]}%`
    );

    return bestResult;
  }

  // return permutationSimulations();
  return simulateCombats();
  // permutationSimulations();
}


