import axios from 'axios';
import store from '../store';
import instance from './connection-config'
import { getPdfsSuccess } from '../actions/utility-actions';

/**
 * Get all pdfs
 */

export function getPdfs() {
  return instance.get('/Template/GetPdfTemplateDataSources')
    .then(function(response){
      let Pdfs = response.data;
      store.dispatch(getPdfsSuccess(Pdfs));
    });
}
