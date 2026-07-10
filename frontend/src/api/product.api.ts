import api from "./axios";

export const getProducts = async () =>{
    const response = await api.get("/product")
    return response.data
}

export const createProduct = async (data: any) => {
    const response = await api.post("/product", data);
    return response.data;
};

export const updateProduct = async (id: string, data: any) => {
    const response = await api.put(`/product/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
};