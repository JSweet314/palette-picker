export default class Color {
  constructor() {
    this.color = this.randomColorGenerator();
    this.locked = true;
  };

  toggleLock() {
    this.locked = !this.locked;
  }

  randomColorGenerator() {
    const characters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      color += characters[randomIndex];
    }
    return color;
  }
}