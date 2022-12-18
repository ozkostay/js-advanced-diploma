import Team from './Team';
import Bowman from './characters/Bowman';
import Daemon from './characters/Daemon';
import Magician from './characters/Magician';
import Swordsman from './characters/Swordsman';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  while (true) {
    const level = Math.ceil(Math.random() * maxLevel);
    const type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    let character;
    if (type === 'Bowman') {
      character = new Bowman(level);
    } else if (type === 'Daemon') {
      character = new Daemon(level);
    } else if (type === 'Magician') {
      character = new Magician(level);
    } else if (type === 'Swordsman') {
      character = new Swordsman(level);
    } else if (type === 'Undead') {
      character = new Undead(level);
    } else {
      character = new Vampire(level);
    }
    yield character;
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = new Team();
  const playerGenerator = characterGenerator(allowedTypes, maxLevel);
  for (let i = 0; i < characterCount; i += 1) {
    team.add(playerGenerator.next().value);
  }
  return team; // объект с заданым кол-вом персонажей
}
