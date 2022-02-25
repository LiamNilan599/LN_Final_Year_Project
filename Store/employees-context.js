import { createContext, useState } from 'react';
import React from 'react'

const DataState =
{
  amount: '0',
  NavState: false
}
const EmployeesContext = createContext(DataState);

export function EmployeesContextProvider(props) {
  const [userEmployees, setUserEmployees] = useState(DataState);
  const [NavState, setNavState] = useState(false);

  function setEmployeeCount(newCount) {
    setUserEmployees((oldUserEmployees) => {
      let prevUserEmployees = JSON.parse(JSON.stringify(oldUserEmployees))
      prevUserEmployees.amount = newCount
      return prevUserEmployees
    });
  }

  function getEmployeeCount() {
    return userEmployees.amount
  }

  function setNav(logged) {
    setNavState(logged);
  }

  function getNav() {
    return NavState
  }

  function getLoginState() {
    const ISSERVER = typeof window === "undefined";
    if (!ISSERVER) {
      if (localStorage.getItem('token')) {
        setNavState(true);
      }
    }
  }

  const context = {
    Employees: userEmployees,
    update: setEmployeeCount,
    getEmployeeCount: getEmployeeCount,
    setNav: setNav,
    getNav: getNav,
    getLoginState: getLoginState
  };

  return (
    <EmployeesContext.Provider value={context}>
      {props.children}
    </EmployeesContext.Provider>
  );
}

export default EmployeesContext;