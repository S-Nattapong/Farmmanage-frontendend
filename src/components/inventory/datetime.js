import * as React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { MobileDateRangePicker } from "@mui/x-date-pickers-pro/MobileDateRangePicker";
import dayjs from "dayjs";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { Box } from "@mui/material";
import FormControl, { useFormControlContext } from "@mui/base/FormControl";

export default function SingleInputDateRangePicker({ Months }) {
 
  function getMonthNumber(monthName) {
    const monthMap = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11,
    };

    return monthMap[monthName];
  }
  const M = getMonthNumber(Months);
  const startOfMonth = dayjs().month(M).startOf("month"); // 5 คือเดือนมิถุนายน
  return (
    <Box s={{ mb: 2 }}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <MobileDateRangePicker
          defaultCalendarMonth={startOfMonth} // กำหนดค่าวันที่เริ่มต้นในเดือนมิถุนายน
          onChange={(newValue) => {
            console.log("Start Date:", newValue[0]);
            console.log("End Date:", newValue[1]);
          }}
          slots={{ field: SingleInputDateRangeField }}
          width={500}
          sx={{ width: "100%" }}
        />
      </LocalizationProvider>
    </Box>
  );
}
