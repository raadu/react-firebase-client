import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buyItems: [],
      message: '',
    }
  }

  componentDidMount() 
  {
    return axios.get('https://us-central1-react-firebase-f8e8c.cloudfunctions.net/getItems').
    then((res) => 
    {
      console.log(res.data);
      this.setState({
        buyItems: res.data
      });
    });
  }

  //addItem function
  addItem(event) 
  {
    event.preventDefault();
    const { buyItems } = this.state;
    const newItem = this.newItem.value;

    const isOnTheList = buyItems.includes(newItem);

    if (isOnTheList) 
    {
      this.setState({
        message: 'This item is already on the list'
      });
    } 
    else 
    {
      return newItem !== '' && axios.post('https://us-central1-react-firebase-f8e8c.cloudfunctions.net/addItem', { item: newItem })
      .then((res) => 
      {
        this.setState({
          buyItems: res.data,
          message: ''
        });
        this.addForm.reset();
      })
    }
  }

  //removeItem function
  removeItem(item)
  {
    const newBuyItems = this.state.buyItems.filter(buyItems => 
      {
      return item !== buyItems;
      });

    return axios.delete(` https://us-central1-react-firebase-f8e8c.cloudfunctions.net/delete?id=${item.id}`)
    .then((res) => {
      this.setState({
        buyItems: res.data
      });
    });

    if(newBuyItems.length === 0)
    {
      this.setState({
        message: 'No Item on the list, add some'
      });
    }
  }

  //clearAll function
  clearAll()
  {
    this.setState({
      buyItems: [],
      message: 'No Item on the list, add some'
    });
  }

  //renderItems function
  renderItems() 
  {
    let id = 1;
    const { buyItems, message } = this.state;

    return (
      buyItems.length > 0 &&
      <table className="table">
        <caption>Task List</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">ID</th>
            <th scope="col">Task Name</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {
            buyItems.map(item => 
            {
              return (
                <tr key={item.id}>
                  <th scope="row">{id++}</th>
                  <td>{item.id}</td>
                  <td>{item.items}</td>
                  <td>
                    <button onClick={(e) => this.removeItem(item)}  type="button" className="btn btn-default btn-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="2">&nbsp;</td>
            <td>
              {/* <button onClick={(e) => this.clearAll()}
              className="btn btn-default btn-sm">Clear List</button> */}
            </td>
          </tr>
        </tfoot>
      </table>
    )
  }


  render() {
    const { buyItems, message } = this.state;
    return (
      <div className="container">
        <h1>Task List</h1>
        <div className="content">

          <form ref={input => {this.addForm = input}} className="form-inline" onSubmit={this.addItem.bind(this)}>
            <div className="form-group">
              <label htmlFor="newItemInput" className="sr-only">Add New Item</label>
              <input ref={input => {this.newItem = input}}
                type="text" className="form-control" id="newItemInput" />
            </div>
            <button className="btn btn-primary">Add</button>
          </form>
          {
            (message !== '' || buyItems.length === 0) && <p className="message text-danger">{message}</p>
          }

         {this.renderItems()}

        </div>
      </div>
    );
  }
}

export default App;