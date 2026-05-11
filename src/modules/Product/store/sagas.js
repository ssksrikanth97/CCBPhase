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
    sku: 'SKU-OTT-001',
    status: 'Active',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '2.1%',
    aiRecommendation: true,
    subscribers: '320K',
    growth: '+25.4%',
    aiInsight: 'Maintain current strategy — high DAU correlates with low churn',
    monthlyRevenue: '$127M',
    serviceType: 'Streaming',
    subscriptionModel: 'Recurring',
    region: 'Global',
    arpu: '$39.68',
    engagement: '87%',
    price: '$9.99',
    ltv: '$478',
    category: 'Video',
    createdDate: '12/01/2024',
    lastUpdated: '05/03/2025',
    tags: ['Onetime', 'Streaming', 'Basic'],
  },
  {
    id: 2,
    name: 'Live Concert Streaming Pass',
    sku: 'SKU-LCS-002',
    status: 'Active',
    churnLevel: 'Medium Churn',
    churnColor: 'medium',
    churnRate: '4.8%',
    aiRecommendation: true,
    subscribers: '320K',
    growth: '+18.7%',
    aiInsight: 'Usage spikes on event days — consider always-on content',
    monthlyRevenue: '$89M',
    serviceType: 'Live TV',
    subscriptionModel: 'One-time',
    region: 'APAC',
    arpu: '$27.81',
    engagement: '62%',
    price: '$24.99',
    ltv: '$312',
    category: 'Entertainment',
    createdDate: '03/15/2024',
    lastUpdated: '04/28/2025',
    tags: ['Onetime', 'Live', 'Premium'],
  },
  {
    id: 3,
    name: 'Exclusive Premier Launch Ticket',
    sku: 'SKU-EPL-003',
    status: 'Active',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '1.8%',
    aiRecommendation: true,
    subscribers: '6.8M',
    growth: '+31.2%',
    aiInsight: 'Fastest growing product — scale infrastructure proactively',
    monthlyRevenue: '$95M',
    serviceType: 'On-demand',
    subscriptionModel: 'One-time',
    region: 'NA + EU',
    arpu: '$13.97',
    engagement: '74%',
    price: '$14.99',
    ltv: '$168',
    category: 'Video',
    createdDate: '06/20/2024',
    lastUpdated: '05/01/2025',
    tags: ['Onetime', 'Premium'],
  },
  {
    id: 4,
    name: 'Sports Plus Recurring',
    sku: 'SKU-SPR-004',
    status: 'Active',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '3.2%',
    aiRecommendation: true,
    subscribers: '1.2M',
    growth: '+14.8%',
    aiInsight: 'Expand to new regions — LATAM shows 3x demand signal',
    monthlyRevenue: '$45M',
    serviceType: 'Live TV',
    subscriptionModel: 'Recurring',
    region: 'NA',
    arpu: '$37.50',
    engagement: '71%',
    price: '$19.99',
    ltv: '$450',
    category: 'Sports',
    createdDate: '01/10/2024',
    lastUpdated: '04/15/2025',
    tags: ['Recurring', 'Sports', 'Streaming'],
  },
  {
    id: 5,
    name: 'Basic Entertainment Bundle',
    sku: 'SKU-BEB-005',
    status: 'Active',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '2.5%',
    aiRecommendation: true,
    subscribers: '2.4M',
    growth: '+9.2%',
    aiInsight: 'Add family content to boost weekend engagement',
    monthlyRevenue: '$68M',
    serviceType: 'Streaming',
    subscriptionModel: 'Recurring',
    region: 'Global',
    arpu: '$28.33',
    engagement: '68%',
    price: '$12.99',
    ltv: '$340',
    category: 'Entertainment',
    createdDate: '09/05/2024',
    lastUpdated: '03/22/2025',
    tags: ['Recurring', 'Basic', 'Streaming'],
  },
  {
    id: 6,
    name: 'News & Current Affairs',
    sku: 'SKU-NCA-006',
    status: 'Active',
    churnLevel: 'Medium Churn',
    churnColor: 'medium',
    churnRate: '5.1%',
    aiRecommendation: true,
    subscribers: '890K',
    growth: '+7.3%',
    aiInsight: 'Personalized alerts increase retention by 22%',
    monthlyRevenue: '$18M',
    serviceType: 'Streaming',
    subscriptionModel: 'Recurring',
    region: 'NA + EU',
    arpu: '$20.22',
    engagement: '54%',
    price: '$7.99',
    ltv: '$192',
    category: 'News',
    createdDate: '11/12/2024',
    lastUpdated: '05/02/2025',
    tags: ['Recurring', 'Basic', 'Streaming'],
  },
  {
    id: 7,
    name: 'Kids Zone Premium',
    sku: 'SKU-KZP-007',
    status: 'Draft',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '1.4%',
    aiRecommendation: true,
    subscribers: '1.5M',
    growth: '+22.1%',
    aiInsight: 'Parental controls drive trust — expand content library',
    monthlyRevenue: '$32M',
    serviceType: 'On-demand',
    subscriptionModel: 'Recurring',
    region: 'Global',
    arpu: '$21.33',
    engagement: '91%',
    price: '$6.99',
    ltv: '$256',
    category: 'Kids',
    createdDate: '02/18/2025',
    lastUpdated: '04/30/2025',
    tags: ['Recurring', 'Basic', 'Streaming'],
  },
  {
    id: 8,
    name: '4K Ultra HD Add-on',
    sku: 'SKU-4KU-008',
    status: 'Active',
    churnLevel: 'Low Churn',
    churnColor: 'low',
    churnRate: '1.9%',
    aiRecommendation: false,
    subscribers: '680K',
    growth: '+42.5%',
    aiInsight: 'Fastest growing add-on — bundle with Premium tier',
    monthlyRevenue: '$14M',
    serviceType: 'Streaming',
    subscriptionModel: 'Recurring',
    region: 'NA',
    arpu: '$20.58',
    engagement: '79%',
    price: '$4.99',
    ltv: '$247',
    category: 'Video',
    createdDate: '04/01/2025',
    lastUpdated: '05/05/2025',
    tags: ['Recurring', 'Premium', 'Streaming'],
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
        aiInsight: 'New product — gathering data',
        monthlyRevenue: '$0',
        serviceType: product.serviceType || 'Streaming',
        subscriptionModel: product.subscriptionAs || 'Recurring',
        region: 'Global',
        arpu: '$0',
        engagement: '0%',
        price: product.price || '$0',
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
