import React from "react";
import "../Style/Informations.css";

function Presentation() {
  return (
    <div className="main-div">
      <h1 className="main-title">PRESENTATION</h1>
      <br />
      <div className="presentation-content">
        <h2>Harmonessens – Un voyage vers l'harmonie de l’Être</h2>
        <div className="colored-line left-aligned-line"></div>
        <p className="intro-text">
          Parfois, la vie semble nous enfermer dans des schémas répétitifs, des blocages invisibles qui entravent notre épanouissement.
          Les douleurs physiques, la fatigue persistante, les émotions lourdes qui reviennent en boucle, les liens toxiques dont on peine à se libérer…
          autant de signes que quelque chose, en nous, demande à être écouté, compris et transformé.
        </p>
        <p className="intro-text">
          Ces maux trouvent souvent leur origine dans des déséquilibres profonds :
          un enracinement fragile, des mémoires transgénérationnelles non résolues,
          des blessures de l’âme qui continuent d’influencer notre quotidien.
        </p>
        <p className="intro-text">
          Mon approche est née de cette conscience :
          celle que l’Être ne peut être séparé en fragments,
          et que la véritable guérison passe par une prise en charge holistique,
          à la fois physique, émotionnelle, énergétique et spirituelle.
          C’est dans cet esprit que je vous propose un accompagnement sur-mesure,
          au travers d’outils complémentaires :
        </p>


        <div className="service-section">
          <h3 className="service-title">Mon approche holistique</h3>
          <div className="colored-line"></div>
          <br />
          <br />
          <div className="services">
            <div className="service-card" data-aos="fade-up">
              <i className="fas fa-leaf service-icon"></i>
              <h4>Naturopathie</h4>
              <p>Rétablir l’équilibre du corps et soutenir sa vitalité naturelle.</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="100">
              <i className="fas fa-heart service-icon"></i>
              <h4>Soins Chamaniques</h4>
              <p>Libérer les mémoires, apaiser les blessures de l’âme et retrouver votre pouvoir intérieur.</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="200">
              <i className="fas fa-hands-helping service-icon"></i>
              <h4>Rituels Sacrés</h4>
              <p>Honorer les passages de vie, s’aligner avec les cycles naturels et poser des intentions profondes.</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="300">
              <i className="fas fa-magic service-icon"></i>
              <h4>Massage Énergétique</h4>
              <p>Harmoniser vos centres d’énergie et libérer les tensions accumulées.</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="300">
              <i class="fa-solid fa-hand-holding-heart service-icon"></i>
              <h4>Massage d’intégration chamanique</h4>
              <p>Accompagner les grands passages de l’existence, Soutenir les transitions de vie, Ancrer ces transformations</p>
            </div>
            <div className="service-card" data-aos="fade-up" data-aos-delay="400">
              <i class="fa-solid fa-strikethrough service-icon"></i>
              <h4>Guidance par les Runes et Cartomancie</h4>
              <p>Apporter des éclairages sur votre chemin et décrypter les messages de votre inconscient.</p>
            </div>
          </div>
        </div>

        <p className="closing-text">
          Chaque séance est une invitation à écouter ce qui, en vous, appelle à être réconcilié. Vous reconnecter à votre essence, alléger vos fardeaux, et avancer avec plus de clarté et de fluidité.
        </p>
        <p className="closing-text">
          Si ces mots résonnent en vous, alors un doux chemin peut s’ouvrir. C'est avec plaisir que je vous accompagnerez dans cette exploration de vous-même, avec bienveillance et profondeur.
        </p>
      </div>
    </div>
  );
}

export default Presentation;
