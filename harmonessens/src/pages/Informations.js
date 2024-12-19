import React from "react";
import { useParams } from "react-router-dom";
import "./Informations.css";
import InfoNav from "../components/InfoNav";

const content = {
  naturopathie: (
  <div>
    <h1>LA NATUROPATHIE</h1>
    <div className="golden-line left-aligned-line"></div>
    <div className="text-columns">
      <p>
        La naturopathie, c’est bien plus qu’une simple approche de la santé : c’est une invitation à reconnecter le corps et l’esprit dans une harmonie profonde. Elle s’appuie sur les ressources naturelles qui nous entourent pour nous aider à retrouver un équilibre, à régénérer notre énergie, et à soutenir notre bien-être global.
      </p>
      <p>
        Chaque individu est unique, et la naturopathie l’a bien compris. Elle aborde chaque situation dans sa globalité, en prenant en compte les dimensions physiques, émotionnelles et spirituelles. C’est un chemin vers la santé où l’on apprend à écouter son corps, à comprendre ses besoins et à nourrir son être intérieur avec bienveillance.
      </p>
      <p>
        À travers des pratiques douces et naturelles comme l’alimentation, les plantes, l’aromathérapie ou encore les techniques de relaxation, la naturopathie accompagne chacun dans une démarche de réharmonisation. C’est un voyage vers soi, un retour à la source, où chaque petit geste, chaque intention, a le pouvoir de transformer notre vie.
      </p>
      <p>
        Ensemble, nous ouvrons une porte vers un quotidien plus serein, où la santé n’est pas seulement l’absence de maladie, mais un état de plénitude et d’équilibre profond.
      </p>
    </div>
  </div>
  ),
  approche_chamanique: (
    <div>
      <h2>Our Services</h2>
      <ul>
        <li>Service 1: Naturopathy</li>
        <li>Service 2: Shamanic healing</li>
        <li>Service 3: Relaxation therapy</li>
      </ul>
    </div>
  ),
  rituels: (
    <div>
      <h2>Testimonials</h2>
      <p>"I had an amazing experience!" - Jane Doe</p>
      <p>"Truly life-changing." - John Smith</p>
    </div>
  ),
  cercle_mixte: (
    <div>
      <h2>Testimonials</h2>
      <p>"I had an amazing experience!" - Jane Doe</p>
      <p>"Truly life-changing." - John Smith</p>
    </div>
  ),
};

function Presentation() {
  const { section } = useParams();

  // Fallback content for unknown sections
  const sectionContent = content[section] || content["naturopathie"]
    return (
      <div className="main-div">
        <h1 className="main-title">PRESENTATION</h1>
        <InfoNav />
        {sectionContent}
      </div>
    );
  }
  
  export default Presentation;
  