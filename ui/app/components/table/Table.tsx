import { ReactElement } from "react";

type Columns = {
  field: string;
  header: string;
  render?: (dataRow: Record<string, any>) => string | ReactElement;
};

type TableProps = {
  columns: Columns[];
  dataList: Record<string, any>[];
};

function Table({ columns = [], dataList = [] }: TableProps) {
  const renderHeader = () => {
    const headerList = [];

    for (const column of columns) {
      const header = column?.header ?? "";
      headerList.push(<th scope="col">{header}</th>);
    }

    return (
      <thead>
        <tr>{headerList}</tr>
      </thead>
    );
  };

  const renderBody = () => {
    const rows = [];

    for (const data of dataList) {
      const cells = [];

      for (const column of columns) {
        const { field, render } = column;

        if (render) {
          cells.push(<td>{render(data)}</td>);
        } else {
          cells.push(<td>{data?.[field] ?? ""}</td>);
        }
      }

      rows.push(<tr>{cells}</tr>);
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
