// src/api/LaptopsApi/deleteLaptop.ts
import client from '../client';

export async function deleteLaptop(laptopId: number) {
  const res = await client.delete('/api/laptops/delete', {
    params: { laptopId },
  });
  return res.data;
}
