import {
  FETCH_PRODUCTS_REQUEST,
  FETCH_PRODUCTS_SUCCESS,
  FETCH_PRODUCTS_FAILURE,
  SET_ACTIVE_FILTER,
  REMOVE_FILTER,
  CREATE_PRODUCT_REQUEST,
  CREATE_PRODUCT_SUCCESS,
  CREATE_PRODUCT_FAILURE,
  UPDATE_PRODUCT_FORM,
  RESET_PRODUCT_FORM,
} from './actionTypes';

export const fetchProductsRequest = () => ({
  type: FETCH_PRODUCTS_REQUEST,
});

export const fetchProductsSuccess = (products) => ({
  type: FETCH_PRODUCTS_SUCCESS,
  payload: products,
});

export const fetchProductsFailure = (error) => ({
  type: FETCH_PRODUCTS_FAILURE,
  payload: error,
});

export const setActiveFilter = (filter) => ({
  type: SET_ACTIVE_FILTER,
  payload: filter,
});

export const removeFilter = (filter) => ({
  type: REMOVE_FILTER,
  payload: filter,
});

export const createProductRequest = (product) => ({
  type: CREATE_PRODUCT_REQUEST,
  payload: product,
});

export const createProductSuccess = (product) => ({
  type: CREATE_PRODUCT_SUCCESS,
  payload: product,
});

export const createProductFailure = (error) => ({
  type: CREATE_PRODUCT_FAILURE,
  payload: error,
});

export const updateProductForm = (field, value) => ({
  type: UPDATE_PRODUCT_FORM,
  payload: { field, value },
});

export const resetProductForm = () => ({
  type: RESET_PRODUCT_FORM,
});
