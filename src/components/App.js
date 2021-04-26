import React, { Component } from "react";
import "../css/App.css";
import AddAppointments from "./AddAppointments";
import SearchAppointments from "./SearchAppointments";
import ListAppointments from "./ListAppointments";
import { findIndex, without } from "lodash";

class App extends Component {
  // initialize states
  constructor() {
    // to access this keyword and access things inside this Component, we need super method
    // allows you to access info from this component
    // also where you can pass things from other component to this component
    super();

    this.state = {
      // this becomes an element that's available inside my component
      myAppointments: [],
      formDisplay: false,
      orderBy: "petName",
      orderDir: "asc",
      lastIndex: 0,
      queryText: "",
    };
    this.deleteAppointment = this.deleteAppointment.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.addAppointment = this.addAppointment.bind(this);
    this.changeOrder = this.changeOrder.bind(this);
    this.searchApts = this.searchApts.bind(this);
    this.updateInfo = this.updateInfo.bind(this);
  }

  deleteAppointment(apt) {
    let tempApts = this.state.myAppointments;
    tempApts = without(tempApts, apt);

    this.setState({
      myAppointments: tempApts,
    });
  }

  toggleForm() {
    this.setState({
      formDisplay: !this.state.formDisplay,
    });
  }

  addAppointment(apt) {
    let tempApts = this.state.myAppointments;
    apt.aptId = this.state.lastIndex;
    tempApts.unshift(apt);
    this.setState({
      myAppointments: tempApts,
      lastIndex: this.state.lastIndex + 1,
    });
  }

  changeOrder(ord, dir) {
    this.setState({
      orderBy: ord,
      orderDir: dir,
    });
  }

  searchApts(query) {
    this.setState({
      queryText: query,
    });
  }

  updateInfo(name, value, id) {
    let tempApts = this.state.myAppointments;
    let aptIndex = findIndex(this.state.myAppointments, {
      aptId: id,
    });

    tempApts[aptIndex][name] = value;

    this.setState({
      myAppointments: tempApts,
    });
  }
  // lifecycle method
  // bring in info from external source like getrequest from server, here look for something from file
  componentDidMount() {
    //using fetch api here
    fetch("./data.json")
      //specify your response as json response
      .then((response) => response.json())
      //take result and process it into variable
      //get result and use JS map fn here to get each of the elements in file
      .then((result) => {
        // we don't want to modify a state directly, so we create a variable and do things to it and when its ready you push that into a state
        const apts = result.map((item) => {
          item.aptId = this.state.lastIndex;
          this.setState({ lastIndex: this.state.lastIndex + 1 });
          return item;
        });
        // via setState method
        this.setState({
          myAppointments: apts,
        });
      });
  }

  render() {
    let order;
    let filteredApts = this.state.myAppointments;
    if (this.state.orderDir === "asc") {
      order = 1;
    } else {
      order = -1;
    }

    filteredApts = filteredApts
      .sort((a, b) => {
        if (
          a[this.state.orderBy].toLowerCase() <
          b[this.state.orderBy].toLowerCase()
        ) {
          return -1 * order;
        } else {
          return 1 * order;
        }
      })
      .filter((eachItem) => {
        return (
          eachItem["petName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["ownerName"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase()) ||
          eachItem["aptNotes"]
            .toLowerCase()
            .includes(this.state.queryText.toLowerCase())
        );
      });

    return (
      <main className="page bg-white" id="petratings">
        <div className="container">
          <div className="row">
            <div className="col-md-12 bg-white">
              <div className="container">
                <AddAppointments
                  formDisplay={this.state.formDisplay}
                  toggleForm={this.toggleForm}
                  addAppointment={this.addAppointment}
                ></AddAppointments>

                <SearchAppointments
                  orderBy={this.state.orderBy}
                  orderDir={this.state.orderDir}
                  changeOrder={this.changeOrder}
                  searchApts={this.searchApts}
                ></SearchAppointments>

                <ListAppointments
                  appointments={filteredApts}
                  deleteAppointment={this.deleteAppointment}
                  updateInfo={this.updateInfo}
                ></ListAppointments>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

export default App;
