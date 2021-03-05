import { Component, OnInit } from '@angular/core';
import { battleTime } from './battle';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'battle';

  player = [];
  opponent = [];
  results = [];
  bestArrangements = [];

  ngOnInit() {

  }

  generateName(){
    let randomNames = ["A", "B", "C", "X", "Y", "Z", "T"]
    let i = Math.floor(Math.random() * randomNames.length);
    let pickedName = randomNames[i]

    function containedInNames(player, name){
      let contained = false; 
      for (let i = 0; i < player.length; i++){
        if (player[i].name == name){
          contained = true 
        }
      }
      return contained
    }

    while (containedInNames(this.player, pickedName)){
      i = Math.floor(Math.random() * randomNames.length);
      pickedName = randomNames[i]
    }

    return pickedName
  }

  addPlayer() {
    if(this.isPlayerMax())
      return;

    let name = this.generateName()

    this.player.push({name: name,attack: 1, health: 1})
    console.log(this.player);
    this.resetCalc();
  }

  removePlayer() {
    this.player.pop();
    console.log(this.player);
    this.resetCalc();
  }

  removePlayerAtIndex(i) {
    this.player.splice(i, 1);
    console.log(this.player);
    this.resetCalc();
  }

  addOpponent() {
    if(this.isOpponentMax())
      return;

    this.opponent.push({attack: 1, health: 1})
    console.log(this.opponent);
    this.resetCalc();
  }

  isPlayerMax() {
    return this.player.length === 7;
  }

  isOpponentMax() {
    return this.opponent.length === 7;
  }

  isCurrentPlayerMax(index) {
    return this.player.length == index + 1;
  }

  isCurrentOpponentMax(index) {
    return this.opponent.length == index + 1;
  }

  removeOpponent() {
    this.opponent.pop();
    console.log(this.opponent);
    this.resetCalc();
  }

  removeOpponentAtIndex(i) {
    this.opponent.splice(i, 1);
    console.log(this.opponent);
    this.resetCalc();
  }

  moveLeftOpponent(index) {
    var temp = this.opponent[index - 1];
    this.opponent[index - 1] = this.opponent[index];
    this.opponent[index] = temp;
  }

  moveRightOpponent(index) {
    var temp = this.opponent[index + 1];
    this.opponent[index + 1] = this.opponent[index];
    this.opponent[index] = temp;
  }

  moveLeftPlayer(index) {
    var temp = this.player[index - 1];
    this.player[index - 1] = this.player[index];
    this.player[index] = temp;
  }

  moveRightPlayer(index) {
    var temp = this.player[index + 1];
    this.player[index + 1] = this.player[index];
    this.player[index] = temp;
  }

  calculate() {
    this.results = battleTime(this.player, this.opponent, 0);
    console.log(this.results);
  }

  calculateBestArrangement(){
    this.bestArrangements = battleTime(this.player, this.opponent, 1);
  }

  resetCalc() {
    this.results = [];
    this.bestArrangements = []
  }
}
