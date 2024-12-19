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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            sed do eiusmod tempor incididunt ut labore et dolore magna 
            aliqua. Ut enim ad minim veniam, quis nostrud exercitation 
            ullamco laboris nisi ut aliquip ex ea commodo consequat. 
            Duis aute irure dolor in reprehenderit in voluptate velit 
            esse cillum dolore eu fugiat nulla pariatur. 
          <br />
          <br />
          Excepteur sint 
					occaecat cupidatat non proident, sunt in culpa qui officia 
					deserunt mollit anim id est laborum.
        </p>
      </div>
    </div>
  );
}

export default Home;
