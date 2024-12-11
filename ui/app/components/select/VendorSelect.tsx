import { generateUUID, useMount } from "@/lib/common/util";
import { fetchVendors } from "@/network/vendor";
import { useRef, useState } from "react";

type VendorSelectProps = {
  value: string | number;
  onSelect: (value: string | number) => void;
};

function VendorSelect({ value = "", onSelect }: VendorSelectProps) {
  const idRef = useRef(generateUUID());

  const [vendors, setVendors] = useState([]);

  const getVendors = async () => {
    const vendors = await fetchVendors();

    setVendors(vendors ?? []);

    // select first vendor. Might need to change to allow none selection
    if (vendors?.length > 0) {
      const firstVendor = vendors[0];

      onSelect(firstVendor.id);
    }
  };

  useMount(() => {
    getVendors();
  });

  const vendorList = [];

  for (let i = 0; i < vendors.length; i++) {
    const { name, description, id } = vendors[i];

    vendorList.push(
      <option
        value={id}
        key={`vendor-option=${idRef}-${id}`}
      >{`${name} - ${description}`}</option>
    );
  }

  return (
    <select
      value={value}
      onChange={(event) => {
        const value = event.target.value;
        if (onSelect) {
          onSelect(value);
        }
      }}
    >
      {vendorList}
    </select>
  );
}

export default VendorSelect;
