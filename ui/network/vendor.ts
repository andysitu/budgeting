import { sendRequest } from "./util";

export interface Vendor {
  id: number;
  name: string;
  description: string;
}

export type VendorData = Omit<Vendor, "id">;

const fetchVendors = async (): Promise<Vendor[]> => {
  const result = await sendRequest("/api/vendors", "GET");
  return result;
};

const deleteVendor = async (id: number) => {
  const result = await sendRequest(`/api/vendors/${id}`, "DELETE");
  return result;
};

const createVendor = async (vendorData: VendorData): Promise<Vendor> => {
  const result = await sendRequest("/api/vendors", "POST", {
    body: JSON.stringify(vendorData),
  });
  return result;
};

export { fetchVendors, createVendor, deleteVendor };
