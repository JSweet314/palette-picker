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
        header: {
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const { id } = await response.json();
        this.projects = this.getProjects();
        return id;
      }
    } catch (error) {
      this.error = error;
    }
  }
}