import api from '../client';

export async function deleteMobile(mobileId: number): Promise<{ status: string; message: string }> {
  const { data } = await api.delete(`/api/v1/mobiles/delete/${mobileId}`);
  return data;
}
