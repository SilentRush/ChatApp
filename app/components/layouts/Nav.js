import React from "react";
import {Link, IndexLink, browserHistory} from "react-router";

export default class Nav extends React.Component{
  constructor (){
    super();
  }
  render(){
    const { location } = this.props;
    const homeClass = location.pathname === "/" ? "active" : "";

    return (
      <ul className="menu vertical" id="navigationMenu">
        <li data-close="offCanvas"><Link to="/"><i className="fa fa-home"></i>&nbsp; Home</Link></li>
      </ul>

    );
  }
}
