import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Aplication from './aplication/aplication';
import '../src/assets/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Aplication/>
  </BrowserRouter>
);

