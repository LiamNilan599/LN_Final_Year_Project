import EmployeeTable from '../Components/EmployeeTable';
import { useState } from 'react';
import Card from '../Components/Layout/Card';
import React from 'react'

function EmployeesPage(props) {
  const [loadedEmployees, setLoadedEmployees] = useState([]);


  fetch(
    'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/employees.json'
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const employees = [];

      for (const key in data) {
        const employee = {
          id: key,
          ...data[key]
        };

        employees.push(employee);
      }
      props.globalObject.setEmployed(employees.length)

      setLoadedEmployees(employees);
    });

  return (
    <section>
      <h1>Employees</h1>
      <Card>
        <div>
          <EmployeeTable employees={loadedEmployees} />
        </div>
      </Card>
    </section>
  );
}

export default EmployeesPage;