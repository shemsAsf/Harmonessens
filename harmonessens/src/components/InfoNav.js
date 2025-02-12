import "./InfoNav.css";

function InfoNav() {
	return (
		<div className="circle-container">
			<div className="circle-item">
				<a href="/information/naturopathie">
					<img src="/images/FlowerLight.jpg" alt="Item 1" className="circle-image" />
				</a>
				<h3 className="circle-title">La nathuropathie</h3>
			</div>
			<div className="circle-item">
				<a href="/information/approche_chamanique">
					<img src="/images/Owl.jpg" alt="Item 2" className="circle-image" />
				</a>
				<h3 className="circle-title">Le soin chamanique</h3>
			</div>
			<div className="circle-item">
				<a href="/information/rituels">
					<img src="/images/Tambour.jpg" alt="Item 3" className="circle-image" />
				</a>
				<h3 className="circle-title">Les rituels</h3>
			</div>
		</div>
	)
}


export default InfoNav;