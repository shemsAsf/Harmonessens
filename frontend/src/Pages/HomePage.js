import React from "react";
import eagle from "../Assets/eagle-icon.svg";
import "../Style/HomePage.css";
import Carousel from "../Components/Calendar/Carousel/Carousel";

function Home() {
	return (
		<div className="home">
			<br/>
			<Carousel></Carousel>

			{/* Activities Section */}
			<div className="activities">
				<h1 className="home-page-title">SWIN
					<img src={eagle} alt="Eagle" width="33" height="33"></img></h1>
				<div className="colored-line" id="centered-gl"></div>
				<div className="activities-text">
					<p>Soin chamanique, Guidance, Naturopathie, Méditation...</p>
				</div>
			</div>

			{/* Description Section */}
			<div className="description">
				<p>
					Je suis Swin,
					<br />
					Semeuse de graines et tisseuse de liens entre le visible et l’invisible.
					<br />
					<br />
					Mon chemin est celui de l’exploration intérieure, de l’écoute des murmures de l’âme et des messages que la vie nous envoie.
					<br />
					<br />
					Ici, je vous invite à un espace sacré, un moment suspendu où il est possible de se retrouver, en douceur, sans jugement.
					<br />
					<br />
					Mon rôle n’est pas de vous guider, mais de vous accompagner à retrouver votre propre boussole intérieure.
					Car au-delà des tempêtes, il existe en vous une part qui sait déjà comment avancer.
					<br /><br />
					À travers la naturopathie, les soins chamaniques, les massages énergétiques, la cartomancie et la guidance avec les runes, je vous propose des clés pour transformer, apaiser et éclairer votre chemin.
					Chaque tirage, chaque soin, chaque mot est une porte ouverte vers une compréhension plus profonde de vous-même.
					<br />
					<br />
					Les cartes ne prédisent pas, elles révèlent.
					<br />
					Elles offrent un éclairage, un reflet, une invitation à écouter ce que votre âme sait déjà.
					<br />
					<br />
					Je crois en la puissance des rituels, en la force de la douceur, en la magie des prises de conscience.
					<br />
					<br />
					Il suffit parfois d’un nouvel éclairage, d’un instant de présence à soi, pour sentir que tout peut devenir plus léger.
					<br />
					<br />
					Si ce voyage résonne en vous, je suis là, avec sincérité et bienveillance.
					<br />
					<br />
					Ensemble, nous marcherons sur le sentier de votre transformation, à votre rythme, avec respect et profondeur.
					<br />
					<br />
					Avec tout mon amour et ma tendresse,
					<br />
					Swin
					<br />
					Harmonessens
				</p>
			</div>
		</div>
	);
}

export default Home;
