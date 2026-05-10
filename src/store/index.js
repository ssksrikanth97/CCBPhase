import { createStore, applyMiddleware, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import productReducer from '../modules/Product/store/reducer';
import rootSaga from '../modules/Product/store/sagas';

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  products: productReducer,
});

const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
