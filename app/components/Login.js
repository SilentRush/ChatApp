import React from "react";
import axios from "axios";
import { Router, Route, IndexRoute, browserHistory } from "react-router";


export default class Home extends React.Component{
  constructor(props){
    super(props);
    this.state = {username:'',password:''};
    this.changeUsername = (e) => { this.setState({username:e.target.value})};
    this.changePassword = (e) => { this.setState({password:e.target.value})};
    this.submit = (e) => {
      e.preventDefault();
      let authToken = 'Basic ' + btoa(this.state.username + ":" + this.state.password);
      const API_ROOT = 'http://api.twilkislinux.sssworld-local.com/';
      axios.defaults.baseURL = API_ROOT;
      return axios({
        method: 'post',
        url: '/authenticateUser',
        data: {
        "authToken":authToken,
        "username":this.state.username
      }})
        .then(response => {
          localStorage.setItem("firstname",response.data._source.firstname);
          localStorage.setItem("lastname",response.data._source.lastname);
          localStorage.setItem("userid",response.data._source.userid);
          localStorage.setItem("username",response.data._source.username);
          localStorage.setItem("token",response.data._source.token);
          this.props.history.push('/');
        })
        .catch(error => {
          console.log(error);
          if(error.status == 401){
            alert("Username or password is incorrect");
          }
        });
    };
  }
  render(){
    return (
      <div className="contaier-fluid">
        <div className="loginContainer">
          <div className="loginLogoContainer">
            <img src="./images/xtivia.png" />
          </div>
          <div className="loginForm">
            <form>
              <div className="form-group">
                <label for="username">Username</label>
                <input type="text" className="form-control" id="username" placeholder="Username" value={this.state.username} onChange={this.changeUsername} />
              </div>
              <div className="form-group">
                <label for="password">Password</label>
                <input type="password" className="form-control" id="password" placeholder="Password" value={this.state.password} onChange={this.changePassword} />
              </div>
              <button type="submit" className="btn btn-default" onClick={this.submit} onSubmit={this.submit}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}
