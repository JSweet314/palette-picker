import PalettePicker from './PalettePicker.js';

const $colorPanels = $('.color-panel');
const $lockColorBtn = $('.lock-color');
const $saveProjectBtn = $('#save-project');
const $savePaletteBtn = $('button#save-palette');
const $generatePaletteBtn = $('button#generate-palette');
const $paletteNameInput = $('.palette-form input');
const $projectToggleBtn = $('.toggle-project');
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
  const numberOfPalettes = matchingPalettes.length;
  const paletteHTML = await mapPalettesToHTML(matchingPalettes);
  return `
    <article class="project">
      <button class="toggle-project">
      <span class="number-palettes">${numberOfPalettes}</span>
      ${projectName}
      </button>
      ${paletteHTML}
    </article>`;
}

const mapPalettesToHTML = palettes => {
  return palettes.reduce((HTML, palette) => {
    return HTML +
      `<div class="project-palette" style="display: none" data-palette=${palette}>
        <div class="project-title-group">
          <h5 class="project-title">${palette.name}</h5>
          <button class="delete-palette" data-id=${palette.id}></button>
        </div>
        <div class="palette">
          <div 
            class='project-palette-color' 
            style="background-color: ${palette["color-1"]}">
            <p class="project-palette-title">${palette["color-1"]}</p>
          </div>
          <div 
            class='project-palette-color' 
            style="background-color: ${palette["color-2"]}">
            <p class="project-palette-title">${palette["color-2"]}</p>
          </div>
          <div 
            class='project-palette-color' 
            style="background-color: ${palette["color-3"]}">
            <p class="project-palette-title">${palette["color-3"]}</p>
          </div>
          <div 
            class='project-palette-color' 
            style="background-color: ${palette["color-4"]}">
            <p class="project-palette-title">${palette["color-4"]}</p>
          </div>
          <div 
            class='project-palette-color' 
            style="background-color: ${palette["color-5"]}">
            <p class="project-palette-title">${palette["color-5"]}</p>
          </div> 
        </div
      </div>`
  }, '');
}

const setProjects = async () => {
  $('.project').remove();
  $('option.project-name').remove();
  const projects = await palettePicker.projects;
  projects.forEach(async project => {
    const { projectName, id } = project
    const projectHTML = await mapProjectToHTML(project);
    $projects.append(projectHTML);
    $selectProject.append(
      `<option class="project-name" value="${projectName}" data-key=${id}>
        ${projectName}
      </option>`
    );
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

const postNewPalette = async (name, projectName) => {
  const projects = await palettePicker.projects;
  const project = await projects.find(project =>
    project.projectName === projectName)
  const projectId = project.id;
  const colors = palettePicker.packageColorsForProject();
  const palette = { ...colors, projectId, name };
  const validation = await palettePicker.postPalette(palette);
  if (!validation) {
    $('.palette-error').text('Something went wrong, please try again');
  } else {
    $('.palette-error').text('');
    await setProjects();
  }
}

const handleSavePalette =  event => {
  event.preventDefault();
  const name = $paletteNameInput.val();
  const projectName = $selectProject.val();
  if (!projectName || !name) {
    $('.palette-error').text('You must pick a project and name your palette');
    return;
  }
  postNewPalette(name, projectName)
  $paletteNameInput.val('');
}

const handleSaveProject = async event => {
  event.preventDefault();
  const name = $('#project-name').val();
  const projects = await palettePicker.projects;
  const alreadyExists = projects.some(project =>
    project.projectName.toLowerCase() === name.toLowerCase());
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

const handleDeletePalette = async event => {
  const id = event.target.dataset;
  await palettePicker.deletePalette(id);
  await setProjects();
}

const toggleProjectView = event => 
  $(event.target).next('.project-palette').toggle()

const initializeApp = () => {
  setPalette();
  setProjects();
};

const displayProjectPalette = event => {
  const colors = [];
  $(event.target).parents('.project-palette')
    .find('.project-palette-title')
    .each((index, element) => colors.push(element.textContent));
  palettePicker.currentPalette.setExistingColors(colors);
  setPalette();
} 

$(window).on('load', initializeApp);

$generatePaletteBtn.on('click', updateCurrentPalette);

$lockColorBtn.on('click', handleLockClick);

$savePaletteBtn.on('click', handleSavePalette);

$saveProjectBtn.on('click', handleSaveProject);

$projects.on('click', '.delete-palette', handleDeletePalette);

$projects.on('click', '.toggle-project', toggleProjectView);

$projects.on('click', '.project-title', displayProjectPalette);

$projects.on('click', '.palette', displayProjectPalette);
