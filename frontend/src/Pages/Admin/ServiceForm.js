import { useState, useEffect } from "react";
import "../../Style/Form.css";
import AdminAuth from "../../Components/AdminAuth";
import { useParams, useNavigate } from "react-router-dom";
import { CreateService, EditService, fetchService, RemoveService } from "../../Utils/ServicesUtils";

const ServiceForm = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// Define state for form fields
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [length, setLength] = useState(90);
	const [price, setPrice] = useState("");
	const [allowOnline, setAllowOnline] = useState(false);
	const [isActive, setIsActive] = useState(true);
	const [image, setImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [serviceToEdit, setServiceToEdit] = useState(null);

	// Fetch service data when id is available
	useEffect(() => {
		if (id) {
			fetchService(id, setServiceToEdit)
		}
	}, [id]);

	// Prefill the form when service data is fetched
	useEffect(() => {
		if (serviceToEdit) {
			console.log("serviceToEdit", serviceToEdit);
			setTitle(serviceToEdit.title ?? "");
			setDescription(serviceToEdit.description ?? "");
			setLength(Number(serviceToEdit.length ?? 90));
			setPrice(serviceToEdit.price ?? "");
			setAllowOnline(Boolean(serviceToEdit.allowOnline));
			setIsActive(Boolean(serviceToEdit.isActive));
			setPreview(serviceToEdit.image ?? null);

			console.log("serviceToEdit:", serviceToEdit);
			console.log("title state:", title);

		}
	}, [serviceToEdit]);

	// Handle image file change
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImage(file);
		setPreview(URL.createObjectURL(file));
	};

	// Handle form submission (both create and edit)
	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("title", title);
		formData.append("description", description);
		formData.append("length", length);
		formData.append("price", price);
		formData.append("allowOnline", allowOnline ? 1 : 0);
		formData.append("isActive", isActive ? 1 : 0);
		if (image) formData.append("image", image);

		// Submit either create or edit based on serviceToEdit
		if (serviceToEdit) {
			EditService(navigate, formData, serviceToEdit.id);
		} else {
			CreateService(navigate, formData);
		}
	};

	const handleRemove = async (e) => {
		if (serviceToEdit) {
			const isConfirmed = window.confirm("Are you sure you want to remove this service?");
			if (isConfirmed) {
				RemoveService(navigate, serviceToEdit.id);
			}
		}
	};

	return (
		<AdminAuth>
			<div className="calendar-container">
				<h2>{serviceToEdit ? "Modifier un Service" : "Créer un Service"}</h2>

				<div className="form-div">
					<form onSubmit={handleSubmit} encType="multipart/form-data">
						{/* Title Field */}
						<div className="form-field">
							<input
								type="text"
								placeholder="Titre"
								value={title}
								onChange={(e) => setTitle(e.target.value)}
								required
							/>
						</div>

						{/* Description Field */}
						<div className="form-field">
							<textarea
								placeholder="Description"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								required
							/>
						</div>

						{/* Length Slider */}
						<div className="form-field">
							<label htmlFor="length">Durée : {length} min</label>
							<input
								id="length"
								type="range"
								min="30"
								max="360"
								step="30"
								value={length}
								onChange={(e) => setLength(e.target.value)}
							/>
						</div>

						{/* Price Field */}
						<div className="form-field">
							<input
								type="number"
								placeholder="Prix (€)"
								value={price}
								onChange={(e) => setPrice(e.target.value)}
								required
							/>
						</div>

						{/* Online Fields */}
						<div className="form-field">
							<label>
								<input
									type="checkbox"
									checked={allowOnline}
									onChange={(e) => setAllowOnline(e.target.checked)}
								/>
								Authoriser les rendez-vous en ligne
							</label>
						</div>

						{/* Active Fields */}
						<div className="form-field">
							<label>
								<input
									type="checkbox"
									checked={isActive}
									onChange={(e) => setIsActive(e.target.checked)}
								/>
								Active
							</label>
						</div>

						{/* Image File Upload */}
						<div className="form-field">
							<label htmlFor="file-input" className="custom-file-button">
								Choisir une Image
							</label>
							<input
								type="file"
								id="file-input"
								accept="image/*"
								onChange={handleImageChange}
							/>
							{preview && <img src={preview} alt="Preview" className="preview" />}
						</div>

						{/* Submit Button */}
						<div className="form-field">
							<button type="submit" className="submit-button">
								{serviceToEdit ? "Mettre à jour" : "Créer"} Service
							</button>
						</div>

						{/* Delete Button */}
						{serviceToEdit &&
							<div className="form-field">
								<button type="button" className="cancel-button" onClick={handleRemove}>
									Supprimer service
								</button>
							</div>
						}
					</form>
				</div>
			</div>
		</AdminAuth>
	);
};

export default ServiceForm;
