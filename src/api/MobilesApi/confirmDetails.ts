import client from "../client";

export type ConfirmDetailsDTO = {
  price: string;
  name: string;
  phoneNumber: string;
};

type MobileDetail = {
  mobileId: number;
  price: number;
  title?: string;
  brand?: string;
  model?: string;
  yearOfPurchase?: number;
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
 * Fetches price from /mobiles/{mobileId} and
 * name/phone from /sellers/{userId}, then returns a merged DTO for the Confirm screen.
 */
export async function getConfirmDetailsCombined(args: {
  mobileId: number;
  userId: number;
}): Promise<ConfirmDetailsDTO> {
  const { mobileId, userId } = args;

  const [mobileRes, sellerRes] = await Promise.all([
    client.get<MobileDetail>(`/api/v1/mobiles/${mobileId}`),
    client.get<SellerByUser>(`/api/v1/sellers/${userId}`),
  ]);

  const mobile = mobileRes.data;
  const seller = sellerRes.data;

  const price = mobile?.price != null ? String(mobile.price) : "";
  const first = seller?.user?.firstName ?? "";
  const last = seller?.user?.lastName ?? "";
  const name = `${first} ${last}`.trim();
  const phoneNumber =
    seller?.user?.mobileNumber != null ? String(seller.user.mobileNumber) : "";

  return { price, name, phoneNumber };
}
