import React, { Component } from 'react';
import './App.css';
import Projects from './components/Projects';
import AddProject from './components/AddProject';
import uuidv4 from 'uuid/v4';

const electron = window.require('electron');
const fs = electron.remote.require('fs');
const { ipcRenderer } = electron;

class App extends Component {
  constructor() {
    super();
    this.state = {
      projects: [],
    };
  }

  componentWillMount() {
    this.setState({
      projects: [
        {
          id: uuidv4(),
          title: 'Business Website',
          category: 'Web Design',
        },
        {
          id: uuidv4(),
          title: 'Social App',
          category: 'Mobile Development',
        },
        {
          id: uuidv4(),
          title: 'Ecommerce Shopping Cart',
          category: 'Web Development',
        },
      ],
    });
  }

  handleAddProject(project) {
    const projects = this.state.projects;
    projects.push(project);
    this.setState({ projects });
    ipcRenderer.send('start-test', 'test');
  }

  handleDeleteProject(id) {
    const projects = this.state.projects;
    const index = projects.findIndex(x => x.id === id);
    projects.splice(index, 1);
    this.setState({ projects });
  }

  render() {
    return (
      <div className="App">
        <AddProject addProject={this.handleAddProject.bind(this)} />
        <Projects projects={this.state.projects} onDelete={this.handleDeleteProject.bind(this)} />
      </div>
    );
  }
}

export default App;
