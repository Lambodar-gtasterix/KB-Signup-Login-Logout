// src/api/LaptopsApi/addLaptop.ts
import client from '../client';

export type AddLaptopDTO = {
  serialNumber: string;
  dealer?: string;
  model: string;
  brand: string;
  price: number;

  warrantyInYear?: number;
  processor?: string;
  processorBrand?: string;

  memoryType?: string;
  screenSize?: string;
  colour?: string;

  ram?: string;
  storage?: string;

  battery?: string;
  batteryLife?: string;

  graphicsCard?: string;
  graphicBrand?: string;

  weight?: string;
  manufacturer?: string;
  usbPorts?: number;

  /** Backend sample includes this; keep UPPERCASE */
  status?: 'ACTIVE' | 'AVAILABLE' | 'DELETED' | 'DEACTIVATE' | 'PENDING' | 'SOLD';

  /** Required */
  sellerId: number;
};

export type AddLaptopResponse = {
  status?: string;        // e.g. "SUCCESS"
  message?: string;       // e.g. "Laptop created"
  code?: string;          // e.g. "CREATED"
  statusCode?: number;    // e.g. 200/201
  timeStamp?: string;
  apiPath?: string;
  imageUrl?: string | null;
  laptopId?: number;
  [k: string]: any;
};

/**
 * Creates a new laptop listing.
 * The backend can set status automatically, but we also allow sending 'ACTIVE' per sample payload.
 */
export async function addLaptop(payload: AddLaptopDTO): Promise<AddLaptopResponse> {
  const { data } = await client.post<AddLaptopResponse>('/api/laptops/create', payload, {
    headers: { 'Content-Type': 'application/json' },
  });
  return data;
}
