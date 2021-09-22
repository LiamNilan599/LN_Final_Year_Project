import EmployeeItem from './EmployeeItem';
import classes from './EmployeeTable.module.css';
import Back_drop from "../Components/Layout/Back_drop";
import NewEmployeeModal from '../Components/Layout/NewEmployeeModal';
import { useState, useEffect } from 'react';

function EmployeeTable(props) {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    function newEmployeeHandler() {
        setModalIsOpen(true);
    }
    function closeModalHandler() {
        setModalIsOpen(false);
    }

    function addEmployeeHandler(employeeData)
  {
    fetch(
      'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/employees.json',
      {
        method: 'POST',
        body: JSON.stringify(employeeData),
        headers: 
        {
          'Content-Type': 'application/json'
        }
      },
      setModalIsOpen(false),
      window.location.reload()
    );
  }
    return (
        <div className={classes.table}>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Role</th>
                        <th>PPSN</th>
                        <th>Hourly Wage</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {props.employees.map((employee) =>
                        <EmployeeItem
                            key={employee.id}
                            id={employee.id}
                            name={employee.name}
                            age={employee.age}
                            role={employee.role}
                            ppsn={employee.ppsn}
                            wage={employee.wage}
                        />
                    )}
                </tbody>
            </table>
            <div className={classes.actions}>
                <button className='btn' onClick={newEmployeeHandler}>
                    New Employee
                </button>
            </div>
            {modalIsOpen ? <NewEmployeeModal onCancel={closeModalHandler} onAddEmployee={addEmployeeHandler}/> : null}
            {modalIsOpen && <Back_drop onClick={closeModalHandler} />}
        </div>
    );
}

export default EmployeeTable;