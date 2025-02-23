import React from "react";
import { useParams } from "react-router-dom";
import InfoNav from "../Components/InfoNav/InfoNav";
import "../Style/Informations.css";

const content = {
  naturopathie: (
  <div>
    <h1>LA NATUROPATHIE</h1>
    <div className="colored-line left-aligned-line"></div>
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
      <h1>L'APPROCHE CHAMANIQUE</h1>
      <div className="colored-line left-aligned-line"></div>
      <div className="text-columns">
        <p>Se reconnecter à l’essentiel</p>
        <p>Depuis toujours, l’humanité a cherché à comprendre ce qui l’unit au monde, ce qui l’éloigne de son essence et ce qui la ramène à elle-même. Le chamanisme, dans sa sagesse ancestrale, nous invite à explorer ce lien invisible qui relie le corps, l’âme, et l’univers. Il nous rappelle que la vie est un voyage fait de passages, d’équilibres à trouver, de blessures à guérir et de liens à tisser</p>
        <p>Chaque étape de ce voyage nous façonne. Parfois, certaines mémoires, qu’elles soient personnelles ou familiales, alourdissent nos pas. D’autres fois, des blessures enfouies ou des déséquilibres profonds créent des ruptures en nous. Le chemin de la guérison passe par cette reconnexion à soi, par l’alignement entre notre lumière et nos ombres, entre notre féminin et notre masculin, entre l’intime et l’universel.</p>
        <p>Dans cet espace, le son devient un langage universel. Les vibrations d’un tambour, d’un bol ou d’un chant ne touchent pas seulement nos oreilles, mais résonnent avec notre être tout entier, réajustant ce qui a perdu son harmonie. Elles nous guident doucement vers ce sentiment de paix intérieure que nous cherchons tous.</p>
        <p>Et parce que la vie est faite de transitions, chaque passage – une naissance, un deuil, un changement profond – peut devenir un rituel sacré. Ces instants, honorés avec intention, nous reconnectent à la beauté de la vie dans toute sa complexité.</p>
        <p>Nous ne sommes jamais seuls sur ce chemin. Nous appartenons à une grande toile d’âmes, où la guérison de l’un éclaire celle des autres. Ensemble, nous portons la responsabilité et la joie de créer un monde plus aligné, où chacun trouve sa juste place.</p>
        <p>Le chamanisme n’est pas une solution immédiate ou une promesse de miracle. C’est une invitation à se rencontrer soi-même, à explorer, à ressentir, et à transformer. Si tu ressens cet appel, je suis là pour marcher à tes côtés dans ce voyage.</p>
      </div>
    </div>
  ),
  rituels: (
    <div>
      <h1>À LA LUMIÈRE DE LA LUNE :</h1>
      <div className="colored-line left-aligned-line"></div>
      <div className="text-columns">
        <p>Une invitation à se reconnecter à soi, aux autres et au grand tout</p>
        <p>Depuis toujours, la Lune nous guide, avec sa douce lumière et son cycle éternel. Chaque Nouvelle Lune et chaque Pleine Lune sont des rendez-vous puissants pour ralentir, écouter nos besoins profonds et poser nos intentions dans la matière.</p>
        <p>Je te propose un moment pour honorer ces phases lunaires, mais aussi les grands passages de l’année que sont les équinoxes et les solstices. Ces rendez-vous avec la nature nous rappellent que ce qui se passe dans le monde extérieur résonne avec ce qui se joue à l’intérieur de nous.</p>
        <p>Les équinoxes, moments d’équilibre parfait entre le jour et la nuit, marquent des transitions importantes : l’arrivée du printemps pour semer, renaître, et celle de l’automne pour récolter, laisser partir ce qui n’est plus nécessaire. Ils nous invitent à retrouver notre propre équilibre, à explorer comment l’harmonie entre lumière et ombre peut nourrir notre chemin.</p>
        <p>Les solstices, instants d’extrême lumière ou de profonde obscurité, célèbrent les cycles de la vie : le solstice d’été, avec son abondance et sa vitalité, est une ode à la joie et à l’expression ; le solstice d’hiver, lui, nous invite au repli, à l’introspection, et à préparer les germes du renouveau. Ces moments clés nous rappellent que nous sommes en perpétuelle transformation, tout comme la nature qui nous entoure.</p>
        <p>Au-delà de ces rituels, il y a une invitation à se souvenir que nous faisons partie d’un grand tout. Chaque fois que nous nous relions à la nature, à la Lune ou aux cycles de la Terre, nous nous connectons aussi à une force plus grande que nous. Cette connexion nous offre des leçons d’humilité, mais aussi un profond réconfort, car elle nous rappelle que nous ne sommes jamais seuls.</p>
        <p>En participant à ces cercles, tu rejoins une âme-groupe, un espace de partage et de soutien mutuel, où chacun est accueilli tel qu’il est. Ce simple acte de se relier aux autres et à l’univers peut transformer en profondeur notre monde intérieur, nous donnant force, clarté et équilibre.</p>
        <p>Ces rituels lunaires et saisonniers sont des invitations à :</p>
        <ul><li>Te recentrer et prendre soin de toi Prendre conscience des liens profonds entre la nature et ton propre rythme intérieur</li>
        <li>Déposer dans la matière tes intentions et accueillir tes transformations</li></ul>
        <p>Fréquence : deux fois par mois (Nouvelle Lune et Pleine Lune) + solstices et équinoxes</p>
        <p>Tarif : participation libre et consciente</p>
        <p>Rejoins-moi pour ces rendez-vous sacrés, où l’on honore les cycles de la Lune, de la Terre et de la vie elle-même. Ensemble, connectons-nous à cette sagesse ancienne et retrouvons notre place dans le grand tout.</p>
      </div>
      
      <h1>UN CERCLE MIXTE :</h1>
      <div className="colored-line left-aligned-line"></div>
      <div className="text-columns">
        <p>À la rencontre du féminin et du masculin en nous</p>
        <p>Et si je te proposais un moment rien que pour toi ? Un espace sacré, où tu peux déposer ce qui t’habite, explorer ce qui t’inspire et te connecter à des ressources parfois insoupçonnées.</p>
        <p>Je t’invite à un cercle mixte, un rendez-vous bienveillant et convivial où hommes et femmes se rencontrent pour échanger, s’écouter et se découvrir. Dans cet espace, je serai là pour t’accompagner, pour guider ce moment, afin que chacun trouve les clés qui lui parlent et les mots qui résonnent en soi.</p>
        <p>Nous portons tous en nous le féminin et le masculin, non comme des opposés, mais comme deux forces qui cohabitent, se complètent et nous enrichissent. Prendre conscience de leur présence, apprendre à puiser dans leur équilibre, c’est s’offrir une nouvelle lecture de soi et des autres.</p>
        <p>Parfois, une rencontre, un mot ou un partage suffit pour éclairer une part de nous que nous n’avions pas encore explorée. Ce cercle est une invitation à honorer ce dialogue intérieur et à le nourrir à travers la richesse des échanges avec l’autre.</p>
        <p>Durée : 2 heures</p>
        <p>Fréquence : une fois par mois</p>
        <p>Tarif : participation libre et consciente</p>
        <p>Je t’accompagnerai dans cet espace, où il n’y a rien à prouver, juste une opportunité d’être pleinement toi-même et de te laisser toucher par la magie des rencontres authentiques.</p>
      </div>
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
  