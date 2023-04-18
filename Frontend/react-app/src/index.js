import './fonts/Montserrat/Montserrat-Medium.ttf'
import './fonts/Jost/Jost-Medium.ttf'
import './fonts/Inter/Inter-VariableFont_slnt,wght.ttf'
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { checkAuthAction } from './store/api-actions';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

store.dispatch(checkAuthAction());

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
