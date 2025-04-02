import { NotifySuccess, NotifyError } from "./NotifyUtil";

export const GetServices = async () => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/services/get-services`);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`);
		}

		const data = await response.json();

		if (Array.isArray(data.services)) {
			return data.services;
		} else {
			console.error("Services data is not in the expected format");
			return [];
		}
	} catch (error) {
		console.error("Error fetching services:", error);
		return [];
	}
};

export const GetService = async (id) => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/services/get-service/${id}`);
		if (response.ok) {
			const serviceData = await response.json();
			return serviceData;
		} else {
			throw new Error('Service not found');
		}
	} catch (error) {
		alert("Error fetching service: " + error.message);
	}
};

export const fetchService = async (id, setService) => {
	try {
		const fetchedService = await GetService(id);
		if (fetchedService && fetchedService.success) {
			setService(fetchedService.service);
		} else {
			console.error("Service not found or error fetching");
		}
	} catch (error) {
		console.error("Error fetching service:", error);
	}
};


export const CreateService = async (navigate, formData) => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/services/create-service`, {
			method: 'POST',
			body: formData,
		});
		if (!response.ok) {
			throw new Error('Error creating service');
		}

		NotifySuccess(navigate, "/Dashboard/services", "service créé avec succès.")
	} catch (error) {
		NotifyError(null, null, error.message)
	}
};

export const EditService = async (navigate, formData, id) => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/services/update-service/${id}`, {
			method: 'PUT',
			body: formData,
		});
		if (!response.ok) {
			throw new Error('Error updating service');
		}
		NotifySuccess(navigate, "/Dashboard/services", "service modifié avec succès.", "Succès")
	} catch (error) {
		NotifyError(null, null, error.message)
	}
}

export const RemoveService = async (navigate, id) => {
	try {
		const response = await fetch(`${process.env.REACT_APP_API_URL}/services/remove-service/${id}`, {
			method: 'DELETE'
		});
		if (!response.ok) {
			throw new Error('Error removing service');
		}
		NotifySuccess(navigate, "/Dashboard/services", "service supprimé avec succès.", "Succès")
	} catch (error) {
		NotifyError(null, null, error.message)
	}
}