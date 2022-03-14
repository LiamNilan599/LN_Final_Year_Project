import { useContext, useRef, useState, useEffect } from 'react';
import { Button, Grid } from '@nextui-org/react';
import EmployeesContext from '../../Store/employees-context';

function NewEmployeeModal(props) {
  const [roleText, setRoleText] = useState("");
  const [wageText, setWageText] = useState("");
  const [UsePresets, setUsePresets] = useState(false);
  const UserPresets = useContext(EmployeesContext);

  var loadedPresets = UserPresets.getPresets()

  function cancelHandler() {
    props.onCancel();
  }
  function presetHandler() {
    setUsePresets(prevUsePresets => !prevUsePresets);
    setWageText("")
  }

  function buttonHandler(event, role, wage) {
    event.preventDefault();
    setUsePresets(prevUsePresets => !prevUsePresets);
    setRoleText(role)
    setWageText(wage)
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
            {UsePresets === true ?
              <Grid.Container justify="center">
                <Grid>
                  <Button.Group vertical size="sm">
                    {loadedPresets.map((preset) =>
                      <Button css={{ backgroundColor: '#008805' }} key={preset._id} onClick={(event) => buttonHandler(event, preset.role, preset.wage)}>{preset.role}</Button>
                    )}
                  </Button.Group>
                </Grid>
              </Grid.Container> : <input type='text' required id='role' defaultValue={roleText} ref={roleInputRef} />}
          </div>
          <div className='control'>
            <label htmlFor='ppsn'>PPSN</label>
            <input type='text' required id='ppsn' maxLength="8" ref={ppsnInputRef} />
          </div>
          <div className='control'>
            <label htmlFor='wage'>Hourly Wage</label>
            <input type='number' required id='wage' defaultValue={wageText} step=".01" ref={wageInputRef} />
          </div>
          <div>
            {/* <button className='btn'>Add Employee</button> */}
            <Button.Group size="sm">
              <Button css={{ backgroundColor: '#008805' }} auto>Add Employee</Button>
              {loadedPresets.length != 0 ? <Button onClick={presetHandler} css={{ backgroundColor: '#008805' }} auto>Use Presets</Button> : <div></div>}
              <Button onClick={cancelHandler} css={{ backgroundColor: '#008805' }} auto>Cancel</Button>
            </Button.Group>
          </div>
        </form>

      </div>
    </div>
  );
}
export default NewEmployeeModal;