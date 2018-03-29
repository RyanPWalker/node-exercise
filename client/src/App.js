import React, { Component } from 'react';
import './App.css';

class App extends Component {
  state = {
    data: [],
    choice1: 'people',
    choice2: 1,
    errorMessage: '',

  };

  componentDidMount = () => {
    this.getStuff();
  }

  handleInputChange = event => {
    const value = event.target.value;
    const name = event.target.name;

    this.setState({
      [name]: value
    });
    // I did have it set to automatically fetch results when changed
    // But I left it out since the instructions ask for a button.
  }

  handleSubmit = () => {
    this.setState({
      
    }, () => {
      if (this.state.choice2)
        this.getStuff();
    });
  }

  getStuff = () => {
    const endpoint = '/api/' + this.state.choice1 + '/' + this.state.choice2;
    console.log(endpoint)

    try {
      fetch(endpoint)
        .then(res => res.json())
        .then(res => {
          if (res.success === true) {
            this.setState({ 
              data: res.results,
              errorMessage: '' 
            })
          } else {
            this.setState({ errorMessage: 'Unable to fetch results.'})
          }
        });
    } catch (e) {
      console.log("Something went wrong- ", e)
      this.setState({ errorMessage: 'Unable to fetch results.'})
    }
  }

  renderEmptyState = () => {
    if (this.state.data.length === 0) {
      return (
        <p style={{ fontSize: '12px', color: 'grey' }}>No data has been fetched.  Select an option and click Submit to continue.</p>
      )
    }
  }


  render() {
    return (
      <main className="App">
        <h1>People</h1>
        {this.state.data.name}
        {this.renderEmptyState()}
      </main>
    );
  }
}

export default App;
