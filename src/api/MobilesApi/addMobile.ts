import api from '../client';  // Axios client for making API requests
import { useAuth } from '../../context/AuthContext';  // To get userId (sellerId)

export type AddMobileBody = {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: string;
  brand: string;
  model: string;
  color: string;
  yearOfPurchase: number;
  sellerId: number; // This will be the userId from AuthContext (sellerId)
};

// Function to handle adding a mobile listing
export async function addMobile(data: AddMobileBody) {
  try {
    const response = await api.post('api/v1/mobiles/add', data);
    return response.data; // Return the response data (e.g., success message or mobile listing)
  } catch (error) {
    console.error('Error adding mobile:', error);
    throw error; // Rethrow or handle error
  }
}
