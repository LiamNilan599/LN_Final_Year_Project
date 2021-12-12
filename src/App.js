import { Route, Switch } from 'react-router-dom';
import React from 'react'
import AccountPage from './Pages/AccountPage';
import LoginPage from './Pages/LoginPage';
import EmployeesPage from './Pages/Employees';
import Layout from './Components/Layout/Layout';
import { useState } from 'react';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [employed, setEmployed] = useState("");

  const globalObject = {
    setEmployed: function (newText) {
      setEmployed(newText);
    },
    getEmployed: function () {
      return employed;
    },
    refreshApp: function () {
      setRefresh(() => {
        return !refresh;
      });
    },
  };


  return (
    <Layout globalObject={globalObject}>
      <Switch>
        <Route path='/' exact>
          <LoginPage />
        </Route>
        <Route path='/account'>
          <AccountPage />
        </Route>
        <Route path='/employees'>
          <EmployeesPage globalObject={globalObject}/>
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;