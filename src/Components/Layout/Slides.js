import React from "react";
import {
    CarouselProvider,
    Slider,
    Slide,
    ButtonBack,
    ButtonNext
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import classes from './Slides.module.css';

function Slides() 
{
    return (
        <CarouselProvider className={classes.carousel}
            naturalSlideWidth={650}
            naturalSlideHeight={500}
            totalSlides={5}
            visibleSlides={1}
            currentSlide={0}
            interval={4000}
            isPlaying={true}
        >
            <Slider>
                <Slide index={0}>
                    Employees ever make you feel like this?
                    <img src="stock.jpg" alt="" />
                </Slide>
                <Slide index={1}>
                    Then TeamSwipe is for you!
                    <img src="logo192.png" alt="" />
                </Slide>
                <Slide index={2}>
                    We Guarantee Customer Satisfaction!
                    <img src="thumbs.png" alt="" />
                </Slide>
                <Slide index={3}>
                    Increase you team's productivity and cohesion.
                    <img src="Team.jpg" alt="" />
                </Slide>
                <Slide index={4}>
                    Hire and Fire Employees.
                    <img src="hire-fire-button.jpg" alt="" />
                </Slide>
            </Slider>
            <ButtonBack>Back</ButtonBack>
            <ButtonNext>Next</ButtonNext>
        </CarouselProvider>
    );
}

export default Slides;