import { useRef } from 'react';
import React from 'react'
function NewEmployeeModal(props) {
  function cancelHandler() {
    props.onCancel();
  }

  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const roleInputRef = useRef();
  const ppsnInputRef = useRef();
  const wageInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredName = nameInputRef.current.value;
    const enteredAge = ageInputRef.current.value;
    const enteredRole = roleInputRef.current.value;
    const enteredPpsn = ppsnInputRef.current.value;
    const enteredWage = wageInputRef.current.value;

    var letterRegex = new RegExp(/^[a-zA-Z\s]+$/);
    if (enteredName.match(letterRegex) === null) {
      alert("You must only enter letters in the Name field");
      return false;
    }
    else if (enteredAge === "" || enteredAge === null) {
      alert("Age must be filled out");
      return false;
    }
    else if (enteredRole.match(letterRegex) === null) {
      alert("You must only enter letters in the Role field");
      return false;
    }
    else if (enteredPpsn.length < 8) {
      alert("PPSN must be eight digits");
      return false;
    }
    else if (enteredAge < 18 && enteredWage < 7.14) {
      alert("Wage must be at least €7.14");
      return false;
    }
    else if (enteredAge === 18 && enteredWage < 8.16) {
      alert("Wage must be at least €8.16");
      return false;
    }
    else if (enteredAge === 19 && enteredWage < 9.18) {
      alert("Wage must be at least €9.18");
      return false;
    }
    else if (enteredAge >= 20 && enteredWage < 10.2) {
      alert("Wage must be at least €10.2");
      return false;
    }
    else 
    {
      const employeeData = {
        name: enteredName,
        age: enteredAge,
        role: enteredRole,
        ppsn: enteredPpsn,
        wage: enteredWage,
      };

      console.log(employeeData);
      props.onAddEmployee(employeeData);
    }
  }
  return (
    <div>
      <div className='modal'>
        <h3> New Employee </h3>
        <form className='form' onSubmit={submitHandler}>
          <div className='control'>
            <label htmlFor='name'>Name</label>
            <input type='text' required id='name' ref={nameInputRef} />
          </div>
          <div className='control'>
            <label htmlFor='age'>Age</label>
            <input type='number' required id='age' ref={ageInputRef} />
          </div>
          <div className='control'>
            <label htmlFor='role'>Role</label>
            <input type='text' required id='role' ref={roleInputRef} />
          </div>
          <div className='control'>
            <label htmlFor='ppsn'>PPSN</label>
            <input type='text' required id='ppsn' maxLength="8" ref={ppsnInputRef} />
          </div>
          <div className='control'>
            <label htmlFor='wage'>Hourly Wage</label>
            <input type='number' required id='wage' step=".01" ref={wageInputRef} />
          </div>
          <div>
            <button className='btn'>Add Employee</button>
            <button className='btn' onClick={cancelHandler}>Cancel</button>
          </div>
        </form>

      </div>
    </div>
  );
}
export default NewEmployeeModal;