import { createContext, useState } from 'react';
import React from 'react'

const DataState =
{
  amount: '0'
}
const EmployeesContext = createContext(DataState);

export function EmployeesContextProvider(props) {
  const [userEmployees, setUserEmployees] = useState(DataState);

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

  const context = {
    Employees: userEmployees,
    update: setEmployeeCount,
    getEmployeeCount: getEmployeeCount
  };

  return (
    <EmployeesContext.Provider value={context}>
      {props.children}
    </EmployeesContext.Provider>
  );
}

export default EmployeesContext;