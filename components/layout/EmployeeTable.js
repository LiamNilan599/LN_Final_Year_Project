import EmployeeItem from './EmployeeItem';
import EditEmployee from './EditEmployee';
import classes from './EmployeeTable.module.css';
import Back_drop from "./Back_drop";
import NewEmployeeModal from './NewEmployeeModal';
import Router from 'next/router';
import { useState } from 'react';
import { Spacer, Button } from '@nextui-org/react';
import { Fragment } from 'react/cjs/react.production.min';

function EmployeeTable({ employees, load }) {

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

    function handleEditFormChange(event) {
        event.preventDefault();
        const fieldName = event.target.getAttribute("name");
        const fieldValue = event.target.value;

        const newFormData = { ...editData };
        newFormData[fieldName] = fieldValue;

        setEditFormData(newFormData);
    };

    function handleDelete(event, id) {
        event.preventDefault();
        var data = {
            id: id,
            token: localStorage.getItem('token')
          }
        fetch(
            'api/deleteEmployee',
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            },
            alert("Employee removed")
        )
            .catch((err) => {
                console.log(err.message);
                alert("Timed out. You must login")
                employeeCount.setNav(false)
                Router.push('/')
            });
        load.setLoaded("delete")
    }
    function handleEdit(event, employee) {
        event.preventDefault();
        setEditEmployeeId(employee._id);
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

    function handleCancelEdit() {
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
    function handleEditFormSubmit(event) {
        event.preventDefault();

        const data = {
            id: editEmployeeId,
            name: editData.name,
            age: editData.age,
            role: editData.role,
            ppsn: editData.ppsn,
            wage: editData.wage,
            token: localStorage.getItem('token')
        };

        if (Verification(data.name, data.age, data.role, data.ppsn, data.wage) === false) {
            return false;
        }
        else {
            fetch('api/updateEmployee',
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data),
                },
                alert("Employee Updated")
            )
                .catch((err) => {
                    console.log(err.message);
                    alert("Timed out. You must login")
                    employeeCount.setNav(false)
                    Router.push('/')
                });
            load.setLoaded("update")
            setEditEmployeeId(null);
        }
    };

    function newEmployeeHandler() {
        setModalIsOpen(true);
    }
    function closeModalHandler() {
        setModalIsOpen(false);
    }
    //End of tutorial code
    function addEmployeeHandler(employeeData) {
        if (Verification(employeeData.name, employeeData.age, employeeData.role, employeeData.ppsn, employeeData.wage) === false) {
            return false;
        }
        else {
            var data = {employee: employeeData, token : localStorage.getItem('token')}
            fetch(
                'api/insertEmployee',
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                },
                setModalIsOpen(false)
            )
                .catch((err) => {
                    console.log(err.message);
                    alert("Timed out. You must login")
                    employeeCount.setNav(false)
                    Router.push('/')
                });
            load.setLoaded("add")
        }
    }
    return (
        //Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
        <div className="table">
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
                            <Fragment key={employee._id}>
                                {editEmployeeId === employee._id ? (
                                    <EditEmployee
                                        key={employee._id}
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
            <Spacer y={0.5} />

            <Button className={classes.button} onClick={newEmployeeHandler} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>New Employee</Button>

            <Spacer y={0.5} />
            {modalIsOpen ? <NewEmployeeModal onCancel={closeModalHandler} onAddEmployee={addEmployeeHandler} /> : null}
            {modalIsOpen && <Back_drop onClick={closeModalHandler} />}
        </div>
    );
}

export default EmployeeTable;