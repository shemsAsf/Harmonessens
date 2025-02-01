export const ClientCheck = async (formData, setupModal) => {
    const queryParams = new URLSearchParams({ email: formData.email }).toString();
    try {
        const clientResponse = await fetch(`${process.env.REACT_APP_API_URL}/clients/client-exist?${queryParams}`);
        const clientData = await clientResponse.json();

        if (!clientResponse.ok || !clientData.success) {
            throw new Error(clientData.message || "Unknown error checking client existence.");
        }

        const newClientId = clientData.found ? clientData.client.id : await CreateNewClient(formData);

        if (newClientId === null) {
            throw new Error(clientData.message || "Unknown error creating new client.");
        }

        if (clientData.found) {
            await CheckForDifferences(formData, clientData.client, setupModal)
        }

        return newClientId;

    } catch (error) {
        console.error("Error in ClientCheckForConfirmation:", error.message);
        return null;
    }
};

const CreateNewClient = async (formData) => {
    try {
        const createClientResponse = await fetch(`${process.env.REACT_APP_API_URL}/clients/create-client`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        const createClientData = await createClientResponse.json();
        if (!createClientResponse.ok) {
            throw new Error(`Error: ${createClientData.message || "Failed to create client"}`);
        }

        return createClientData.success ? createClientData.clientId : null;

    } catch (error) {
        console.error("Error creating client:", error.message);
        return null;
    }
};

const CheckForDifferences = async (formData, client, setupModal) => {
    return new Promise((resolve) => {
        const fields = [
            { field: "Prénom", oldValue: client.first_name, newValue: formData.firstName },
            { field: "Nom", oldValue: client.last_name, newValue: formData.lastName },
            { field: "Numéro de Téléphone", oldValue: client.phone, newValue: formData.phone },
        ];
        const diffs = fields.filter((f) => f.oldValue?.trim() !== f.newValue?.trim());

        if (diffs.length > 0) {
            setupModal(diffs, resolve, client.id);
        } else {
            resolve({ error: false });
        }
    }).then(result => {
        if (result.error) {
            console.error(result.message);
            return false;
        }
        return true;
    }).catch(error => {
        console.error('Error in checkForDifferences:', error);
        return false;
    });
};

export const UpdateClient = async (clientId, formData) => {
    const updateClientRequestData = {
        id: clientId,
        ...formData,
    }
    try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/clients/update-client`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateClientRequestData),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(`Error: ${data.message || "Failed to update client information."}`);
        }

        return data.success ? data.clientId : null

    } catch (error) {
        console.error("Error updating client information:", error.message);
        return null;
    }
};