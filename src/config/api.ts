import axios from 'axios';
import config from './config';

const headers = {};

export default axios.create({
  baseURL: `${config.apiUrl}`,
  headers,
});
