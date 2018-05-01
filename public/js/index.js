import PalettePicker from './PalettePicker.js';

const $colorPanels = $('.color-panel');
const $lockColorBtn = $('.lock-color');
const $savePaletteBtn = $('button#save-palette');
const $generatePaletteBtn = $('button#generate-palette');
const $paletteNameInput = $('.palette-form input');
const $projects = $('.projects');
const $selectProject = $('#select-project');
const palettePicker = new PalettePicker();

const setPalette = () => {
  const palette = palettePicker.currentPalette;
  $colorPanels.each(function (index) {
    $(this).css('background-color', palette.colors[index].hex);
    $(this).find('.color-title').text(palette.colors[index].hex);
  });
}

const mapProjectToHTML = async project => {
  const { projectName, id } = project;
  const palettes = await palettePicker.palettes
  const matchingPalettes = palettes.filter(palette => palette.projectId === id);
  const paletteHTML = mapPalettesToHTML(matchingPalettes);

  return `<article class="project"><h4>${projectName}</h4>${paletteHTML}</article>`;
}

const mapPalettesToHTML = palettes => {
  return palettes.reduce((HTML, palette) => {
    return HTML +
      `<div class="project-palette">
        <h5>${palette.name}</h5>
        <div class="palette">
          <div class='project-palette-color' style="background-color: ${palette["color-1"]}">
          </div>
          <div class='project-palette-color' style="background-color: ${palette["color-2"]}">
          </div>
          <div class='project-palette-color' style="background-color: ${palette["color-3"]}">
          </div>
          <div class='project-palette-color' style="background-color: ${palette["color-4"]}">
          </div>
          <div class='project-palette-color' style="background-color: ${palette["color-5"]}">
          </div>
        </div
      </div>`
  }, '');
}

const setProjects = async () => {
  const projects = await palettePicker.projects;
  projects.forEach(async project => {
    const {projectName} = project
    const projectHTML = await mapProjectToHTML(project);
    $projects.append(projectHTML);
    $selectProject.append(`<option value=${projectName}>${projectName}</option>`);
  });
}

const updateCurrentPalette = event => {
  event.preventDefault();
  palettePicker.currentPalette.updateColors();
  const palette = palettePicker.currentPalette;
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

const initializeApp = () => {
  setPalette();
  setProjects();
};

$(window).on('load', initializeApp);
$generatePaletteBtn.on('click', updateCurrentPalette);
$lockColorBtn.on('click', handleLockClick);
$savePaletteBtn.on('click', )