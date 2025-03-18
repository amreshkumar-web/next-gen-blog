import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux';
import { BrowserRouter } from "react-router-dom";
import {store,persistor } from './GlobalData/store.js';
import { PersistGate } from 'redux-persist/integration/react';
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
   <Provider store={store}>
   <PersistGate loading={null} persistor={persistor}>
    <App />
   </PersistGate>
   
   </Provider>
  </StrictMode>
  </BrowserRouter>
)
