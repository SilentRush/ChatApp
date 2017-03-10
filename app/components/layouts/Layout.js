import React from "react";
import {Link, browserHistory} from "react-router";
import { connect } from 'react-redux';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import * as utilityApi from "../../api/utility-api";

import Nav from "./Nav";
import Footer from "./Footer";


class Layout extends React.Component{
  constructor(props){
    super(props);
  }

  componentDidMount(){
    let options = {};
    var elem = new Foundation.OffCanvas($('#offCanvas'), options);
    utilityApi.getPdfs();
  }

  render(){
    const { location } = this.props;
    const containerStyle = {marginTop: "60px"};
    return (
      <div className="row expanded">

        <div className="off-canvas-wrapper">
          <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
            <div className="off-canvas position-left" id="offCanvas" data-off-canvas>
              <Nav location={location} />
            </div>
            <div className="off-canvas-content" data-off-canvas-content>
              <div className="title-bar">
                <div className="title-bar-left">
                  <button className="menu-icon" type="button" data-toggle="offCanvas"></button>
                  <span className="title-bar-title">MENU</span>
                </div>
                <div className="title-bar-right" id="navigationBar">
                </div>
              </div>
              <div style={{marginTop:"5px"}}>
                {React.cloneElement(this.props.children, { Pdfs: this.props.Pdfs })}
              </div>
            </div>
          </div>
        </div>
        <NotificationContainer />
      </div>
    )
  }
}

const mapStateToProps = function(store) {
  return {
    Pdfs: store.utilityState.Pdfs
  };
};

export default connect(mapStateToProps)(Layout);
