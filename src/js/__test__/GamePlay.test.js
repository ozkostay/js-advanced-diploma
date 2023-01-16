import GamePlay from '../GamePlay';
import { characterGenerator } from '../generators';

test('makeTitle from GamePlay', () => {
  const playerGenerator = characterGenerator('Daemon', 1);
  const character = playerGenerator.next().value;
  const game = new GamePlay;
  character.level = 2;
  character.attack = 20;
  character.defence = 30;
  character.health = 50;
  console.log('=====!=========!===== ', character);
  const titleString = "🎖️ 2 ⚔️ 20 🛡️ 30 ❤️ 50";
  const title = game.makeTitle(character);
  expect(title).toBe(titleString);
});
