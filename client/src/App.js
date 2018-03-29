import React, { Component } from 'react';
import './App.css';
import logo from './logo.png';
import jedi from './darthvader.jpg';
import planet from './deathstar.png';

class App extends Component {
  state = {
    data: [],
    choice1: 'get',
    choice2: 'people',
    choice3: '',
    errorMessage: '',

  };

  handleInputChange = event => {
    const name = event.target.name;
    const one = name.split(' ')[0];
    const two = name.split(' ')[1];
    const three = one === 'search' ? event.target.value : '';

    this.setState({
      choice1: one,
      choice2: two,
      choice3: three
    }, () => {
      if (this.state.choice1)
        this.getStuff();
    });
  }

  handleSubmit = () => {
    this.setState({
      
    }, () => {
      if (this.state.choice2)
        this.getStuff();
    });
  }

  getStuff = () => {
    const endpoint = '/' + this.state.choice1 + '/' + this.state.choice2 + '/' + this.state.choice3;
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
            console.log("Error message: ", res.error)
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
        <p style={{ fontSize: '12px', color: 'grey' }}>No data has been fetched.  Select an option to continue.</p>
      )
    }
  }


  render() {
    return (
      <main className="App">
        <img src={logo} alt="logo" className="image" />
        <h1>API Fun</h1>
        <div className="container">
          <div className="buttonDiv">
            <img src={jedi} alt="logo" className="buttonImage" />
            <input type="button" name="get people" value="All People" onClick={this.handleInputChange} />
            <input type="text" name="search people" placeholder="Search people" onChange={this.handleInputChange} />
          </div>
          <div className="buttonDiv">
            <img src={planet} alt="logo" className="buttonImage" />
            <input type="button" name="get planets" value="All Planets" onClick={this.handleInputChange} />
          </div>
        </div>
        {/*this.state.data.map((rep, index) =>
          <p key={index}>{rep.name}</p>
        )*/}
        {JSON.stringify(this.state.data)}
        {this.renderEmptyState()}
        {this.state.errorMessage}
      </main>
    );
  }
}

export default App;
