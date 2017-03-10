import * as types from '../actions/action-types';

export function getPdfsSuccess(Pdfs) {
  return {
    type: types.GET_PDFS_SUCCESS,
    Pdfs
  };
}
