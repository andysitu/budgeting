import { generateUUID } from "@/lib/common/util";
import { ReactElement, useRef } from "react";

export type Columns<T extends Record<string, any>> = {
  field: string;
  header: string;
  render?: (dataRow: T) => string | ReactElement;
};

type TableProps<T extends Record<string, any>> = {
  columns: Columns<T>[];
  dataList: T[];
  renderInnerTable?: (data: T) => string | ReactElement;
};

function Table<T extends Record<string, any>>({
  columns = [],
  dataList = [],
  renderInnerTable,
}: TableProps<T>) {
  // Use uuid as key for now
  const idRef = useRef(generateUUID());

  const renderHeader = () => {
    const headerList = [];

    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      const header = column?.header ?? "";
      headerList.push(
        <th scope="col" key={`${idRef.current}_col_${i}`}>
          {header}
        </th>
      );
    }

    return (
      <thead>
        <tr>{headerList}</tr>
      </thead>
    );
  };

  const renderBody = () => {
    const rows = [];

    for (let i = 0; i < dataList.length; i++) {
      const data = dataList[i];

      const cells = [];

      for (let j = 0; j < columns.length; j++) {
        const column = columns[j];

        const { field, render } = column;

        const key = `${idRef.current}_cell_${i}_${j}`;

        if (render) {
          cells.push(<td key={key}>{render(data)}</td>);
        } else {
          cells.push(<td key={key}>{data?.[field] ?? ""}</td>);
        }
      }

      rows.push(<tr key={`${idRef.current}_row_${i}`}>{cells}</tr>);

      if (renderInnerTable) {
        rows.push(
          <tr key={`${idRef.current}_inner_table${i}`}>
            <td colSpan={columns.length}>{renderInnerTable(data)}</td>
          </tr>
        );
      }
    }

    return <tbody>{rows}</tbody>;
  };

  return (
    <table>
      {renderHeader()}
      {renderBody()}
    </table>
  );
}

export default Table;
