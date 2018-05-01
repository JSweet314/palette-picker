const { expect } = require('chai');
import Palette from '../public/js/Palette';
import Color from '../public/js/Color';

describe('Palette', () => {
  let palette;
  beforeEach(() => {
    palette = new Palette();
  });

  it('should hold five Color instances in an array', () => {
    expect(palette.colors).to.be.an.instanceOf(Array);
    expect(palette.colors.length).to.equal(5);
    expect(palette.colors[0]).to.be.instanceOf(Color);
  });

  it('should be able to update only unlocked colors', () => {
    palette.colors[0].locked = true;
    const lockedColor = palette.colors[0];
    const unlockedColor = palette.colors[1].hex;
    palette.updateColors();
    expect(palette.colors[0]).to.equal(lockedColor);
    expect(palette.colors[1].hex).not.to.equal(unlockedColor);
  });

  it('should be able to toggle a color lock by its hex color', () => {
    const { hex } = palette.colors[0];
    expect(palette.colors[0].locked).to.be.false;
    palette.toggleColorLock(hex);
    expect(palette.colors[0].locked).to.be.true;
  });
});