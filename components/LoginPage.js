import classes from './LoginPage.module.css';
import Card from './layout/Card';
import EmployeesContext from '../Store/employees-context';
import { useState, useRef, useEffect, useContext } from 'react';
import { Spacer, Button } from '@nextui-org/react';
import Router from 'next/router'

function LoginPage() {
  {/* Code is from the following tutorial: How to build an Auto-Playing Slideshow with React. Code source: https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react/*/ }
  const Slides = [
    {
      id: 'S1',
      img: "images/Stock.jpg",
      desc: "Employees ever make you feel like this?",
    },
    {
      id: 'S2',
      img: "images/logo192.png",
      desc: "Then TeamSwipe is for you!",
    },
    {
      id: 'S3',
      img: "images/thumbs.png",
      desc: "We Guarantee Customer Satisfaction!",
    },
    {
      id: 'S4',
      img: "images/Team.jpg",
      desc: "Increase you team's productivity and cohesion.",
    },
    {
      id: 'S5',
      img: "images/hire-fire-button.jpg",
      desc: "Hire and Fire Employees.",
    }
  ];
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const delay = 3000; //ms delay
  const UserLogged = useContext(EmployeesContext);

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  useEffect(() => {
    resetTimeout();
    timeoutRef.current = setTimeout(
      () =>
        setIndex((prevIndex) =>
          prevIndex === Slides.length - 1 ? 0 : prevIndex + 1
        ),
      delay
    );

    return () => {
      resetTimeout();
    };
  }, [index, Slides.length]);
  //End of Tutorial

  const emailInputRef = useRef();
  const passwordInputRef = useRef();

  function submitHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;
    const enteredPass = passwordInputRef.current.value;

    const loginData = {
      email: enteredEmail,
      password: enteredPass
    };

    fetch('api/login',
      {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData)
      }
    )
      .then((response) => {
        if (!response.ok) {
          alert("Invalid email or password")
        }
        else {
          return response.json();
        }
      })
      .then((data) => {
        localStorage.setItem('token', data.accessToken)//http storage cookie storage
        localStorage.setItem('refreshToken', data.refreshToken)
        UserLogged.setNav(true)
        Router.push('/employees')
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function newUserHandler() {
    Router.push('/register')
  }

  return (
    <div className={classes.row}>
      <div className={classes.column} >
        <p>TeamSwipe Helps you manage Your Employees with Ease! Forget about calculating pay. We do that for you.</p>
        {/* Code is from the following tutorial: How to build an Auto-Playing Slideshow with React. Code source: https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react/*/}
        <div className={classes.slideshow}>
          <div
            className={classes.slideshowSlider}
            style={{ transform: `translate3d(${-index * 100}%, 0, 0)` }}>
            {Slides.map((src, index) => (
              <div className={classes.slide} key={index}>
                <div className={classes.slideText}>{src.desc} </div>
                <img className={classes.img} key={index} src={src.img}></img>
              </div>
            ))}
          </div>
        </div>
        <div className={classes.slideshowDots}>
          {Slides.map((_, idx) => (
            <div
              key={idx}
              className={`slideshowDot${index === idx ? " active" : ""}`}
              onClick={() => {
                setIndex(idx);
              }}
            ></div>
          ))}
        </div>
        {/* End of Tutorial */}
      </div>
      <div className={classes.column}>
        <Card>
          <h2 className={classes.h2}>Login</h2>
          <form className={classes.form} onSubmit={submitHandler}>
            <div className={classes.control}>
              <label htmlFor='email'>Email</label>
              <input type='text' required id='email' ref={emailInputRef} />
            </div>
            <div className={classes.control}>
              <label htmlFor='password'>Password</label>
              <input type='password' required id='password' ref={passwordInputRef} />
            </div>

            <Spacer y={0.5} />

            <Button className={classes.button} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>Login</Button>

            <Spacer y={0.5} />

          </form>
          <h2 className={classes.h2}>Register Now!</h2>
          <Spacer y={0.5} />

          <Button className={classes.button} onClick={newUserHandler} size="lg" shadow css={{ backgroundColor: '#008805' }} auto>Get TeamSwipe</Button>

          <Spacer y={2} />
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;