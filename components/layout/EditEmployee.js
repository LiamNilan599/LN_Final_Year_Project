//Code is from the following tutorial: Create a Table in React | Learn how to view, add, delete and edit rows in a table from Scratch. Code source: https://github.com/chrisblakely01/react-creating-a-table
function EditEmployee({ editData, handleEditFormChange, handleCancelEdit, }) 
{
    return (
        <tr>
            <td>
                <input
                    type="text"
                    required="required"
                    placeholder="Enter a name..."
                    name="name"
                    value={editData.name}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <input
                    type="number"
                    required="required"
                    placeholder="Enter an age..."
                    name="age"
                    value={editData.age}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <input
                    type="text"
                    required="required"
                    placeholder="Enter a role..."
                    name="role"
                    value={editData.role}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <input
                    type="text"
                    required="required"
                    placeholder="Enter a PPSN Number..."
                    name="ppsn"
                    value={editData.ppsn}
                    maxLength="8"
                    onChange={handleEditFormChange}
                ></input>
            </td>

            <td>
                <input
                    type="number"
                    required="required"
                    placeholder="Enter a wage..."
                    step=".01"
                    name="wage"
                    value={editData.wage}
                    onChange={handleEditFormChange}
                ></input>
            </td>
            <td>
                <button type="submit">Save</button>
                <button type="button" onClick={handleCancelEdit}>Cancel</button>
            </td>
        </tr>
    );
}
//End of tutorial code
export default EditEmployee;