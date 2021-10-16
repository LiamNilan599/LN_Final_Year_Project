import React from 'react'
const EditEmployee = ({ editData, handleEditFormChange, handleCancelEdit, }) => 
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
export default EditEmployee;