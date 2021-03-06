import { Component, OnInit } from '@angular/core';
import { battleTime } from './battle';
import { battle } from './battleCalculations'
import { IDropdownSettings } from 'ng-multiselect-dropdown';

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

  dropdownList = [];
  dropdownSettings:IDropdownSettings = {};
  listOfEffects = [
    { item_id: 1, item_text: 'Divine Shield' },
    { item_id: 2, item_text: 'Poisonous' },
    { item_id: 3, item_text: 'Reborn' },
    { item_id: 4, item_text: 'Taunt' },
    { item_id: 5, item_text: 'Windfury' }
  ];

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      allowSearchFilter: false,
      enableCheckAll: false
    };
    this.dropdownList = this.listOfEffects;
  }

  onItemSelect(item: any) {
    console.log(item);
  }

  onSelectAll(items: any) {
    console.log(items);
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

    this.player.push(
      { name: name,
        attack: 1, 
        health: 1,
        effects: []
      })
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

    this.opponent.push(      
    { attack: 1, 
      health: 1,
      effects: []
    })
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
    this.results = battle(this.player, this.opponent, 0);
    console.log(this.results);
  }

  calculateBestArrangement(){
    this.bestArrangements = battle(this.player, this.opponent, 1);
    console.log(`bestArrangement: ${this.bestArrangements}`)
  }

  resetCalc() {
    this.results = [];
    this.bestArrangements = []
  }
}
