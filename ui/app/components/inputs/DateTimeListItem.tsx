import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ListItem from "./ListItem";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";

interface DateTimeListItemProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "value"
> {
  label: string;
  dateString: string;
  timeString: string;
  onChangeTime: (value: string) => void;
  onChangeDate: (value: string) => void;
  // For rest of props going to input
  [key: string]: any;
}

function DateTimeListItem({
  label,
  dateString,
  timeString,
  onChangeDate,
  onChangeTime,
}: DateTimeListItemProps) {
  const setToToday = () => {
    const today = new Date().toISOString();
    onChangeDate(today.split("T")[0]);
    onChangeTime(today.split("T")[1].split(".")[0]);
  };
  return (
    <ListItem
      label={
        <div>
          {label}
          <button
            className={"icon"}
            style={{ height: "28px", width: "28px" }}
            onClick={(e) => {
              e.preventDefault();
              setToToday();
            }}
          >
            <FontAwesomeIcon icon={faCalendarDay} />
          </button>
        </div>
      }
      containerStyle={{ alignItems: "center" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <input
          type="date"
          value={dateString}
          onChange={(e) => {
            onChangeDate(e.target.value);
          }}
          style={{ width: "42%" }}
        />
        <input
          type="time"
          value={timeString}
          onChange={(e) => {
            onChangeTime(e.target.value);
          }}
          style={{ width: "42%" }}
        />
      </div>
    </ListItem>
  );
}

export default DateTimeListItem;
