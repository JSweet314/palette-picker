export default class Color {
  constructor(color) {
    this.hex = color || this.randomColorGenerator();
    this.locked = false;
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

  updateColor() {
    let isSameColor;
    do {
      const color = this.randomColorGenerator();
      isSameColor = color === this.hex;
      this.hex = color;
    } while (isSameColor);
  }
}