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

const initialFormState = {
  title: 'New Bundle',
  category: 'Entertainment',
  sku: '#BDL0001',
  bundleType: 'Fixed',
  validityEndDate: '12/12/2026',
  discount: '',
  products: '',
  priceType: '',
  price: '',
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

const bundleReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_BUNDLES_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_BUNDLES_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case FETCH_BUNDLES_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_BUNDLE_FILTER:
      return {
        ...state,
        activeFilters: [...state.activeFilters, action.payload],
      };

    case REMOVE_BUNDLE_FILTER:
      return {
        ...state,
        activeFilters: state.activeFilters.filter((f) => f !== action.payload),
      };

    case UPDATE_BUNDLE_FORM:
      return {
        ...state,
        form: { ...state.form, [action.payload.field]: action.payload.value },
      };

    case RESET_BUNDLE_FORM:
      return { ...state, form: { ...initialFormState }, createError: null };

    case CREATE_BUNDLE_REQUEST:
      return { ...state, creating: true, createError: null };

    case CREATE_BUNDLE_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [...state.items, action.payload],
        form: { ...initialFormState },
      };

    case CREATE_BUNDLE_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    default:
      return state;
  }
};

export default bundleReducer;
