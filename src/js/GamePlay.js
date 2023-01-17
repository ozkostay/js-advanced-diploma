import { calcHealthLevel, calcTileType } from './utils';
import cursors from './cursors';

export default class GamePlay {
  constructor() {
    this.boardSize = 8;
    this.container = null;
    this.boardEl = null;
    this.cells = [];
    this.cellClickListeners = [];
    this.cellEnterListeners = [];
    this.cellLeaveListeners = [];
    this.newGameListeners = [];
    this.saveGameListeners = [];
    this.loadGameListeners = [];
    this.whoIsNow = { whoNow: 'start', indexCell: null, character: null};
  }

  bindToDOM(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.container = container;
  }

  /**
   * Draws boardEl with specific theme
   *
   * @param theme
   */
  drawUi(theme) {
    this.checkBinding();

    this.container.innerHTML = `
      <div class="controls">
        <button data-id="action-restart" class="btn">New Game</button>
        <button data-id="action-save" class="btn">Save Game</button>
        <button data-id="action-load" class="btn">Load Game</button>
      </div>
      <div class="board-container">
        <div data-id="board" class="board"></div>
      </div>
    `;

    this.newGameEl = this.container.querySelector('[data-id=action-restart]');
    this.saveGameEl = this.container.querySelector('[data-id=action-save]');
    this.loadGameEl = this.container.querySelector('[data-id=action-load]');

    this.newGameEl.addEventListener('click', event => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', event => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', event => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', event => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', event => this.onCellLeave(event));
      cellEl.addEventListener('click', event => this.onCellClick(event));
      this.boardEl.appendChild(cellEl);
    }

    this.cells = Array.from(this.boardEl.children);
  }

  /**
   * Draws positions (with chars) on boardEl
   *
   * @param positions array of PositionedCharacter objects
   */
  redrawPositions(positions) {
    // console.log('---------------- ',this.cells);
    for (const cell of this.cells) {
      cell.innerHTML = '';
    }

    for (const position of positions) {
      const cellEl = this.boardEl.children[position.position];
      const charEl = document.createElement('div');
      charEl.classList.add('character', position.character.type);

      const healthEl = document.createElement('div');
      healthEl.classList.add('health-level');

      const healthIndicatorEl = document.createElement('div');
      healthIndicatorEl.classList.add('health-level-indicator', `health-level-indicator-${calcHealthLevel(position.character.health)}`);
      healthIndicatorEl.style.width = `${position.character.health}%`;
      healthEl.appendChild(healthIndicatorEl);

      charEl.appendChild(healthEl);
      cellEl.appendChild(charEl);
    }
  }

  /**
   * Add listener to mouse enter for cell
   *
   * @param callback
   */
  addCellEnterListener(callback) {
    this.cellEnterListeners.push(callback);
  }

  /**
   * Add listener to mouse leave for cell
   *
   * @param callback
   */
  addCellLeaveListener(callback) {
    this.cellLeaveListeners.push(callback);
  }

  /**
   * Add listener to mouse click for cell
   *
   * @param callback
   */
  addCellClickListener(callback) {
    this.cellClickListeners.push(callback);
  }

  /**
   * Add listener to "New Game" button click
   *
   * @param callback
   */
  addNewGameListener(callback) {
    this.newGameListeners.push(callback);
  }

  /**
   * Add listener to "Save Game" button click
   *
   * @param callback
   */
  addSaveGameListener(callback) {
    this.saveGameListeners.push(callback);
  }

  /**
   * Add listener to "Load Game" button click
   *
   * @param callback
   */
  addLoadGameListener(callback) {
    this.loadGameListeners.push(callback);
  }

  onCellEnter(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    const playerClasses = ['bowman', 'swordsman', 'magician'];
    // this.setCursor(cursors.auto); 
    this.setCursor(cursors.pointer);
    // if (whoIsNow.whoNow === 'start') {

    // }
    this.cellEnterListeners.forEach((item) => {
      if (item.position === index) {
        this.showCellTooltip(this.makeTitle(item.character), index);
        // return ;
        // this.setCursor(cursors.pointer);
        const arrClasses = event.target.firstChild.className.split(' ');;
        // console.log('event.target.className', event.target.firstChild);
        const ownerNewCell = this.arrCross( playerClasses, arrClasses) ? 'player' : 'enemy';
        if (ownerNewCell !== 'player') {
          this.setCursor(cursors.crosshair);
        }
      }
    });
    // console.log('===== Enter', index, this.cellEnterListeners);
    


  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    this.cellLeaveListeners.forEach(o => o.call(null, index));
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    const playerClasses = ['bowman', 'swordsman', 'magician'];
    let ownerNewCell = 'nobody'; // здесь владелец новой ячейки
    let character = 'start';
    // узнаем владельца новой ячейки
    if (event.target.classList.contains('character')) {
      const arrClasses = event.target.className.split(' ');
      character = this.arrCross( playerClasses, arrClasses);
      ownerNewCell = character ? 'player' : 'enemy';
    }
    
    console.log(ownerNewCell);

    switch(ownerNewCell) {
      case 'player':  // if (x === 'value1')
        if (this.whoIsNow.whoNow === 'player') {
          this.cells[this.whoIsNow.indexCell].classList.remove('selected', 'selected-yellow');
        }
        this.selectCell(index, 'yellow');
        this.whoIsNow.whoNow = 'player';
        this.whoIsNow.indexCell = index;
        this.whoIsNow.character = character;
        break;
      case 'enemy':  // if (x === 'value2')
        if (this.whoIsNow.whoNow === 'start') {
          this.showError("Для начала выберете своего героя!");
        }
        break;
    
      default:
        if (this.whoIsNow.whoNow === 'start') {
          this.showError("Для начала выберете своего героя!");
        }
        break
    }
    

    // console.log('33333', this.whoIsNow);
    this.sellsDetect();

    // if (ownerNewCell === 'player') {
    //   this.cells.forEach((item) => {
    //     if (item.classList.contains('selected-yellow')) {
    //       item.classList.remove('selected', 'selected-yellow');
    //     }
    //   });
    //   this.selectCell(index, 'yellow');
    // } else {
      
    // }
    
    // console.log('this.cellClickListeners',this.cellClickListeners);
    // this.cellClickListeners.forEach(o => o.call(null, index));
    // console.log('this.cellClickListeners',this.cellClickListeners);
  }

  

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach(o => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach(o => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach(o => o.call(null));
  }

  showError(message) {
    alert(message);
  }

  static showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter(o => o.startsWith('selected')));
  }

  showCellTooltip(message, index) {
    this.cells[index].title = message;
  }

  hideCellTooltip(index) {
    this.cells[index].title = '';
  }

  showDamage(index, damage) {
    return new Promise((resolve) => {
      const cell = this.cells[index];
      const damageEl = document.createElement('span');
      damageEl.textContent = damage;
      damageEl.classList.add('damage');
      cell.appendChild(damageEl);

      damageEl.addEventListener('animationend', () => {
        cell.removeChild(damageEl);
        resolve();
      });
    });
  }

  setCursor(cursor) {
    this.boardEl.style.cursor = cursor;
  }

  checkBinding() {
    if (this.container === null) {
      throw new Error('GamePlay not bind to DOM');
    }
  }

  makeTitle(c) {
    return `🎖️ ${c.level} ⚔️ ${c.attack} 🛡️ ${c.defence} ❤️ ${c.health}`;
  }

  arrCross( where, what){
    let across = null ;

    console.log('2223== ',where, what);
    for(let i = 0; i < what.length; i += 1){
      // console.log('wwwwwwwwww ', where.indexOf(what[i]));
      if (where.indexOf(what[i]) > -1) across = what[i];
      if (across) break;
      //console.log('www', i, what[i]);
    }
    return across;
  }

  sellsDetect() {
    console.log('sellsDetect', this.whoIsNow);
    console.log('колонка', this.whoIsNow.indexCell % this.boardSize);
    const kolonka = this.whoIsNow.indexCell % this.boardSize;
    console.log('ряд', Math.floor(this.whoIsNow.indexCell / this.boardSize));
    let step = null;
    switch(this.whoIsNow.character) {
      case 'bowman':  // if (x === 'value1')
      step = 2;
        break;
      case 'swordsman':  // if (x === 'value2')
      step = 4;
        break;
    
      default:
        // magician
        step = 1;
        break
    }
    // Мечники/Скелеты - 4 клетки в любом направлении
    // Лучники/Вампиры - 2 клетки в любом направлении
    // Маги/Демоны - 1 клетка в любом направлении
    const indexCell = this.whoIsNow.indexCell;
    for ( let i =  -5; i < (step + 1); i += 1) {
      console.log('indexCell', indexCell + i, ((indexCell + i) % this.boardSize) - this.whoIsNow.indexCell % this.boardSize);  
      
    }
    // console.log('indexCell', indexCell-);
    // let matrix = [];
    

  }
}
