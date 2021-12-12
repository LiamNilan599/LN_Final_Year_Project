import React from 'react'
import classes from '../Components/Layout/LoginPage.module.css';
import Slides from '../Components/Layout/Slides';
import Card from '../Components/Layout/Card';

function LoginPage() {
  return (
    <div className={classes.row}>
      <div className={classes.column} >
        <p>TeamSwipe Helps you manage Your Employees with Ease! Forget about calculating pay. We do that for you.</p>
        {/* //Code is from the following tutorial: https://bestofreactjs.com/repo/express-labs-pure-react-carousel-react-image-gallery. Code source: https://codesandbox.io/s/xxe6l */}
        <div className={classes.carousel__container} >
          <Slides />
        </div>
        {/* //End of tutorial code */}
      </div>
      <div className={classes.column}>
        <Card>
          <h2>Login</h2>
          <form className={classes.form}> {/*onSubmit={submitHandler}>*/}
            <div className={classes.control}>
              <label htmlFor='email'>Email</label>
              <input type='text' required id='email' /> {/*ref={titleInputRef} /> */}
            </div>
            <div className={classes.control}>
              <label htmlFor='password'>Password</label>
              <input type='password' required id='password' />{/* ref={imageInputRef} />*/}
            </div>
            <div className={classes.actions}>
              <button>Login</button>
            </div>
          </form>
          <h2>Register Now!</h2>

          <div className={classes.actions}>
            <button className='btn'>
              Get TeamSwipe
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;