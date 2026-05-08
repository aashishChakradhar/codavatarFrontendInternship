import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";

import { helloSaga } from "./slice/sagaSlice";
import { reducer } from "./slice/reducerSlice"; // Add this import

const sagaMiddleware = createSagaMiddleware();
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(helloSaga);
const action = (type) => store.dispatch({ type });
