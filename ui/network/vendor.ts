import { VendorData } from "@/app/components/dialog/AddVendorDialog";
import { getConfiguration } from "./util";

const fetchVendors = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/vendors", requestParam);

  return result.json();
};

const deleteVendor = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/vendors/${id}`, requestParam);

  return result;
};

const createVendor = async (vendorData: VendorData) => {
  const requestParam = getConfiguration("POST");

  const result = await fetch("/api/vendors", {
    body: JSON.stringify(vendorData),
    ...requestParam,
  });

  return result.json();
};

export { fetchVendors, createVendor, deleteVendor };
