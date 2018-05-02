import Palette from './Palette.js';

export default class PalettePicker {
  constructor() {
    this.palettes = this.getPalettes();
    this.projects = this.getProjects();
    this.currentPalette = new Palette();
    this.error = '';
  }

  async getPalettes() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/palettes');
      if (response.ok) {
        const palettes = await response.json();
        return palettes;
      }
    } catch (error) {
      this.error = error;
    }
  }

  async getProjects() {
    try {
      const response = await fetch('http://localhost:3000/api/v1/projects');
      if (response.ok) {
        const projects = await response.json();
        return projects;
      }
    } catch (error) {
      this.error = error;
    }
  }

  async postProject(project) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/projects', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const { id } = await response.json();
        this.projects = await this.getProjects();
        return id;
      }
    } catch (error) {
      this.error = error;
    }
  }

  async postPalette(palette) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/palettes', {
        method: 'POST',
        body: JSON.stringify(palette),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        this.palettes = await this.getPalettes();
        return response.ok;
      }
    } catch (error) {
      throw new Error(`Post palette error, ${error.message}`);
    }
  }

  async deletePalette(paletteId) {
    try {
      const response = await fetch('http://localhost:3000/api/v1/palettes', {
        method: 'DELETE',
        body: JSON.stringify(paletteId),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (response.ok) {
        this.palettes = await this.getPalettes();
      }
    } catch (error) {
      throw new Error(`Delete palette error, ${error.message}`);
    }
  }

  packageColorsForProject() {
    return this.currentPalette.colors
      .map(color => color.hex)
      .reduce((palette, color, index) => {
        palette[`color-${index + 1}`] = color;
        return palette;
      }, {});
  }
}