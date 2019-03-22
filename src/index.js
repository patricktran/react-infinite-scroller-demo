import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose } from 'redux'
import { createEpicMiddleware, ofType } from 'redux-observable';
import { delay, map } from 'rxjs/operators'
import uuid from 'uuidv4';
import './index.css';
import App from './App';

const createItems = (numberToCreate, page = 0) => {
    const newItems = Array.from({ length: numberToCreate }, (v, k) => {
        const newId = uuid().toString() + page.toString();
        return {
            id: newId,
            title: `title-${newId}`
        }
    });

    return newItems;
}

const intialState = createItems(60);

//reducer
const items = (state = intialState, action) => {
    switch (action.type) {
        case 'MORE_LOADED':
            return [
                ...state,
                ...action.payload
            ]
        default:
            return state
    }
}

const isFetching = (state = false, action) => {
    switch (action.type) {
        case 'LOAD_MORE':
            return true;
        case 'MORE_LOADED':
            return false;
        default:
            return state
    }
}

const rootEpic = action$ => action$.pipe(
    ofType('LOAD_MORE'),
    delay(Math.floor(Math.random() * 301 + 200)), // Asynchronously wait then continue
    map(action => ({
        type: 'MORE_LOADED',
        payload: createItems(30, action.payload)
    }))
);

//to use with Chrome redux dev tool
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

const store = createStore(
    combineReducers({items, isFetching}),
    {}, //initial state
    composeEnhancers(applyMiddleware(epicMiddleware))
);

epicMiddleware.run(rootEpic);

ReactDOM.render(<Provider store={store}><App /></Provider>,
    document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
