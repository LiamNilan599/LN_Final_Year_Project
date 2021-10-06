import React from 'react'
import EmployeeItem from './EmployeeItem';
import EditEmployee from './EditEmployee';
import classes from './EmployeeTable.module.css';
import Back_drop from "../Components/Layout/Back_drop";
import NewEmployeeModal from '../Components/Layout/NewEmployeeModal';
import { useState } from 'react';
import { Fragment } from 'react/cjs/react.production.min';

const EmployeeTable = ({ employees }) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [editEmployeeId, setEditEmployeeId] = useState(null);

    const [editData, setEditFormData] = useState(
        {
            name: "",
            age: "",
            role: "",
            ppsn: "",
            wage: "",
        });

    const handleEditFormChange = (event) => {
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
    const handleEdit = (event, employee) => {
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

    const handleCancelEdit = () => {
        setEditEmployeeId(null);
    };

    const handleEditFormSubmit = (event) => {
        event.preventDefault();

        const data = {
            id: editEmployeeId,
            name: editData.name,
            age: editData.age,
            role: editData.role,
            ppsn: editData.ppsn,
            wage: editData.wage,
        };

        var letterRegex = new RegExp(/^[a-zA-Z\s]+$/);
        if (data.name.match(letterRegex) === null) {
            alert("You must only enter letters in the Name field");
            return false;
        }
        else if (data.age === "" || data.age === null) {
            alert("Age must be filled out");
            return false;
        }
        else if (data.role.match(letterRegex) === null) {
            alert("You must only enter letters in the Role field");
            return false;
        }
        else if (data.ppsn.length < 8) {
            alert("PPSN must be eight digits");
            return false;
        }
        else if (data.age < 18 && data.wage < 7.14) {
            alert("Wage must be at least €7.14");
            return false;
        }
        else if (data.age === 18 && data.wage < 8.16) {
            alert("Wage must be at least €8.16");
            return false;
        }
        else if (data.age === 19 && data.wage < 9.18) {
            alert("Wage must be at least €9.18");
            return false;
        }
        else if (data.age >= 20 && data.wage < 10.2) {
            alert("Wage must be at least €10.2");
            return false;
        }
        else {
            const employeeData = {
                name: data.name,
                age: data.age,
                role: data.role,
                ppsn: data.ppsn,
                wage: data.wage,
            };

            fetch(
                'https://react-2-21cb7-default-rtdb.europe-west1.firebasedatabase.app/employees/' + editEmployeeId + '.json',
                {
                    method: 'PUT',
                    body: JSON.stringify(employeeData),
                },
                alert("Employee Updated"),
                console.log(employeeData)
            );
            setEditEmployeeId(null);
        }
    };

    function newEmployeeHandler() {
        setModalIsOpen(true);
    }
    function closeModalHandler() {
        setModalIsOpen(false);
    }

    function addEmployeeHandler(employeeData) {
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
    return (
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