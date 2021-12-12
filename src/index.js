import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App';
import { EmployeesProvider } from './Store/employees-context';
ReactDOM.render(
  <EmployeesProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </EmployeesProvider>,
  document.getElementById('root')
);