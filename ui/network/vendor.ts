import { VendorData } from "@/app/components/dialog/AddVendorDialog";
import { sendRequest } from "./util";

const fetchVendors = async () => {
  const result = await sendRequest("/api/vendors", "GET");
  return result;
};

const deleteVendor = async (id: string) => {
  const result = await sendRequest(`/api/vendors/${id}`, "DELETE");
  return result;
};

const createVendor = async (vendorData: VendorData) => {
  const result = await sendRequest("/api/vendors", "POST", {
    body: JSON.stringify(vendorData),
  });
  return result;
};

export { fetchVendors, createVendor, deleteVendor };
