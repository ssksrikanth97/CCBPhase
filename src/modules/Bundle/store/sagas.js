import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { FETCH_BUNDLES_REQUEST, CREATE_BUNDLE_REQUEST } from './actionTypes';
import {
  fetchBundlesSuccess,
  fetchBundlesFailure,
  createBundleSuccess,
  createBundleFailure,
} from './actions';

const mockBundles = [
  {
    id: 1,
    name: 'Sports + Live Events Bundle',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '1.8M',
    growth: '+28.4%',
    aiInsight: 'High engagement during weekends — add mid-week highlights',
    monthlyRevenue: '$45M',
    products: 3,
    discount: '15%',
    bundleType: 'Fixed',
    retention: '94.2%',
    avgSavings: '$7.50',
    includedProducts: ['Sports Plus', 'Live Concert Pass', 'News Basic'],
    tags: ['Fixed', 'Sports', 'Premium', 'Active'],
  },
  {
    id: 2,
    name: 'Family Entertainment Pack',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '3.2M',
    growth: '+19.6%',
    aiInsight: 'Add kids content for higher retention — 12% uplift projected',
    monthlyRevenue: '$78M',
    products: 5,
    discount: '20%',
    bundleType: 'Fixed',
    retention: '97.2%',
    avgSavings: '$12.00',
    includedProducts: ['OTT Basic', 'Kids Zone', 'Music Stream', 'News', 'Cloud DVR'],
    tags: ['Fixed', 'Entertainment', 'Basic', 'Active'],
  },
  {
    id: 3,
    name: 'Premium All-Access',
    churnLevel: 'Medium Churn',
    churnColor: 'medium',
    aiRecommendation: true,
    subscribers: '890K',
    growth: '+12.1%',
    aiInsight: 'Price sensitivity detected — consider tiered pricing',
    monthlyRevenue: '$52M',
    products: 8,
    discount: '25%',
    bundleType: 'Flexible',
    retention: '88.5%',
    avgSavings: '$18.75',
    includedProducts: ['OTT Premium', 'Sports Plus', 'Live Events', '4K Streaming', 'Music', 'News', 'Kids', 'Cloud DVR'],
    tags: ['Flexible', 'Premium', 'Active'],
  },
  {
    id: 4,
    name: 'Student Streaming Starter',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    aiRecommendation: true,
    subscribers: '2.1M',
    growth: '+34.7%',
    aiInsight: 'Fastest growing segment — expand to more universities',
    monthlyRevenue: '$21M',
    products: 2,
    discount: '40%',
    bundleType: 'Fixed',
    retention: '91.8%',
    avgSavings: '$9.00',
    includedProducts: ['OTT Basic', 'Music Stream'],
    tags: ['Fixed', 'Basic', 'Active'],
  },
  {
    id: 5,
    name: 'Holiday Special Combo',
    churnLevel: 'High Churn',
    churnColor: 'high',
    aiRecommendation: true,
    subscribers: '450K',
    growth: '-8.2%',
    aiInsight: 'Seasonal decline — offer auto-renewal incentive to retain',
    monthlyRevenue: '$12M',
    products: 4,
    discount: '30%',
    bundleType: 'Seasonal',
    retention: '62.4%',
    avgSavings: '$14.50',
    includedProducts: ['OTT Premium', 'Live Events', 'Music', 'Gift Card'],
    tags: ['Seasonal', 'Entertainment', 'Expired'],
  },
];

function fetchBundlesApi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockBundles), 500);
  });
}

function createBundleApi(bundle) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...bundle,
        id: Date.now(),
        churnLevel: 'Low Churn',
        churnColor: 'low',
        aiRecommendation: true,
        subscribers: '0',
        growth: '+0%',
        aiInsight: 'New bundle — gathering data',
        monthlyRevenue: '$0',
        products: 0,
        discount: bundle.discount || '0%',
        bundleType: bundle.bundleType || 'Fixed',
        retention: '0%',
        avgSavings: '$0',
        includedProducts: [],
        tags: ['Fixed', 'Active'],
      });
    }, 800);
  });
}

function* fetchBundlesSaga() {
  try {
    yield delay(300);
    const bundles = yield call(fetchBundlesApi);
    yield put(fetchBundlesSuccess(bundles));
  } catch (error) {
    yield put(fetchBundlesFailure(error.message));
  }
}

function* createBundleSaga(action) {
  try {
    const bundle = yield call(createBundleApi, action.payload);
    yield put(createBundleSuccess(bundle));
  } catch (error) {
    yield put(createBundleFailure(error.message));
  }
}

export default function* bundleSagas() {
  yield takeLatest(FETCH_BUNDLES_REQUEST, fetchBundlesSaga);
  yield takeLatest(CREATE_BUNDLE_REQUEST, createBundleSaga);
}
