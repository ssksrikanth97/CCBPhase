import {
  FETCH_PROMOTIONS_REQUEST,
  FETCH_PROMOTIONS_SUCCESS,
  FETCH_PROMOTIONS_FAILURE,
  SET_PROMOTION_FILTER,
  REMOVE_PROMOTION_FILTER,
  CREATE_PROMOTION_REQUEST,
  CREATE_PROMOTION_SUCCESS,
  CREATE_PROMOTION_FAILURE,
  UPDATE_PROMOTION_FORM,
  RESET_PROMOTION_FORM,
} from './actionTypes';

export const fetchPromotionsRequest = () => ({
  type: FETCH_PROMOTIONS_REQUEST,
});

export const fetchPromotionsSuccess = (promotions) => ({
  type: FETCH_PROMOTIONS_SUCCESS,
  payload: promotions,
});

export const fetchPromotionsFailure = (error) => ({
  type: FETCH_PROMOTIONS_FAILURE,
  payload: error,
});

export const setPromotionFilter = (filter) => ({
  type: SET_PROMOTION_FILTER,
  payload: filter,
});

export const removePromotionFilter = (filter) => ({
  type: REMOVE_PROMOTION_FILTER,
  payload: filter,
});

export const createPromotionRequest = (promotion) => ({
  type: CREATE_PROMOTION_REQUEST,
  payload: promotion,
});

export const createPromotionSuccess = (promotion) => ({
  type: CREATE_PROMOTION_SUCCESS,
  payload: promotion,
});

export const createPromotionFailure = (error) => ({
  type: CREATE_PROMOTION_FAILURE,
  payload: error,
});

export const updatePromotionForm = (field, value) => ({
  type: UPDATE_PROMOTION_FORM,
  payload: { field, value },
});

export const resetPromotionForm = () => ({
  type: RESET_PROMOTION_FORM,
});
