//Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
function EmployeeItem({employee,handleEdit,handleDelete}) {

    return (
        <tr key={employee.key} >
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
                <button type="button" onClick={(event) => handleDelete(event, employee._id)}>Delete
                </button>
            </td>
        </tr>
    );
};
//End of tutorial code
export default EmployeeItem;