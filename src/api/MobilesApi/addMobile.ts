// src/api/MobilesApi/addMobile.ts
import api from '../client';

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
  sellerId: number;
};

export type AddMobileResponse = {
  code: string;
  message: string;
  mobileId?: number; // ask backend to return this
};

export async function addMobile(body: AddMobileBody): Promise<AddMobileResponse> {
  const res = await api.post<AddMobileResponse>('/api/v1/mobiles/add', body);
  return res.data;
}
