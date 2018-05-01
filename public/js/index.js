import PalettePicker from './PalettePicker.js';

const palettePicker = new PalettePicker();

const setPalette = () => {
  const palette = palettePicker.currentPalette;
  for (let i = 1; i <= 5; i++) {
    $(`.color-${i}`).css('background-color', palette.colors[i - 1].hex);
    const color = $(`.color-${i}`).css('background-color');
  }
}

const updateMainPalette = (event) => {
  event.preventDefault();
  palettePicker.currentPalette.updateColors();
  const palette = palettePicker.currentPalette;
  for (let i = 1; i <= 5; i++) {
    const colorPanel = $(`.color-${i}`)
    colorPanel.css('background-color', palette.colors[i-1].hex);
  }
};

$('button#generate-palette').on('click', updateMainPalette);

$('.lock-color').on('click', (event) => {
  const { key } = event.target.dataset;
  $(event.target).toggleClass('locked');
  palettePicker.currentPalette.toggleColorLock(key);
});

$(window).on('load', setPalette);