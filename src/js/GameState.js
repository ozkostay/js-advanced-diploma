export default class GameState {
  
  static saveFrom(object) {
    localStorage.setItem('saveState', JSON.stringify(object));
    return null;
  }

  static loadFrom() {
    return JSON.parse(localStorage.getItem('saveState'));
  }
}
