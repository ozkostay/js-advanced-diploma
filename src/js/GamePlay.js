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
    this.playerNow = {
      whoNow: 'start',
      indexCell: null,
      character: null,
      selsToMove: [],
      selsToAttack: [],
    };
    this.enemyNow = {
      indexCell: null,
      character: null,
      selsToMove: [],
      selsToAttack: [],
    };
    // this.whoseTurn = 'player';
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

    this.newGameEl.addEventListener('click', (event) => this.onNewGameClick(event));
    this.saveGameEl.addEventListener('click', (event) => this.onSaveGameClick(event));
    this.loadGameEl.addEventListener('click', (event) => this.onLoadGameClick(event));

    this.boardEl = this.container.querySelector('[data-id=board]');

    this.boardEl.classList.add(theme);
    for (let i = 0; i < this.boardSize ** 2; i += 1) {
      const cellEl = document.createElement('div');
      cellEl.classList.add('cell', 'map-tile', `map-tile-${calcTileType(i, this.boardSize)}`);
      cellEl.addEventListener('mouseenter', (event) => this.onCellEnter(event));
      cellEl.addEventListener('mouseleave', (event) => this.onCellLeave(event));
      cellEl.addEventListener('click', (event) => this.onCellClick(event));
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
    let ownerNewCell = null;
    const inListeners = this.cellEnterListeners.filter((i) => i.position === index); 
    // Проверка на наличие кого либо
    if (inListeners.length > 0) {
      this.showCellTooltip(this.makeTitle(inListeners[0].character), index); // вывод характеристик
      if (playerClasses.includes(inListeners[0].character.type)) {
        ownerNewCell = 'player';
      } else {
        ownerNewCell = 'enemy';
      }
    }
    // Действие по содержимому ячейки
    switch (ownerNewCell) {
      case 'player':
        this.setCursor(cursors.pointer);
        this.selectCell(index, 'green');
        break;
      case 'enemy':
        if (this.playerNow.selsToAttack.includes(index)) {
          this.setCursor(cursors.crosshair);
          this.selectCell(index, 'red');
        } else {
          this.setCursor(cursors.notallowed);
        }
        break;
      default:
        // null (Empty sell)
        if (this.playerNow.selsToMove.includes(index)) {
          this.setCursor(cursors.pointer);
          this.selectCell(index, 'green');
        } else {
          this.setCursor(cursors.notallowed);
        }
        break;
    }
  }

  onCellLeave(event) {
    event.preventDefault();
    const index = this.cells.indexOf(event.currentTarget);
    // this.cellLeaveListeners.forEach((o) => o.call(null, index));
    const classToDel = ['selected', 'selected-green', 'selected-red'];
    classToDel.forEach((item) => {
      if (!this.cells[index].classList.contains('selected-yellow')) {
        this.cells[index].classList.remove(item);
      }
    });
  }

  onCellClick(event) {
    const index = this.cells.indexOf(event.currentTarget);
    const playerClasses = ['bowman', 'swordsman', 'magician'];
    let ownerNewCell = 'nobody'; // здесь владелец новой ячейки
    let character = 'start';
    let attacker;
    let target;
    let attackPower;
    // узнаем владельца новой ячейки
    if (event.target.classList.contains('character')) {
      const arrClasses = event.target.className.split(' '); // читаем классы новой ячейки
      character = this.arrCross(playerClasses, arrClasses); // ищем классы игрока в новой яцейке
      ownerNewCell = character ? 'player' : 'enemy'; // Определили игрок или враг
    }
    switch (ownerNewCell) {
      case 'player':
        if (this.playerNow.whoNow === 'player') {
          this.cells[this.playerNow.indexCell].classList.remove('selected', 'selected-yellow');
        }
        this.selectCell(index, 'yellow');
        this.playerNow.whoNow = 'player';
        this.playerNow.indexCell = index;
        this.playerNow.character = character;
        this.definingMoveCells('player');
        this.definingAttackCells('player');
        // console.log('777777', this.playerNow);
        break;
      case 'enemy':
        if (this.playerNow.whoNow === 'start') {
          this.showError('Для начала выберете своего героя!');
          break;
        }
        // Если враг вне зоны атаки - выходим
        if (!this.playerNow.selsToAttack.includes(index)) {
          return;
        }

        // console.log(`Атакующий ${this.playerNow.indexCell} враг ${index}`);
        // console.log('Бъём врага почем халва');
        this.cellEnterListeners.forEach((item) => {
          if (item.position === this.playerNow.indexCell) {
            attacker = item;
          } else if (item.position === index) {
            target = item;
          }
        });
        // console.log(`Кто ${attacker.position} кого ${target.position}`);
        // console.log(this.cellEnterListeners);
        // Расчет ущерба
        attackPower = Math.max(attacker.character.attack
          - target.character.defence, attacker.character.attack * 0.1);
        
        
        
        // Отображаем ущерб
        this.showDamage(index, attackPower)
          .then((response) => {
            // setTimeout( this.redrawPositions(this.cellEnterListeners), 1000);
            console.log('====== response', response);
          });
        // const aaa = this.redrawPositions(this.cellEnterListeners);
        // this.showDamage(index, attackPower);
        // setTimeout( aaa, 500); // Рендерим
          
          // При совершении атаки вы должны уменьшить здоровье атакованного персонажа на размер урона.
        // console.log(index);
        target.character.health -= attackPower;
        // console.log('222', target.character.health);
        // Удаление замоченного врага
        if (target.character.health <= 0) {
          let indexToDel;
          this.cellEnterListeners.forEach((item, indexCell) => {
            if (item.position === index) {
              indexToDel = indexCell;
            }
          });
          this.cellEnterListeners.splice(indexToDel, 1);
        }
        // console.log('========', this.cellEnterListeners);
        
        break;
      default:
        // Если пустая ячейка
        if (this.playerNow.whoNow === 'start') {
          this.showError('Для начала выберете своего героя!');
          break;
        }

        if (this.playerNow.selsToMove.includes(index)) {
          // Помещаем игрока в новую ячейку
          this.cellEnterListeners.forEach((item) => {
            // console.log('11', item);
            if (item.position === this.playerNow.indexCell) {
              item.position = index; // вопрос по lint
            }
          });
          this.cells[this.playerNow.indexCell].classList.remove('selected', 'selected-yellow'); // Удаляем yellow из старой ячейки
          this.playerNow.indexCell = index; // Тут находим текущего героя и меняем position
          this.definingMoveCells('player');
          this.definingAttackCells('player');
          this.selectCell(index, 'yellow');
          this.redrawPositions(this.cellEnterListeners); // Рендерим
        }
        break;
    }
    // Ответный ход врага
    if (ownerNewCell != 'player') {
      this.enemysMove(ownerNewCell === 'enemy' ? index : null);
    }
  }

  onNewGameClick(event) {
    event.preventDefault();
    this.newGameListeners.forEach((o) => o.call(null));
  }

  onSaveGameClick(event) {
    event.preventDefault();
    this.saveGameListeners.forEach((o) => o.call(null));
  }

  onLoadGameClick(event) {
    event.preventDefault();
    this.loadGameListeners.forEach((o) => o.call(null));
  }

  showError(message) {
    alert(message);
  }

  showMessage(message) {
    alert(message);
  }

  selectCell(index, color = 'yellow') {
    this.deselectCell(index);
    this.cells[index].classList.add('selected', `selected-${color}`);
  }

  deselectCell(index) {
    const cell = this.cells[index];
    cell.classList.remove(...Array.from(cell.classList)
      .filter((o) => o.startsWith('selected')));
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
      
      cell.appendChild(damageEl); // '<span class="damage">30</span>'
      // cell.insertAdjacentHTML('beforeend', '<span class="damage">30</span>');



      console.log('damageEl', damageEl);
      // console.log('Responssssss index', index, 'damage ', damage);
      console.log('Responssssss cell', cell);

      // damageEl.addEventListener('animationend', () => {
      //   cell.removeChild(damageEl);
      //   resolve('Amination done!!!!!!!!!!!!!!!!!!!!! ===');
      // });
      const remove = () => {damageEl.remove()};
      setTimeout(remove, 500);
      resolve('999');
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
    return `🎖️ ${c.level} ⚔️ ${c.attack} 🛡️ ${c.defence} ❤️ ${c.health}`; // вопрос по lint
  }

  arrCross(where, what) { // вопрос по lint
    // проверка вхождение элементов одного массива в другой
    let across = null;
    // console.log('2223== ',where, what);
    for (let i = 0; i < what.length; i += 1) {
      if (where.includes(what[i])) across = what[i];
      if (across) break;
    }
    return across;
  }

  enemysMove(enemyIndex) {
    // console.log('enemysMove', enemyIndex, 'My', this.playerNow);
    
    const enemiesNames = ['daemon', 'undead', 'vampire'] ;
    let attacker = null;
    let target = null;
    // Создаем массив врагов
    const arrEnemies = this.cellEnterListeners.filter((item) => enemiesNames.includes(item.character.type));
    // console.log('Длина массива Врагов', arrEnemies.length);
    // Если врагов не осталось, переход на новый уровень
    if(arrEnemies.length < 1) {
      console.log('Враг полностью повержен!!!!!!!! ');
      // Здесь Переход на новый уровень
      return;
    }
    
    
    // Если враг в ячейке еще жив назначаем выбераем его иначе любого другого
    for (let i in arrEnemies) {
      // console.log('item', arrEnemies[i]);
      attacker = arrEnemies[i];
      if (attacker.position === enemyIndex) {
        break;
      }
    }
     
    // Определяем допустимые ячейки передвижения и атаки для врага
    this.enemyNow.indexCell = attacker.position;
    this.enemyNow.character = attacker.character.type;
    this.definingMoveCells('enemy');
    this.definingAttackCells('enemy');
    
    // выбераю всех союзников
    const arrPlayersAll = this.cellEnterListeners.filter((item) => !enemiesNames.includes(item.character.type));
    // выбераю тех кто в зоне атаки
    const arrPlayersToAttack = arrPlayersAll.filter((item) => this.enemyNow.selsToAttack.includes(item.position));
    // Выбераем последнего героя если есть в arrPlayersToAttack
    // Иначе последнего в массиве
    for (let i in arrPlayersToAttack) {
      // console.log('Атакуемый игрок', arrPlayersToAttack[i]);
      target = arrPlayersToAttack[i];
      if (target.position === this.playerNow.indexCell) {
        break;
      }
    }
    
    console.log('Враг',attacker,'Игрок',target);
    // console.log('this.enemyNow', this.enemyNow);
    // console.log('arrPlayers', arrPlayers);
    // console.log('arrPlayersToAttack', arrPlayersToAttack);
    
    // Выделяем ячейки без characters для хода
    const characterIndex = this.cellEnterListeners.map((item) => item.position);
    const arrToMove = this.enemyNow.selsToMove.filter((item) => !characterIndex.includes(item));
    console.log('this.enemyNow.selsToMove', this.enemyNow.selsToMove,'arrToMove', arrToMove);
    if (target) {
      // Атакуем
      console.log('Враг Атаковал!!!');
    } else {
      // Делаем ход на случайную ячейку из разрешенных
      let moveIndex = Math.floor(Math.random() * arrToMove.length);
      console.log('Переходим на ячейку ', moveIndex);
      this.cellEnterListeners.forEach((item) => {
        if (item.position === this.enemyNow.indexCell) {
          item.position = arrToMove[moveIndex];
        }
      });
      this.redrawPositions(this.cellEnterListeners); // Рендерим
      //console.log('ИНДЕКС ', arrToMove[moveIndex]);

    }
  }

  definingMoveCells(param) {
    // Метод сохраняет в this.playerNow.selsToMove и this.enemyNow.selsToMove разрешенные ячейки
    // Мечники/Скелеты - 4 клетки в любом направлении
    // Лучники/Вампиры - 2 клетки в любом направлении
    // Маги/Демоны - 1 клетка в любом направлении
    const tempTrueCells = [];
    const playerTypes = ['bowman', 'swordsman', 'magician'];
    let step = null;
    const who = param === 'player' ? this.playerNow : this.enemyNow; // Кто в параметре враг или Игрок
    const column = who.indexCell % this.boardSize;
    const row = Math.floor(who.indexCell / this.boardSize);
    
    switch (who.character) {
      case 'daemon':
        step = 1;
        break;
      case 'undead':
        step = 4;
        break;
      case 'vampire':
        step = 2;
        break;
      case 'bowman':
        step = 2;
        break;
      case 'swordsman':
        step = 4;
        break;
      default:
        // magician
        step = 1;
        break;
    }
    // Определяем допустимые колонки
    const columsTrue = [];
    for (let i = column - step; i < column + step + 1; i += 1) {
      if ((i >= 0) && (i < 8)) {
        columsTrue.push(i);
      }
    }
    // Определяем допустимые строки
    const rowsTrue = [];
    for (let i = row - step; i < row + step + 1; i += 1) {
      if ((i >= 0) && (i < 8)) {
        rowsTrue.push(i);
      }
    }
    // Выбераем пересечение в массивах
    this.cells.forEach((item, index) => {
      const rowCells = Math.floor(index / this.boardSize);
      const colCells = index % this.boardSize;
      if (rowsTrue.indexOf(rowCells) >= 0 && columsTrue.indexOf(colCells) >= 0) {
        tempTrueCells.push(index);
      }
    });
    // Если игрок - добавляем союзников для смены игрока
    if (param === 'player') {
      this.cellEnterListeners.forEach((item) => {
        if (playerTypes.includes(item.character.type)) {
          tempTrueCells.push(item.position);
        }
      });
    }
    who.selsToMove = [...new Set(tempTrueCells)];
  }

  definingAttackCells(param) {
    // Метод сохраняет в this.playerNow.selsToAttack и this.enemyNow.selsToAttack разрешенные ячейки
    // Мечники/Скелеты - 1 клетки в любом направлении
    // Лучники/Вампиры - 2 клетки в любом направлении
    // Маги/Демоны - 4 клетка в любом направлении
    const tempTrueCells = [];
    let step = null;
    const who = param === 'player' ? this.playerNow : this.enemyNow; // Кто в параметре враг или Игрок
    const column = who.indexCell % this.boardSize;
    const row = Math.floor(who.indexCell / this.boardSize);
    
    switch (who.character) {
      case 'daemon':
        step = 4;
        break;
      case 'undead':
        step = 1;
        break;
      case 'vampire':
        step = 2;
        break;
      case 'bowman':
        step = 2;
        break;
      case 'swordsman':
        step = 1;
        break;
      default:
        // magician
        step = 4;
        break;
    }
    // Определяем допустимые колонки
    const columsTrue = [];
    for (let i = column - step; i < column + step + 1; i += 1) {
      if ((i >= 0) && (i < 8)) {
        columsTrue.push(i);
      }
    }
    // Определяем допустимые строки
    const rowsTrue = [];
    for (let i = row - step; i < row + step + 1; i += 1) {
      if ((i >= 0) && (i < 8)) {
        rowsTrue.push(i);
      }
    }
    // Выбераем пересечение в массивах
    this.cells.forEach((item, index) => {
      const rowCells = Math.floor(index / this.boardSize);
      const colCells = index % this.boardSize;
      if (rowsTrue.indexOf(rowCells) >= 0 && columsTrue.indexOf(colCells) >= 0) {
        tempTrueCells.push(index);
      }
    });

    // console.log('0000000000=== ', tempTrueCells);
    who.selsToAttack = [...new Set(tempTrueCells)];
  }
}
