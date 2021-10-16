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

    const employeeData = {
      name: enteredName,
      age: enteredAge,
      role: enteredRole,
      ppsn: enteredPpsn,
      wage: enteredWage,
    };

    props.onAddEmployee(employeeData);
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