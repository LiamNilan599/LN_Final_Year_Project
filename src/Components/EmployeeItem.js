import { useContext } from 'react';
import EmployeesContext from '../Store/employees-context';

function EmployeeItem(props) {

  const employeeCtx = useContext(EmployeesContext);
  const employeeIsHired = employeeCtx.isEmployee(props.id); // get number of employees for badge
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
                {props.name}
            </td>
            <td>
                {props.age}
            </td>
            <td>
                {props.role}
            </td>
            <td>
                {props.ppsn}
            </td>
            <td>
                {props.wage}
            </td>
            <td>
                Edit and Delete Button
            </td>
        </tr>
    );
}
export default EmployeeItem;