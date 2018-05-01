const { expect } = require('chai');
import Color from '../public/js/Color';

describe('Color', () => {
  let color;
  beforeEach(() => {
    color = new Color();
  });

  it('should have a hex color', () => {
    expect(color.hex).not.to.be.undefined;
  });

  it('should be able to randomly generate a hex color', () => {
    expect(color.randomColorGenerator()).to.be.a.string;
    expect(color.randomColorGenerator().length).to.equal(7);
    expect(color.randomColorGenerator()[0]).to.equal('#');
  });

  it('should have a propery locked, which can be toggled', () => {
    expect(color.locked).to.be.false;
    color.toggleLock();
    expect(color.locked).to.be.true;
  });

  it('shoud be able to update its own color', () => {
    const expected = color.hex;
    color.updateColor();
    expect(color.hex).to.not.equal(expected);
  });
});