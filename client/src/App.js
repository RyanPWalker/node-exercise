import React, { Component } from "react";
import "./App.css";
import logo from "./logo.png";
import jedi from "./darthvader.jpg";
import planet from "./deathstar.png";

class App extends Component {
  state = {
    data: [],
    url: "",
    choice1: "get",
    choice2: "people",
    choice3: "",
    residents: false,
    errorMessage: ""
  };

  handleInputChange = event => {
    const name = event.target.name;
    const one = "/" + name.split(" ")[0];
    const two = "/" + name.split(" ")[1];
    const three =
      one === "/search" ? "/" + event.target.value : name.split(" ")[2];
    const four =
      this.state.residents && one === "/search" ? "?residents=true" : "";
    const endpoint = one + two + three + four;
    console.log(endpoint);

    this.setState({
      choice1: one,
      choice2: two,
      choice3: three,
      url: endpoint
    });
  };

  handleClick = () => {
    this.setState({}, () => {
      if (this.state.choice1) this.getStuff();
    });
  };

  getStuff = () => {
    try {
      fetch(this.state.url)
        .then(res => res.json())
        .then(res => {
          if (res.success === true) {
            this.setState({
              data: res.results,
              errorMessage: ""
            });
          } else {
            this.setState({ errorMessage: "Unable to fetch results." });
            console.log("Error message: ", res.error);
          }
        });
    } catch (e) {
      console.log("Something went wrong- ", e);
      this.setState({ errorMessage: "Unable to fetch results." });
    }
  };

  renderEmptyState = () => {
    if (this.state.data.length === 0) {
      return (
        <p style={{ fontSize: "12px", color: "grey" }}>
          No data has been fetched. Select an option and click Go!
        </p>
      );
    }
  };

  renderSorts = () => {
    if (this.state.choice2 === "people") {
      return this.state.data.map((rep, index) => (
        <p key={index}>
          {rep.name} {rep.mass} {rep.height}
        </p>
      ));
    }
    if (this.state.choice2 === "planets") {
      return this.state.data.map((rep, index) => (
        <p key={index}>
          {rep.name} {rep.population} {rep.diameter}
        </p>
      ));
    }
  };

  render() {
    return (
      <main className="App">
        <img src={logo} alt="logo" className="image" />
        <h1>API Fun</h1>
        <div className="container">
          <div className="buttonDiv">
            <img src={jedi} alt="logo" className="buttonImage" />
            <input
              type="button"
              name="get people "
              value="All People"
              onClick={this.handleInputChange}
            />
            <input
              type="text"
              name="search people "
              placeholder="Search people by name"
              onChange={this.handleInputChange}
            />
          </div>
          <div className="buttonDiv">
            <img src={planet} alt="logo" className="buttonImage" />
            <input
              type="button"
              name="get planets "
              value="All Planets"
              onClick={this.handleInputChange}
            />
            <input
              type="text"
              name="search planets "
              placeholder="Search planets by name"
              onChange={this.handleInputChange}
            />
          </div>
          <div>
            <div className="checkmarkDiv">
              <label>
                Name
                <input
                  name="get people ?sort=name"
                  type="checkbox"
                  checked={
                    this.state.choice3 === "?sort=name" &&
                    this.state.choice2 === "/people"
                  }
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                mass
                <input
                  name="get people ?sort=mass"
                  type="checkbox"
                  checked={this.state.choice3 === "?sort=mass"}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                height
                <input
                  name="get people ?sort=height"
                  type="checkbox"
                  checked={this.state.choice3 === "?sort=height"}
                  onChange={this.handleInputChange}
                />
              </label>
            </div>
            <div className="checkmarkDiv" style={{ paddingLeft: "50px" }}>
              <label>
                Name
                <input
                  name="get planets ?sort=name"
                  type="checkbox"
                  checked={
                    this.state.choice3 === "?sort=name" &&
                    this.state.choice2 === "/planets"
                  }
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                population
                <input
                  name="get planets ?sort=population"
                  type="checkbox"
                  checked={this.state.choice3 === "?sort=population"}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                diameter
                <input
                  name="get planets ?sort=diameter"
                  type="checkbox"
                  checked={this.state.choice3 === "?sort=diameter"}
                  onChange={this.handleInputChange}
                />
              </label>
              <label>
                residents
                <input
                  name="search planets "
                  type="checkbox"
                  checked={this.state.residents}
                  onChange={() => {
                    this.setState({
                      residents: !this.state.residents,
                      url: this.state.url + "?residents=true"
                    });
                  }}
                />
              </label>
            </div>
          </div>
        </div>
        <br /> <br />
        <input type="text" placeholder="query" value={this.state.url} />
        <input type="button" value="Go!" onClick={this.getStuff} />
        <br /> <br />
        {/*this.renderSorts()*/}
        <pre style={{ textAlign: "left" }}>
          {JSON.stringify(this.state.data, null, 2)}
        </pre>
        {this.renderEmptyState()}
        {this.state.errorMessage}
      </main>
    );
  }
}

export default App;
