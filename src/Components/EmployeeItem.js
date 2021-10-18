import { useContext } from 'react';
import EmployeesContext from '../Store/employees-context';
import React from 'react'

//Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
function EmployeeItem({employee,handleEdit,handleDelete}) {

    // const employeeCtx = useContext(EmployeesContext);
    // const employeeIsHired = employeeCtx.isEmployee(employee.id); 
    return (
        <tr>
            <td>
                {employee.name}
            </td>
            <td>
                {employee.age}
            </td>
            <td>
                {employee.role}
            </td>
            <td>
                {employee.ppsn}
            </td>
            <td>
                {employee.wage}
            </td>
            <td>
                <button type="button" onClick={(event) => handleEdit(event, employee)}>Edit</button>
                <button type="button" onClick={(event) => handleDelete(event, employee.id)}>Delete
                </button>
            </td>
        </tr>
    );
};
//End of tutorial code
export default EmployeeItem;