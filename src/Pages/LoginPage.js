import React from 'react'
import classes from '../Components/Layout/LoginPage.module.css';
import Card from '../Components/Layout/Card';

function LoginPage() {
  {/* Code is from the following tutorial: How to build an Auto-Playing Slideshow with React. Code source: https://tinloof.com/blog/how-to-build-an-auto-play-slideshow-with-react/*/}
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
  const [index, setIndex] = React.useState(0);
  const timeoutRef = React.useRef(null);
  const delay = 3000; //ms delay

  function resetTimeout() {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }

  React.useEffect(() => {
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