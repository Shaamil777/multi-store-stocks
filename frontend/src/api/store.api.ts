import api from "./axios";

export const getStores = async () => {
    const response = await api.get("/store");
    return response.data;
};

export const createStore = async (data: any) => {
    const response = await api.post("/store", data);
    return response.data;
};

export const updateStore = async (id: string, data: any) => {
    const response = await api.put(`/store/${id}`, data);
    return response.data;
};

export const deleteStore = async (id: string) => {
    const response = await api.delete(`/store/${id}`);
    return response.data;
};