import PalettePicker from './PalettePicker.js';

const $colorPanels = $('.color-panel');
const $lockColorBtn = $('.lock-color');
const $saveProjectBtn = $('#save-project');
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
  const paletteHTML = await mapPalettesToHTML(matchingPalettes);
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
          <button class="delete-palette" data-id=${palette.id}></button>
        </div
      </div>`
  }, '');
}

const setProjects = async () => {
  $('.project').remove();
  $('option.project-name').remove();
  const projects = await palettePicker.projects;
  projects.forEach(async project => {
    const {projectName, id} = project
    const projectHTML = await mapProjectToHTML(project);
    $projects.append(projectHTML);
    $selectProject.append(`<option class="project-name" value="${projectName}" data-key=${id}>${projectName}</option>`);
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

const handleSavePalette = async event => {
  event.preventDefault();
  const name = $paletteNameInput.val();
  const projectName = $selectProject.val();
  console.log(projectName)
  if (!projectName) {
    $('.palette-error').text('You must select/create a project');
    return;
  }
  const projects = await palettePicker.projects;
  const project = await projects.find(project => project.projectName === projectName)
  const projectId = project.id;
  const colors = palettePicker.currentPalette.colors.map(color => color.hex)
    .reduce((palette, color, index) => {
      palette[`color-${index + 1}`] = color;
      return palette;
    }, {});
    const palette = {...colors, projectId, name};
    const validation = await palettePicker.postPalette(palette);
    if (!validation) {
      $('.palette-error').text('Something went wrong, please try again');
    }
    $('.palette-error').text('');
    await setProjects();
}

const handleSaveProject = async event => {
  event.preventDefault();
  const name = $('#project-name').val();
  const projects = await palettePicker.projects;
  const alreadyExists = projects.some(project => project.projectName.toLowerCase() === name.toLowerCase());
  if (!alreadyExists) {
    const response = await palettePicker.postProject({ projectName: name });
    $('.project-error').text('');
    $('#project-name').val('');
    if (response) {
      setProjects();
    }
  } else {
    $('.project-error').text('Name already taken');
  }
}

$(window).on('load', initializeApp);

$generatePaletteBtn.on('click', updateCurrentPalette);

$lockColorBtn.on('click', handleLockClick);

$savePaletteBtn.on('click', handleSavePalette);

$saveProjectBtn.on('click', handleSaveProject);

$projects.on('click', '.delete-palette', async event => {
  const id = event.target.dataset;
  await palettePicker.deletePalette(id);
  await setProjects();
  
});
