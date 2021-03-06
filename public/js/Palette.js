import Color from './Color.js';

export default class Palette {
  constructor() {
    this.colors = this.generateColors();
    this.name = '';
  }

  generateColors() {
    const palette = [];
    while (palette.length < 5) {
      const color = new Color();
      const alreadyPaletted = palette.some(value => value.hex === color.hex);
      if (!alreadyPaletted) {
        palette.push(color);
      }
    }
    return palette;
  }

  updateColors() {
    this.colors.forEach((color, index, array) => {
      if (!color.locked) {
        const comparisonArray = [...array.slice(0, index), ...array.slice(index + 1)]
        let alreadyPaletted;
        do {
          color.updateColor();
          alreadyPaletted = comparisonArray.some(obj => obj.hex === color.hex);
        } while (alreadyPaletted);
      }
    });
  }

  toggleColorLock(key) {
    this.colors[key].toggleLock();
  }

  setExistingColors(colorArray) {
    this.colors = colorArray.map(color => new Color(color));
  }
}