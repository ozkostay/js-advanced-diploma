import { calcTileType, calcHealthLevel } from '../utils';

test('calcHealthLevel', () => {
  const word = calcHealthLevel(14);
  expect(word).toBe('critical');
});
test('calcHealthLevel', () => {
  const word = calcHealthLevel(49);
  expect(word).toBe('normal');
});
test('calcHealthLevel', () => {
  const word = calcHealthLevel(51);
  expect(word).toBe('high');
});

test('calcTileType - top-left', () => {
  const word = calcTileType(0, 8);
  console.log("=============== ", word);
  expect(word).toBe('top-left');
});
test('calcTileType - top-right', () => {
  const word = calcTileType(7, 8);
  expect(word).toBe('top-right');
});
test('calcTileType - top', () => {
  const word = calcTileType(5, 8);
  expect(word).toBe('top');
});
test('calcTileType - bottom-left', () => {
  const word = calcTileType(56, 8);
  expect(word).toBe('bottom-left');
});
test('calcTileType - bottom-right', () => {
  const word = calcTileType(63, 8);
  expect(word).toBe('bottom-right');
});
test('calcTileType - bottom', () => {
  const word = calcTileType(62, 8);
  expect(word).toBe('bottom');
});
test('calcTileType - left', () => {
  const word = calcTileType(8, 8);
  expect(word).toBe('left');
});
test('calcTileType - right', () => {
  const word = calcTileType(15, 8);
  expect(word).toBe('right');
});
test('calcTileType - center', () => {
  const word = calcTileType(14, 8);
  expect(word).toBe('center');
});

test('calcTileType - center', () => {
  const word = calcTileType(14, 8);
  expect(word).toBe('center');
});
