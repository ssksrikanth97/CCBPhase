import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { FETCH_PRODUCTS_REQUEST, CREATE_PRODUCT_REQUEST } from './actionTypes';
import {
  fetchProductsSuccess,
  fetchProductsFailure,
  createProductSuccess,
  createProductFailure,
} from './actions';

const mockProducts = [
  {
    id: 1,
    name: 'OTT Streaming - Basic',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '320K',
    growth: '+25.4%',
    aiInsight: 'Maintain current strategy',
    monthlyRevenue: '$127M',
    tags: ['Onetime', 'Streaming', 'Basic'],
  },
  {
    id: 2,
    name: 'Live Concert Streaming Pass',
    churnLevel: 'Medium Churn',
    churnColor: 'medium',
    aiRecommendation: true,
    subscribers: '320K',
    growth: '+18.7%',
    aiInsight: 'Pack usage on match days',
    monthlyRevenue: '$89M',
    tags: ['Onetime', 'Live', 'Premium'],
  },
  {
    id: 3,
    name: 'Exclusive Premier Launch Ticket',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '6.8M',
    growth: '+31.2%',
    aiInsight: 'Maintain current strategy',
    monthlyRevenue: '$95M',
    tags: ['Onetime', 'Premium'],
  },
  {
    id: 4,
    name: 'Sports Plus Recurring',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '1.2M',
    growth: '+14.8%',
    aiInsight: 'Expand to new regions',
    monthlyRevenue: '$45M',
    tags: ['Recurring', 'Sports', 'Streaming'],
  },
  {
    id: 5,
    name: 'Basic Entertainment Bundle',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '2.4M',
    growth: '+9.2%',
    aiInsight: 'Add family content',
    monthlyRevenue: '$68M',
    tags: ['Recurring', 'Basic', 'Streaming'],
  },
];

function fetchProductsApi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockProducts), 500);
  });
}

function createProductApi(product) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...product,
        id: Date.now(),
        churnLevel: 'Low Churn',
        churnColor: 'low',
        aiRecommendation: true,
        subscribers: '0',
        growth: '+0%',
        aiInsight: 'New product - gathering data',
        monthlyRevenue: '$0',
        tags: ['Onetime'],
      });
    }, 800);
  });
}

function* fetchProductsSaga() {
  try {
    yield delay(300);
    const products = yield call(fetchProductsApi);
    yield put(fetchProductsSuccess(products));
  } catch (error) {
    yield put(fetchProductsFailure(error.message));
  }
}

function* createProductSaga(action) {
  try {
    const product = yield call(createProductApi, action.payload);
    yield put(createProductSuccess(product));
  } catch (error) {
    yield put(createProductFailure(error.message));
  }
}

export default function* rootSaga() {
  yield takeLatest(FETCH_PRODUCTS_REQUEST, fetchProductsSaga);
  yield takeLatest(CREATE_PRODUCT_REQUEST, createProductSaga);
}
