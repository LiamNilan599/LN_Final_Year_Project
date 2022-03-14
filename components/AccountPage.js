import Card from './layout/Card';
import classes from './AccountPage.module.css';
import EmployeesContext from '../Store/employees-context';
import Back_drop from "./layout/Back_drop";
import DeleteModal from './layout/DeleteModal';
import Link from 'next/link'
import Router from 'next/router'
import { Spacer, Button } from '@nextui-org/react';
import { useContext, useRef, useState, useEffect } from 'react';
import { Fragment } from 'react/cjs/react.production.min';

function AccountPage() {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const UserLogged = useContext(EmployeesContext);
  UserLogged.getLoginState()

  const roleInputRef = useRef();
  const wageInputRef = useRef();

  var loadedPresets = UserLogged.getPresets()

  function Verification(role, wage) {

    var letterRegex = new RegExp(/^[a-zA-Z\s]+$/);
    if (role.match(letterRegex) === null) {
      alert("You must only enter letters in the Role field");
      return false;
    }
    else if (wage < 7.14) {
      alert("Wage must be at least €7.14");
      return false;
    }
    else {
      return true;
    }
  }

  function submitHandler() {

    event.preventDefault();
    const enteredRole = roleInputRef.current.value;
    const enteredWage = wageInputRef.current.value;

    const presetData = {
      role: enteredRole,
      wage: enteredWage
    };

    if (Verification(presetData.role, presetData.wage) === false) {
      return false;
    }
    else {
      UserLogged.addPreset(presetData)
    }
  }

  function deletePreset(event, id) {
    event.preventDefault();
    UserLogged.removePreset(id)
  }

  function deleteModalHandler() {
    setModalIsOpen(true);
  }
  function closeModalHandler() {
    setModalIsOpen(false);
  }
  function homeHandler() {
    setModalIsOpen(false);
    localStorage.removeItem('token', null)
    localStorage.removeItem('refreshToken', null)
    UserLogged.update('' + 0)
    UserLogged.setNav(false)
    Router.push('/register')
  }

  return (
    <section>
      <h1>Account</h1>
      {UserLogged.getNav() ?
        <Card>
          <div className={classes.row}>
            <div className={classes.column} >
              <h2 className={classes.h2}> Employee Presets </h2>
              <form className={classes.form}>
                <div className={classes.control}>
                  <label htmlFor='role'>Role</label>
                  <input type='text' required id='role' ref={roleInputRef} />
                </div>
                <div className={classes.control}>
                  <label htmlFor='wage'>Wage</label>
                  <input type='number' required id='wage' step=".01" ref={wageInputRef} />
                </div>
                <div>
                  <Spacer y={0.5} />

                  <Button className={classes.button} onClick={() => submitHandler()} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>+</Button>

                  <Spacer y={0.5} />
                </div>
              </form>
            </div>
            <div className={classes.column} >
              <h2 className={classes.h2}> Your Presets </h2>
              <form >
                <table>
                  <thead>
                    <tr>
                      <th>Preset</th>
                      <th>Wage</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadedPresets.map((preset) =>
                      <Fragment key={preset._id}>
                        <tr>
                          <td>
                            {preset.role}
                          </td>
                          <td>
                            {preset.wage}
                          </td>
                          <td>
                            <button type="button" onClick={(event) => deletePreset(event, preset._id)}>Delete
                            </button>
                          </td>
                        </tr>
                      </Fragment>
                    )}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
          <div>
            <h2 className={classes.h2}> Delete Account </h2>
            <Spacer y={0.5} />

            <Button className={classes.button} onClick={deleteModalHandler} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>Delete</Button>

            <Spacer y={2} />
          </div>
        </Card> : <div>
          <h1>You are not logged in</h1>
          <Link href="/" ><a className="Error a">Return to Home</a></Link>
        </div>}
      {modalIsOpen ? <DeleteModal onCancel={closeModalHandler} onDelete={homeHandler} /> : null}
      {modalIsOpen && <Back_drop onClick={closeModalHandler} />}
    </section>
  );
}

export default AccountPage;