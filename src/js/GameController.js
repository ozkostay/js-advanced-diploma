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
    const board = [];
    for (let i = 0; i < this.gamePlay.boardSize; i += 1) {
      board.push(i * boardSize);
      board.push(i * boardSize + 1);
    }
    const arrPositionCharacter = [];
    team.characters.forEach((item) => {
      const arrBoardLength = board.length;
      const randomIndex = Math.floor(Math.random() * arrBoardLength);
      const position = board[randomIndex];
      const positionedCharacter = new PositionedCharacter(item, position);
      arrPositionCharacter.push(positionedCharacter);
      board.splice(randomIndex, 1);
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
    this.gamePlay.redrawPositions(arrPositionCharacter);

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
