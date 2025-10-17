import client from "../client";

export type LaptopConfirmDetailsDTO = {
  price: string;
  name: string;
  phoneNumber: string;
};

type LaptopDetail = {
  laptopId: number;
  price: number;
  brand?: string;
  model?: string;
  sellerId?: number;
};

type SellerByUser = {
  sellerId: number;
  user: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    mobileNumber?: number | string;
    emailVerified?: boolean;
  };
};

/**
 * Fetches price from /api/laptops/getById?laptop_id=...
 * and name/phone from /api/v1/sellers/{userId}, then returns a merged DTO.
 */
export async function getLaptopConfirmDetailsCombined(args: {
  laptopId: number;
  userId: number;
}): Promise<LaptopConfirmDetailsDTO> {
  const { laptopId, userId } = args;

  const [laptopRes, sellerRes] = await Promise.all([
    client.get<LaptopDetail>("/api/laptops/getById", { params: { laptop_id: laptopId } }),
    client.get<SellerByUser>(`/api/v1/sellers/${userId}`),
  ]);

  const laptop = laptopRes.data;
  const seller = sellerRes.data;

  const price = laptop?.price != null ? String(laptop.price) : "";
  const first = seller?.user?.firstName ?? "";
  const last = seller?.user?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  const phoneNumber =
    seller?.user?.mobileNumber != null ? String(seller.user.mobileNumber) : "";

  return { price, name, phoneNumber };
}
