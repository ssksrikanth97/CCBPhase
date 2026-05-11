import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import productReducer from '../modules/Product/store/reducer';
import bundleReducer from '../modules/Bundle/store/reducer';
import promotionReducer from '../modules/Promotion/store/reducer';
import productSagas from '../modules/Product/store/sagas';
import bundleSagas from '../modules/Bundle/store/sagas';
import promotionSagas from '../modules/Promotion/store/sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  products: productReducer,
  bundles: bundleReducer,
  promotions: promotionReducer,
});

function* rootSaga() {
  yield all([
    productSagas(),
    bundleSagas(),
    promotionSagas(),
  ]);
}

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
