import { NotifySuccess, NotifyError } from "./NotifyUtil";

const authHeaders = () => ({
	Authorization: `Bearer ${localStorage.getItem("adminToken")}`
});

// Fetch all services
export const GetServices = async () => {
	try {
		const response = await fetch("/api/services");

		if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
		const data = await response.json();

		if (data.success && Array.isArray(data.services)) {
			return data.services;
		} else {
			console.error("Services data is not in expected format");
			return [];
		}
	} catch (error) {
		console.error("Error fetching services:", error);
		return [];
	}
};

export const GetService = async (id) => {
	try {
		const response = await fetch(`/api/services/${id}`);
		if (!response.ok) throw new Error("Service not found");

		const serviceData = await response.json();
		if (serviceData.success) {
			return serviceData.service;
		} else {
			console.error("Error fetching service");
			return;
		}
	} catch (error) {
		console.error("Error fetching service:", error);
		return null;
	}
};

export const fetchService = async (id, setService) => {
	try {
		const service = await GetService(id);
		if (service) setService(service);
		else console.error("Service not found or error fetching");
	} catch (error) {
		console.error("Error fetching service:", error);
	}
};

export const CreateService = async (navigate, formData) => {
	try {
		const response = await fetch("/api/services", {
			method: "POST",
			headers: authHeaders(),
			body: formData,
		});

		if (!response.ok) throw new Error("Error creating service");

		NotifySuccess(navigate, "/Dashboard/services", "Service créé avec succès.");
	} catch (error) {
		NotifyError(null, null, error.message);
	}
};

export const EditService = async (navigate, formData, id) => {
	try {
		const response = await fetch(`/api/services/${id}`, {
			method: "PUT",
			headers: authHeaders(),
			body: formData,
		});

		if (!response.ok) throw new Error("Error updating service");

		NotifySuccess(navigate, "/Dashboard/services", "Service modifié avec succès.", "Succès");
	} catch (error) {
		NotifyError(null, null, error.message);
	}
};

export const RemoveService = async (navigate, id) => {
	try {
		const response = await fetch(`/api/services/${id}`, {
			method: "DELETE",
			headers: authHeaders(),
		});

		if (!response.ok) throw new Error("Error removing service");

		NotifySuccess(navigate, "/Dashboard/services", "Service supprimé avec succès.", "Succès");
	} catch (error) {
		NotifyError(null, null, error.message);
	}
};
