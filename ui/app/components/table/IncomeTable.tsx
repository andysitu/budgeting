import { useMount } from "@/lib/common/util";
import { deleteExpense, fetchExpenses } from "@/network/expense";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { forwardRef, useImperativeHandle, useState } from "react";
import Table from "./Table";
import { fetchIncome } from "@/network/income";

function IncomeTable() {
  const [income, setIncome] = useState([]);
  const [selectedIdForDelete, setSelectedIdForDelete] = useState("");

  const getIncome = async () => {
    const result = await fetchIncome();

    console.log(result);

    setIncome(result);
  };

  useMount(() => {
    getIncome();
  });

  const handleDeleteIncome = async (id: string) => {
    //
  };

  return (
    <Table
      columns={[
        { field: "name", header: "Name" },
        { field: "description", header: "Description" },
        { field: "amount", header: "Amount" },
        {
          field: "date",
          header: "Date",
          render: ({ date }) => {
            return date ? new Date(date).toLocaleString() : "";
          },
        },
        {
          field: "",
          header: "Action",
          render: ({ id }) => {
            return selectedIdForDelete === id ? (
              <div>
                <button
                  className={"icon"}
                  onClick={() => {
                    handleDeleteIncome(id);
                  }}
                >
                  <FontAwesomeIcon color="green" icon={faCheck} />
                </button>
                <button
                  className={"icon"}
                  onClick={() => {
                    setSelectedIdForDelete("");
                  }}
                >
                  <FontAwesomeIcon color="red" icon={faXmark} />
                </button>
              </div>
            ) : (
              <button
                className={"icon"}
                onClick={() => {
                  setSelectedIdForDelete(id);
                }}
              >
                <FontAwesomeIcon color="red" icon={faTrash} />
              </button>
            );
          },
        },
      ]}
      dataList={income}
    />
  );
}

export default IncomeTable;
