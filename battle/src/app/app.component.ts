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

  ngOnInit() {

  }

  addPlayer() {
    if(this.isPlayerMax())
      return;

    this.player.push({attack: 1, health: 1})
    console.log(this.player);
    this.resetCalc();
  }

  removePlayer() {
    this.player.pop();
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
    this.results = battleTime(this.player, this.opponent);
    console.log(this.results);
  }

  resetCalc() {
    this.results = [];
  }
}
