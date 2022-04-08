import EmployeeTable from '../Components/EmployeeTable';
import { useState, useEffect} from 'react';
import Card from '../Components/Layout/Card';
import React from 'react'

function EmployeesPage(props) {
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [loaded, setLoaded] = useState("");
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
  fetch(
    'http://localhost:3030/get-data'
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const employees = [];

      for (const key in data) {
        const employee = {
          _id: key,
          ...data[key]
        };

        employees.push(employee);
      }
      props.globalObject.setEmployed(employees.length)

      setLoadedEmployees(employees);
      setLoaded("NULL")
    });
  }, [loaded]);

  const load = {
    setLoaded: function (newText) {
      setLoaded(newText);
    },
    refreshApp: function () {
      setRefresh(() => {
        return !refresh;
      });
    },
  };

  return (
    <section>
      <h1>Employees</h1>
      <Card>
        <div>
          <EmployeeTable employees={loadedEmployees} load={load} />
        </div>
      </Card>
    </section>
  );
}

export default EmployeesPage;