import { useState, useEffect, useCallback } from 'react';
import { IService } from '@/models/interfaces';


// Hook para hacer fetch a una API
export default function useFetch(urlApi: string) {
    const [data, setData] = useState<IService[] | any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<null | string>(null);

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(urlApi);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.indexOf("application/json") !== -1) {
                const data = await response.json();
                setData(data);
            } else {
                throw new Error("Response is not JSON");
            }
            setLoading(false);
        } catch (error) {
            setError((error as Error).message);
            setLoading(false);
        }
    }, [urlApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const updateData = useCallback((newData: IService[]) => {
        setData(newData);
    }, []);

    return { data, loading, error, refetch: fetchData, updateData };
}