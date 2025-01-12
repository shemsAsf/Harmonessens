import React from "react";
import "./HomePage.css";

function Home() {
  return (
    <div className="home">
      {/* Hero Section */}
      <div className="hero">
      </div>

      {/* Activities Section */}
      <div className="activities">
        <h1 className="home-page-title">SWIN</h1>
				<div className="golden-line" id="centered-gl"></div>
        <div class="activities-text">
					<p>Naturopathie, Soins Chamaniques, Relaxation et Méditation...</p>
				</div>
      </div>

      {/* Description Section */}
      <div className="description">
        <p>
          Je suis Khadija Asfouri, naturopathe et thérapeute holistique.
          <br />
          <br />
          Je vous invite à un voyage intérieur, un espace où il est possible de se reconnecter à soi, en douceur, sans
          jugement. Mon rôle, c'est de vous accompagner à retrouver votre essence profonde, cette part de vous qui
          sait déjà comment avancer, même au milieu des tempêtes.
          <br />
          <br />
          À travers la naturopathie, les soins chamaniques, les massages énergétiques ou encore la guidance avec les
          runes, je propose des outils simples mais puissants pour vous aider à voir les choses différemment, à
          apaiser les tensions et à retrouver une forme de sérénité. Chaque personne est unique, et chaque
          accompagnement l'est aussi.
          <br />
          <br />
          Ce qui m'importe, c'est que vous puissiez trouver en vous les ressources pour traverser la vie avec plus de
          douceur. Parfois, il suffit juste d'un nouveau regard, d'un moment pour soi, pour sentir que tout peut être plus
          léger.
          <br />
          <br />
          Si vous ressentez l'élan de faire ce chemin, je suis là, avec toute ma sincérité et ma présence. Ensemble,
          nous explorerons les sentiers de votre transformation, dans le respect de votre rythme et de vos besoins.
          <br />
          <br />
          Avec tout mon amour et ma tendresse
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
