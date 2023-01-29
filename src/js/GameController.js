import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
  }

  init() {
    
    this.gamePlay.newGameInit();

    // const level = this.gamePlay.gameLevel;
    // console.log('themes[this.gamePlay.gameLevel]', themes[level]);
    // this.gamePlay.drawUi(Object.values(themes)[level]);

    // // Заполняем ячейки для игрока
    // const playerTypes = ['Bowman', 'Swordsman', 'Magician']; // доступные классы игрока
    // const team = generateTeam(playerTypes, level, level + 1);
    // const boardSize = this.gamePlay.boardSize;
    // const boardMy = [];
    // for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
    //   boardMy.push(i * boardSize);
    //   boardMy.push(i * boardSize + 1);
    // }
    // const arrPositionCharacter = [];
    // team.characters.forEach((item) => {
    //   const arrBoardLength = boardMy.length;
    //   const randomIndex = Math.floor(Math.random() * arrBoardLength);
    //   const position = boardMy[randomIndex];
    //   const positionedCharacter = new PositionedCharacter(item, position);
    //   arrPositionCharacter.push(positionedCharacter);
    //   this.gamePlay.playerNow.selsToMove.push(positionedCharacter.position);
    //   boardMy.splice(randomIndex, 1);
    // });
    // // Заполняем ячейки для Противника
    // const playerTypes2 = ['Daemon', 'Undead', 'Vampire']; // доступные классы врага
    // const team2 = generateTeam(playerTypes, level, level + 1);
    // const boardEnemy = [];
    // for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
    //   boardEnemy.push(i * boardSize + 6);
    //   boardEnemy.push(i * boardSize + 7);
    // }
    // team2.characters.forEach((item) => {
    //   const arrBoardLength = boardEnemy.length;
    //   const randomIndex = Math.floor(Math.random() * arrBoardLength);
    //   const position = boardEnemy[randomIndex];
    //   const positionedCharacter = new PositionedCharacter(item, position);
    //   arrPositionCharacter.push(positionedCharacter);
    //   boardEnemy.splice(randomIndex, 1);
    // });
    // this.gamePlay.cellEnterListeners = [...arrPositionCharacter];
    // this.gamePlay.redrawPositions(this.gamePlay.cellEnterListeners);
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

  delit() {
    console.log('==================================== delit ================================');
  }
}
