import EmployeeTable from './layout/EmployeeTable';
import EmployeesContext from '../Store/employees-context';
import { useState, useEffect, useContext } from 'react';
import Link from 'next/link'
import Router from 'next/router'
import Card from './layout/Card';

function EmployeesPage(props) {
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [loaded, setLoaded] = useState("");
  const [refresh, setRefresh] = useState(false);

  const employeeCount = useContext(EmployeesContext);
  employeeCount.getLoginState()
  useEffect(() => {
    var token = JSON.stringify(localStorage.getItem('token'))
    fetch(
      'api/getEmployeeList',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: token
      })
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
        employeeCount.update('' + employees.length)
        setLoadedEmployees(employees);
        setLoaded("NULL")
      })
      .catch((err) => {
        console.log(err.message);
        alert("Timed out. You must login")
        clearNav()
        Router.push('/')
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

  function clearNav() {
    employeeCount.setNav(false)
}

  return (
    <section>
      <h1>Employees</h1>
      {employeeCount.getNav() ? <Card>
        <div>
          <EmployeeTable employees={loadedEmployees} load={load} />
        </div>
      </Card> : <div>
        <h1>You are not logged in</h1>
        <Link href="/" ><a className="Error a">Return to Home</a></Link>
      </div>}
    </section>
  );
}

export default EmployeesPage;