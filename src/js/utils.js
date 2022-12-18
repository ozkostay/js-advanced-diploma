/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  const remainder = index % boardSize;
  let word = null;
  if (index <= boardSize - 1) {
    word = 'top';
  }

  if (index >= (boardSize ** 2 - boardSize)) {
    word = 'bottom';
  }

  if (remainder === 0) {
    word = (word ? word + '-' : '') + 'left';
  }

  if (remainder === 7) {
    word = (word ? word + '-' : '') + 'right';
  }

  if (!word) {
    word = 'center';
  }
  return word;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
