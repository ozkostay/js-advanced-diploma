export default class GameState {
  
  static saveFrom(object) {
    // TODO: create object
    console.log('GameState Savefrom', JSON.stringify(object));
    localStorage.setItem('saveState', JSON.stringify(object));
    return null;
  }

  static loadFrom() {
    // TODO: create object
    console.log('GameState loadFrom');
    return JSON.parse(localStorage.getItem('saveState'));
  }
}
