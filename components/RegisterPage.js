import Card from './layout/Card';
import classes from './RegisterPage.module.css';
import Router from 'next/router'
import { useRef } from 'react';
import { Spacer, Button } from '@nextui-org/react';

function RegisterPage() {
  const emailInputRef = useRef();
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const ppsnInputRef = useRef();
  const wageInputRef = useRef();
  const pass1InputRef = useRef();
  const pass2InputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredName = nameInputRef.current.value;
    const enteredAge = ageInputRef.current.value;
    const enteredRole = "Manager";
    const enteredPpsn = ppsnInputRef.current.value;
    const enteredWage = wageInputRef.current.value;
    const enteredPass1 = pass1InputRef.current.value;
    const enteredPass2 = pass2InputRef.current.value;

    const companyData = {
      email: enteredEmail,
      name: enteredName,
      age: enteredAge,
      role: enteredRole,
      ppsn: enteredPpsn,
      wage: enteredWage,
      pass1: enteredPass1,
      pass2: enteredPass2
    };

    if (Verification(companyData) == true) 
    {
      const companyDataFinal = {
        email: enteredEmail,
        password: enteredPass1,
        name: enteredName,
        age: enteredAge,
        role: enteredRole,
        ppsn: enteredPpsn,
        wage: enteredWage
      };

      fetch('api/register',
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(companyDataFinal)
        }
      );
      Router.push('/')
    }
    else {
      alert("Invalid Data");
    }
  }
  function Verification(data) {

    var letterRegex = new RegExp(/^[a-zA-Z\s]+$/);
    if (data.name.match(letterRegex) === null) {
      alert("You must only enter letters in the Name field");
      return false;
    }
    else if (data.age === "" || data.age === null) {
      alert("Age must be filled out");
      return false;
    }
    else if (data.ppsn.length < 8) {
      alert("PPSN must be eight digits");
      return false;
    }
    else if (data.age < 18 && data.wage < 7.14) {
      alert("Wage must be at least €7.14");
      return false;
    }
    else if (data.age === 18 && data.wage < 8.16) {
      alert("Wage must be at least €8.16");
      return false;
    }
    else if (data.age === 19 && data.wage < 9.18) {
      alert("Wage must be at least €9.18");
      return false;
    }
    else if (data.age >= 20 && data.wage < 10.2) {
      alert("Wage must be at least €10.2");
      return false;
    }
    else if (data.pass1 != data.pass2) {
      alert("Passwords are not the same");
      return false;
    }
    else {
      return true;
    }
  }
  return (
    <section>
      <h1>Register</h1>
      <Card>
        <div className={classes.actions}>
          <h3> Enter Company Data </h3>

          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
              <label htmlFor='Email'>Company Email</label>
              <input type='email' required id='email' ref={emailInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='manager'>Manager Name</label>
              <input type='text' required id='name' ref={nameInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='age'>Age</label>
              <input type='number' required id='age' ref={ageInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='ppsn'>PPSN</label>
              <input type='text' required id='ppsn' maxLength="8" ref={ppsnInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='wage'>Hourly Wage</label>
              <input type='number' required id='wage' step=".01" ref={wageInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='pass1'>Enter Password</label>
              <input type='password' required id='pass1' ref={pass1InputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='pass2'>Enter Password</label>
              <input type='password' required id='pass2' ref={pass2InputRef} />
            </div>
            <div>
            <Spacer y={2} />
              <Button className={classes.button} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>Join Today</Button>
            </div>
          </form>
        </div>
      </Card>
    </section>
  );
}

export default RegisterPage;