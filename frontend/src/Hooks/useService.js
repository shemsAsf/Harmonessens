import { useEffect, useState } from "react";
import { GetService } from "../Utils/ServicesUtils";

const useService = (id) => {
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        const fetchService = async () => {
            try {
                setLoading(true);
                const fetchedService = await GetService(id);
                if (fetchedService?.success) {
                    setService(fetchedService.service);
                } else {
                    throw new Error("Service not found or error fetching");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [id]);

    return { service, loading, error };
};

export default useService;
