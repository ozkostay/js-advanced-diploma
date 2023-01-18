import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    this.gamePlay.drawUi('prairie');

    // Размещаем игроков на поле
    const playerTypes = ['Bowman', 'Swordsman', 'Magician']; // доступные классы игрока
    const team = generateTeam(playerTypes, 3, 4);
    const boardSize = this.gamePlay.boardSize;
    // Заполняем ячейки для игрока
    const boardMy = [];
    for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
      boardMy.push(i * boardSize);
      boardMy.push(i * boardSize + 1);
    }
    const arrPositionCharacter = [];
    team.characters.forEach((item) => {
      const arrBoardLength = boardMy.length;
      const randomIndex = Math.floor(Math.random() * arrBoardLength);
      const position = boardMy[randomIndex];
      const positionedCharacter = new PositionedCharacter(item, position);
      arrPositionCharacter.push(positionedCharacter);
      this.gamePlay.whoIsNow.trueSells.push(positionedCharacter.position);
      boardMy.splice(randomIndex, 1);
    });
    // Заполняем ячейки для Противника
    const playerTypes2 = ['Daemon', 'Undead', 'Vampire']; // доступные классы игрока
    const team2 = generateTeam(playerTypes2, 3, 4);
    const boardEnemy = [];
    for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
      boardEnemy.push(i * boardSize + 6);
      boardEnemy.push(i * boardSize + 7);
    }
    // const arrPositionCharacterEnemy = [];
    team2.characters.forEach((item) => {
      const arrBoardLength = boardEnemy.length;
      const randomIndex = Math.floor(Math.random() * arrBoardLength);
      const position = boardEnemy[randomIndex];
      const positionedCharacter = new PositionedCharacter(item, position);
      arrPositionCharacter.push(positionedCharacter);
      boardEnemy.splice(randomIndex, 1);
    });
  
    // TODO: add event listeners to gamePlay events
    // this.gamePlay.addCellEnterListener(this.onCellEnter);
    
    this.gamePlay.cellEnterListeners = [...arrPositionCharacter];
    // this.gamePlay.redrawPositions(arrPositionCharacter);
    this.gamePlay.redrawPositions(this.gamePlay.cellEnterListeners);
   
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    console.log('GC onCellEnter ', index);
    // this.gamePlay.addCellEnterListener(callback);
    // console.log('callback index', index);
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
