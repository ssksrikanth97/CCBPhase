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

const initialFormState = {
  title: 'New Promotion',
  type: 'Discount',
  code: '',
  discount: '',
  validityStartDate: '',
  validityEndDate: '12/12/2026',
  targetAudience: 'All Subscribers',
  minPurchase: '',
  maxUses: '',
  applicableTo: '',
};

const initialState = {
  items: [],
  loading: false,
  error: null,
  activeFilters: [],
  form: { ...initialFormState },
  creating: false,
  createError: null,
};

const promotionReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROMOTIONS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PROMOTIONS_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case FETCH_PROMOTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_PROMOTION_FILTER:
      return {
        ...state,
        activeFilters: [...state.activeFilters, action.payload],
      };

    case REMOVE_PROMOTION_FILTER:
      return {
        ...state,
        activeFilters: state.activeFilters.filter((f) => f !== action.payload),
      };

    case UPDATE_PROMOTION_FORM:
      return {
        ...state,
        form: { ...state.form, [action.payload.field]: action.payload.value },
      };

    case RESET_PROMOTION_FORM:
      return { ...state, form: { ...initialFormState }, createError: null };

    case CREATE_PROMOTION_REQUEST:
      return { ...state, creating: true, createError: null };

    case CREATE_PROMOTION_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [...state.items, action.payload],
        form: { ...initialFormState },
      };

    case CREATE_PROMOTION_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    default:
      return state;
  }
};

export default promotionReducer;
