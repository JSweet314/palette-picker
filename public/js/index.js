import PalettePicker from './PalettePicker.js';

const palettePicker = new PalettePicker();

const setPalette = () => {
  const palette = palettePicker.currentPalette;
  const $colorPanels = $('.color-panel');
  $colorPanels.each(function (index) {
    $(this).css('background-color', palette.colors[index].hex);
    $(this).find('.color-title').text(palette.colors[index].hex);
  });
}

const updateCurrentPalette = event => {
  event.preventDefault();
  palettePicker.currentPalette.updateColors();
  const palette = palettePicker.currentPalette;
  const $colorPanels = $('.color-panel');
  $colorPanels.each(function (index) {
    $(this).css('background-color', palette.colors[index].hex);
    $(this).find('.color-title').text(palette.colors[index].hex);
  });
};

const handleLockClick = event => {
  const { key } = event.target.dataset;
  $(event.target).toggleClass('locked');
  palettePicker.currentPalette.toggleColorLock(key);
}

$(window).on('load', setPalette);
$('button#generate-palette').on('click', updateCurrentPalette);
$('.lock-color').on('click', handleLockClick);