import { baseURL } from "../../api";

export const getCategories = async () => {
  try {
    const response = await baseURL.get('/categories');
    return response;
  } catch (e) {
    console.error(e);
  }
}