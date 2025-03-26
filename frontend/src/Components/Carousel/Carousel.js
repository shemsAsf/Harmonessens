import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.css";

const images = [
	"/images/Carousel/Tarot.jpg",
	"/images/Carousel/Pray.jpg",
	"/images/Carousel/Rune.jpg",
	"/images/Carousel/Tambour.jpg",
	"/images/Carousel/Candles.jpg",
	"/images/Carousel/Smoke.jpg",
	"/images/Carousel/Nathuro.jpg",
	"/images/Carousel/FlowerLight.jpg",
];

const Carousel = () => {
	const settings = {
	  dots: false,
	  infinite: true,
	  speed: 500,
	  autoplay: true,
	  autoplaySpeed: 3500,
	  slidesToShow: 3,
	  slidesToScroll: 1,
	  responsive: [
		{ breakpoint: 1024, settings: { slidesToShow: 2 } },
		{ breakpoint: 768, settings: { slidesToShow: 1 } },
	  ],
	};
  
	return (
	  <div className="carousel-container">
		<Slider {...settings}>
		  {images.map((src, index) => (
			<div key={index} className="carousel-slide">
			  <img src={src} alt={`Slide ${index + 1}`} />
			</div>
		  ))}
		</Slider>
	  </div>
	);
  };
  
  export default Carousel;