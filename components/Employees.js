import EmployeeTable from './layout/EmployeeTable';
import EmployeesContext from '../Store/employees-context';
import { useState, useEffect} from 'react';
import { useContext } from 'react';
import Card from './layout/Card';

function EmployeesPage(props) {
  const [loadedEmployees, setLoadedEmployees] = useState([]);
  const [loaded, setLoaded] = useState("");
  const [refresh, setRefresh] = useState(false);

  const employeeCount = useContext(EmployeesContext);

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
      employeeCount.update('' + employees.length)

      //props.globalObject.setEmployed(employees.length)

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