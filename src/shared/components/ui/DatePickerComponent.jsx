import { useState, useRef, useEffect } from "react";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { BsCalendar2DateFill } from "react-icons/bs";
import dayjs from "dayjs";

const DatePicker = ({ setFilter }) => {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const ref = useRef();

  // Close picker when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item) => {
    const { startDate, endDate } = item.selection;
  
    if (startDate && endDate) {
      let start = startDate;
      let end = endDate;
        if (dayjs(start).isAfter(dayjs(end))) {
        [start, end] = [end, start];
      }
  
      setRange([{ startDate: start, endDate: end, key: "selection" }]);
  
      setFilter({
        start_date: dayjs(start).format("YYYY-MM-DD"),
        end_date: dayjs(end).format("YYYY-MM-DD"),
      });
    }
  };
  
  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      {/* Input with calendar icon */}
      <div
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between px-3 py-2 w-64 border border-gray-300 rounded-lg shadow-sm bg-gray-200 cursor-pointer hover:border-gray-400"
      >
        <span className="text-sm text-gray-700">
          {dayjs(range[0].startDate).format("MMM DD, YYYY")} -{" "}
          {dayjs(range[0].endDate).format("MMM DD, YYYY")}
        </span>
        <BsCalendar2DateFill className="text-blue-500" />
      </div>

      {/* Date Range Picker */}
      {open && (
        <div className="absolute left-0 top-12 z-50 shadow-lg border rounded-lg bg-white">
          <DateRange
            editableDateInputs={true}
            onChange={handleSelect}
            moveRangeOnFirstSelection={false}
            ranges={range}
            months={1}
            direction="horizontal"
          />
        </div>
      )}
    </div>
  );
};

export default DatePicker;
