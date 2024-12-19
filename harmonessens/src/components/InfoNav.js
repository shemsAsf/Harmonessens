import "./InfoNav.css";

function InfoNav() {
	return (
		<div className="circle-container">
				<div className="circle-item">
						<a href="/information/naturopathie">
						<img src="https://i-sam.unimedias.fr/2023/02/14/naturopathie.jpg?auto=format%2Ccompress&crop=faces&cs=tinysrgb&fit=crop&h=501&w=890" alt="Item 1" className="circle-image" />
						</a>
						<h3 className="circle-title">La nathuropathie</h3>
				</div>
				<div className="circle-item">
						<a href="/information/approche_chamanique">
						<img src="https://www.terre-d-eveil.fr/wp-content/uploads/2023/05/Chamanisme.jpg" alt="Item 2" className="circle-image" />
						</a>
						<h3 className="circle-title">L'approche chamanique</h3>
				</div>
				<div className="circle-item">
						<a href="/information/rituels">
						<img src="https://medias.inrees.com/img/magazine/haut_rituelsbonssante.jpg" alt="Item 3" className="circle-image" />
						</a>
						<h3 className="circle-title">Les rituels</h3>
				</div>
			</div>
	)
}


export default InfoNav;