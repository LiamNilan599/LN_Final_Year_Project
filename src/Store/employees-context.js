import { createContext, useState } from 'react';
import React from 'react'

const EmployeesContext = createContext({
  employees: [],
  totalEmployees: 0,
  isEmployee: (employeeId) => {}
});

export function EmployeesProvider(props) {
  const [userEmployees, setUserFavorites] = useState([]);

  function isEmployeeHandler(employeeId) {
    return userEmployees.some(employee => employee.id === employeeId);
  }

  const context = {
    isEmployee: isEmployeeHandler
  };

  return (
    <EmployeesContext.Provider value={context}>
      {props.children}
    </EmployeesContext.Provider>
  );
}

export default EmployeesContext;