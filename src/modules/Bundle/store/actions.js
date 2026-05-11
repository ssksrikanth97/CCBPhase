import {
  FETCH_BUNDLES_REQUEST,
  FETCH_BUNDLES_SUCCESS,
  FETCH_BUNDLES_FAILURE,
  SET_BUNDLE_FILTER,
  REMOVE_BUNDLE_FILTER,
  CREATE_BUNDLE_REQUEST,
  CREATE_BUNDLE_SUCCESS,
  CREATE_BUNDLE_FAILURE,
  UPDATE_BUNDLE_FORM,
  RESET_BUNDLE_FORM,
} from './actionTypes';

export const fetchBundlesRequest = () => ({
  type: FETCH_BUNDLES_REQUEST,
});

export const fetchBundlesSuccess = (bundles) => ({
  type: FETCH_BUNDLES_SUCCESS,
  payload: bundles,
});

export const fetchBundlesFailure = (error) => ({
  type: FETCH_BUNDLES_FAILURE,
  payload: error,
});

export const setBundleFilter = (filter) => ({
  type: SET_BUNDLE_FILTER,
  payload: filter,
});

export const removeBundleFilter = (filter) => ({
  type: REMOVE_BUNDLE_FILTER,
  payload: filter,
});

export const createBundleRequest = (bundle) => ({
  type: CREATE_BUNDLE_REQUEST,
  payload: bundle,
});

export const createBundleSuccess = (bundle) => ({
  type: CREATE_BUNDLE_SUCCESS,
  payload: bundle,
});

export const createBundleFailure = (error) => ({
  type: CREATE_BUNDLE_FAILURE,
  payload: error,
});

export const updateBundleForm = (field, value) => ({
  type: UPDATE_BUNDLE_FORM,
  payload: { field, value },
});

export const resetBundleForm = () => ({
  type: RESET_BUNDLE_FORM,
});
