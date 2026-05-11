import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { FETCH_PROMOTIONS_REQUEST, CREATE_PROMOTION_REQUEST } from './actionTypes';
import {
  fetchPromotionsSuccess,
  fetchPromotionsFailure,
  createPromotionSuccess,
  createPromotionFailure,
} from './actions';

const mockPromotions = [
  {
    id: 1,
    name: 'Summer Streaming Sale',
    type: 'Discount',
    discount: '30%',
    code: 'SUMMER30',
    status: 'Active',
    redemptions: '12.4K',
    revenue: '$2.8M',
    growth: '+45.2%',
    conversion: '42%',
    targetAudience: 'All Users',
    maxUses: 50000,
    aiInsight: 'Peak performance — extend by 2 weeks for $1.2M uplift',
    startDate: '01/06/2025',
    endDate: '31/08/2025',
    tags: ['Discount', 'Seasonal', 'Active', 'All Users'],
  },
  {
    id: 2,
    name: 'New User Welcome Offer',
    type: 'Free Trial',
    discount: '14 days free',
    code: 'WELCOME14',
    status: 'Active',
    redemptions: '28.1K',
    revenue: '$4.2M',
    growth: '+62.8%',
    conversion: '78%',
    targetAudience: 'New Users',
    maxUses: 0,
    aiInsight: 'Highest conversion rate — 78% trial-to-paid. Keep running.',
    startDate: '01/01/2025',
    endDate: '31/12/2025',
    tags: ['Free Trial', 'Evergreen', 'Active', 'New Users'],
  },
  {
    id: 3,
    name: 'Loyalty Reward – 1 Year',
    type: 'Cashback',
    discount: '$15 credit',
    code: 'LOYAL15',
    status: 'Active',
    redemptions: '8.7K',
    revenue: '$1.9M',
    growth: '+18.4%',
    conversion: '64%',
    targetAudience: 'Existing Users',
    maxUses: 20000,
    aiInsight: 'Reduces churn by 34% in target segment — high ROI',
    startDate: '15/03/2025',
    endDate: '15/03/2026',
    tags: ['Cashback', 'Loyalty', 'Active', 'Existing Users'],
  },
  {
    id: 4,
    name: 'Black Friday Mega Deal',
    type: 'Discount',
    discount: '50%',
    code: 'BF50',
    status: 'Scheduled',
    redemptions: '0',
    revenue: '$0',
    growth: '+0%',
    conversion: '—',
    targetAudience: 'All Users',
    maxUses: 100000,
    aiInsight: 'Projected: 45K redemptions, $6.2M revenue based on last year',
    startDate: '25/11/2025',
    endDate: '02/12/2025',
    tags: ['Discount', 'Seasonal', 'Scheduled', 'All Users'],
  },
  {
    id: 5,
    name: 'Refer a Friend',
    type: 'Referral',
    discount: '1 month free each',
    code: 'REFER2025',
    status: 'Active',
    redemptions: '15.3K',
    revenue: '$3.1M',
    growth: '+28.9%',
    conversion: '64%',
    targetAudience: 'All Users',
    maxUses: 0,
    aiInsight: 'Viral coefficient: 1.4 — self-sustaining growth engine',
    startDate: '01/02/2025',
    endDate: '31/12/2025',
    tags: ['Referral', 'Evergreen', 'Active', 'All Users'],
  },
  {
    id: 6,
    name: 'Student Discount',
    type: 'Discount',
    discount: '40%',
    code: 'STUDENT40',
    status: 'Expired',
    redemptions: '22.6K',
    revenue: '$1.4M',
    growth: '-100%',
    conversion: '55%',
    targetAudience: 'New Users',
    maxUses: 30000,
    aiInsight: 'High demand — recommend reactivation for new semester',
    startDate: '01/09/2024',
    endDate: '31/05/2025',
    tags: ['Discount', 'Segment', 'Expired', 'New Users'],
  },
];

function fetchPromotionsApi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockPromotions), 500);
  });
}

function createPromotionApi(promotion) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...promotion,
        id: Date.now(),
        status: 'Scheduled',
        redemptions: '0',
        revenue: '$0',
        growth: '+0%',
        conversion: '—',
        targetAudience: promotion.targetAudience || 'All Users',
        maxUses: parseInt(promotion.maxUses) || 0,
        aiInsight: 'New promotion — monitoring performance',
        tags: ['Discount', 'Scheduled'],
      });
    }, 800);
  });
}

function* fetchPromotionsSaga() {
  try {
    yield delay(300);
    const promotions = yield call(fetchPromotionsApi);
    yield put(fetchPromotionsSuccess(promotions));
  } catch (error) {
    yield put(fetchPromotionsFailure(error.message));
  }
}

function* createPromotionSaga(action) {
  try {
    const promotion = yield call(createPromotionApi, action.payload);
    yield put(createPromotionSuccess(promotion));
  } catch (error) {
    yield put(createPromotionFailure(error.message));
  }
}

export default function* promotionSagas() {
  yield takeLatest(FETCH_PROMOTIONS_REQUEST, fetchPromotionsSaga);
  yield takeLatest(CREATE_PROMOTION_REQUEST, createPromotionSaga);
}
