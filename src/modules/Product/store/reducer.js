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

const initialFormState = {
  title: 'New Product title',
  category: 'Video',
  sku: '#MTEP3222',
  subscriptionAs: 'Recurring',
  serviceType: 'Streaming services',
  productType: '',
  proRate: '',
  validityEndDate: '12/12/2026',
  unitOfMeasure: '',
  priceType: '',
  price: '',
};

const initialState = {
  items: [],
  loading: false,
  error: null,
  activeFilters: ['Onetime'],
  form: { ...initialFormState },
  creating: false,
  createError: null,
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PRODUCTS_REQUEST:
      return { ...state, loading: true, error: null };

    case FETCH_PRODUCTS_SUCCESS:
      return { ...state, loading: false, items: action.payload };

    case FETCH_PRODUCTS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_ACTIVE_FILTER:
      return {
        ...state,
        activeFilters: [...state.activeFilters, action.payload],
      };

    case REMOVE_FILTER:
      return {
        ...state,
        activeFilters: state.activeFilters.filter((f) => f !== action.payload),
      };

    case UPDATE_PRODUCT_FORM:
      return {
        ...state,
        form: { ...state.form, [action.payload.field]: action.payload.value },
      };

    case RESET_PRODUCT_FORM:
      return { ...state, form: { ...initialFormState }, createError: null };

    case CREATE_PRODUCT_REQUEST:
      return { ...state, creating: true, createError: null };

    case CREATE_PRODUCT_SUCCESS:
      return {
        ...state,
        creating: false,
        items: [...state.items, action.payload],
        form: { ...initialFormState },
      };

    case CREATE_PRODUCT_FAILURE:
      return { ...state, creating: false, createError: action.payload };

    default:
      return state;
  }
};

export default productReducer;
