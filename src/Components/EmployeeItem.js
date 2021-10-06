import { useContext } from 'react';
import EmployeesContext from '../Store/employees-context';
import React from 'react'

const EmployeeItem=({employee,handleEdit,handleDelete}) => {

    const employeeCtx = useContext(EmployeesContext);
    const employeeIsHired = employeeCtx.isEmployee(employee.id); // get number of employees for badge
    //   const favoritesCtx = useContext(FavoritesContext);

    //   const itemIsFavorite = favoritesCtx.itemIsFavorite(props.id);

    //   function toggleFavoriteStatusHandler() {
    //     if (itemIsFavorite) {
    //       favoritesCtx.removeFavorite(props.id);
    //     } else {
    //       favoritesCtx.addFavorite({
    //         id: props.id,
    //         title: props.title,
    //         description: props.description,
    //         image: props.image,
    //         address: props.address,
    //       });
    //     }
    //   }
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
export default EmployeeItem;