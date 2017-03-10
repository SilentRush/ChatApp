import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux';
import store from './store';
import router from './router';


const app = document.getElementById('app');

ReactDOM.render(
  <Provider store={store}>{router}</Provider>,
  app
);
