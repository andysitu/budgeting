import { VendorData } from "@/app/components/dialog/AddVendorDialog";
import { getConfiguration } from "./util";
import { sendFetch } from "@/lib/common/util";

const fetchVendors = async () => {
  const requestParam = getConfiguration("GET");

  const result = await sendFetch("/api/vendors", requestParam);

  return result.json();
};

const deleteVendor = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await sendFetch(`/api/vendors/${id}`, requestParam);

  return result;
};

const createVendor = async (vendorData: VendorData) => {
  const requestParam = getConfiguration("POST");

  const result = await sendFetch("/api/vendors", {
    body: JSON.stringify(vendorData),
    ...requestParam,
  });

  return result.json();
};

export { fetchVendors, createVendor, deleteVendor };
