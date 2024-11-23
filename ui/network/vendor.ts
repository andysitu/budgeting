import { VendorData } from "@/app/components/dialog/AddVendorDialog";
import { getConfiguration } from "./util";

const fetchVendors = async () => {
  const requestParam = getConfiguration("GET");

  const result = await fetch("/api/vendor", requestParam);

  return result.json();
};

const deleteVendor = async (id: string) => {
  const requestParam = getConfiguration("DELETE");

  const result = await fetch(`/api/vendor/${id}`, requestParam);

  return result;
};

const createVendor = async (vendorData: VendorData) => {
  const requestParam = getConfiguration("POST");

  const result = await fetch("/api/vendor", {
    body: JSON.stringify(vendorData),
    ...requestParam,
  });

  return result.json();
};

export { fetchVendors, createVendor, deleteVendor };
