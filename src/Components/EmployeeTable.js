import React from 'react'
import EmployeeItem from './EmployeeItem';
import EditEmployee from './EditEmployee';
import classes from './EmployeeTable.module.css';
import Back_drop from "../Components/Layout/Back_drop";
import NewEmployeeModal from '../Components/Layout/NewEmployeeModal';
import { useState } from 'react';
import { Fragment } from 'react/cjs/react.production.min';

function EmployeeTable({ employees }) 
{

    const [modalIsOpen, setModalIsOpen] = useState(false);

    //Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
    const [editEmployeeId, setEditEmployeeId] = useState(null);

    const [editData, setEditFormData] = useState(
        {
            name: "",
            age: "",
            role: "",
            ppsn: "",
            wage: "",
        });

    function handleEditFormChange(event)  {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    };

    function handleDelete(event, data) {
        event.preventDefault();
        fetch(
            'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/employees/' + data + '.json',
            {
                method: 'DELETE',
            },
            alert("Employee removed")
        );
    }
    function handleEdit(event, employee)
    {
        event.preventDefault();
        setEditEmployeeId(employee.id);
        const formValues =
        {
            name: employee.name,
            age: employee.age,
            role: employee.role,
            ppsn: employee.ppsn,
            wage: employee.wage,
        };
        setEditFormData(formValues);
    }

    function handleCancelEdit()
    {
        setEditEmployeeId(null);
    };
    //End of tutorial code
    function Verification(name, age, role, ppsn, wage) {
        var letterRegex = new RegExp(/^[a-zA-Z\s]+$/);
        if (name.match(letterRegex) === null) {
            alert("You must only enter letters in the Name field");
            return false;
        }
        else if (age === "" || age === null) {
            alert("Age must be filled out");
            return false;
        }
        else if (role.match(letterRegex) === null) {
            alert("You must only enter letters in the Role field");
            return false;
        }
        else if (ppsn.length < 8) {
            alert("PPSN must be eight digits");
            return false;
        }
        else if (age < 18 && wage < 7.14) {
            alert("Wage must be at least €7.14");
            return false;
        }
        else if (age === 18 && wage < 8.16) {
            alert("Wage must be at least €8.16");
            return false;
        }
        else if (age === 19 && wage < 9.18) {
            alert("Wage must be at least €9.18");
            return false;
        }
        else if (age >= 20 && wage < 10.2) {
            alert("Wage must be at least €10.2");
            return false;
        }
        else {
            const employeeData = {
                name: name,
                age: age,
                role: role,
                ppsn: ppsn,
                wage: wage,
            };
            return employeeData;
        }
    }
    //Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
    function handleEditFormSubmit(event)
    {
        event.preventDefault();

        const data = {
            id: editEmployeeId,
            name: editData.name,
            age: editData.age,
            role: editData.role,
            ppsn: editData.ppsn,
            wage: editData.wage,
        };

        if (Verification(data.name, data.age, data.role, data.ppsn, data.wage) === false) {
            return false;
        }
        else {
            fetch(
                'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/employees/' + editEmployeeId + '.json',
                {
                    method: 'PUT',
                    body: JSON.stringify(data),
                },
                alert("Employee Updated"),
                console.log(data)
            );
            setEditEmployeeId(null);
        }
    };

    function newEmployeeHandler() 
    {
        setModalIsOpen(true);
    }
    function closeModalHandler() 
    {
        setModalIsOpen(false);
    }
    //End of tutorial code
    function addEmployeeHandler(employeeData) 
    {
        if (Verification(employeeData.name, employeeData.age, employeeData.role, employeeData.ppsn, employeeData.wage) === false) {
            return false;
        }
        else {
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
                setModalIsOpen(false)
            );
        }
    }
    return (
        //Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
        <div className={classes.table}>
            <form onSubmit={handleEditFormSubmit}>
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
                        {employees.map((employee) =>
                            <Fragment>
                                {editEmployeeId === employee.id ? (
                                    <EditEmployee
                                        key={employee.id}
                                        editData={editData}
                                        handleEditFormChange={handleEditFormChange}
                                        handleCancelEdit={handleCancelEdit}
                                    />
                                ) : (
                                    <EmployeeItem
                                        key={employee.id}
                                        employee={employee}
                                        handleDelete={handleDelete}
                                        handleEdit={handleEdit}
                                    />
                                )}
                            </Fragment>
                        )}
                    </tbody>
                </table>
            </form>
            {/* End of tutorial code */}
            <div className={classes.actions}>
                <button className='btn' onClick={newEmployeeHandler}>
                    New Employee
                </button>
            </div>
            {modalIsOpen ? <NewEmployeeModal onCancel={closeModalHandler} onAddEmployee={addEmployeeHandler} /> : null}
            {modalIsOpen && <Back_drop onClick={closeModalHandler} />}
        </div>
    );
}

export default EmployeeTable;