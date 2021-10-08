import EmployeeTable from '../Components/EmployeeTable';
import { useState, useEffect } from 'react';
import Card from '../Components/Layout/Card';
import React from 'react'

function EmployeesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [loadedEmployees, setLoadedEmployees] = useState([]);

  useEffect(() => {
    setIsLoading(true);
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

        setIsLoading(false);
        setLoadedEmployees(employees);
      });
  }, []);

  if (isLoading) {
    return (
      <section>
        <p>Loading...</p>
      </section>
    );
  }

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