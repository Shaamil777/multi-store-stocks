import api from "./axios";

export const getStocks = async () => {
    const response = await api.get("/stock");
    return response.data;
};

export const createStock = async (data: { product: string; store: string; quantity: number }) => {
    const response = await api.post("/stock", data);
    return response.data;
};

export const adjustStock = async (data: { product: string; store: string; type: "add" | "remove"; quantity: number }) => {
    const response = await api.patch("/stock/adjust", data);
    return response.data;
};
