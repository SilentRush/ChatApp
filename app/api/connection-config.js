import axios from 'axios';
var instance = axios.create({
  baseURL: 'http://localhost:54667/api'
});

export default instance;
