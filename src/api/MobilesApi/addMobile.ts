import api from '../client';

export type AddMobileBody = {
  title: string;
  description: string;
  price: number;
  negotiable: boolean;
  condition: string;   // "NEW" | "USED"
  brand: string;
  model: string;
  color: string;
  yearOfPurchase: number;
  sellerId: number;
};

export type AddMobileResponse = {
  code: string;        // "200" in JSON per swagger (HTTP may be 200 or 201)
  message: string;
  mobileId?: number;   // now provided on success
};

export async function addMobile(body: AddMobileBody): Promise<AddMobileResponse> {
  const res = await api.post<AddMobileResponse>('/api/v1/mobiles/add', body);
  return res.data;
}
