import { SvgIcon, Stack } from "@mui/material";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArticleIcon from "@mui/icons-material/Article";
import FilterCenterFocusIcon from "@mui/icons-material/FilterCenterFocus";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowCircleRightRoundedIcon from "@mui/icons-material/ArrowCircleRightRounded";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import { useRouter } from "next/router";
import React from "react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import AddHomeIcon from "@mui/icons-material/AddHome";

const customIconStyle = {
  // fontSize: 'medium', // ขนาดไอคอน
  // ...(active && {
  //   color: '#C53405' // red
  // }),
  // ...(disabled && {
  //   color: '#86909D'
  // })
};

const getMenuItemsByRole = () => {
  let menuItems = [];

  if (typeof window !== "undefined") {
    // ตรวจสอบให้แน่ใจว่าโค้ดดำเนินการในส่วนของ client-side rendering (CSR) เท่านั้น
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { role: "default" };

    switch (user.role) {
      case "เจ้าของไร่":
        menuItems = [
          {
            title: "ทรัพยากรทั้งหมด",
            path: "/inventory/onhandstock",
            icon: (
              <SvgIcon style={customIconStyle}>
                <InventoryIcon />
              </SvgIcon>
            ),
          },
          {
            title: "การเพาะปลูก",
            path: "/inventory/farming/farming",
            icon: (
              <SvgIcon style={customIconStyle}>
                <FitScreenIcon />
              </SvgIcon>
            ),
          },
          {
            title: "พนักงาน",
            path: "/inventory/employee",
            icon: (
              <SvgIcon style={customIconStyle}>
                <ArticleIcon />
              </SvgIcon>
            ),
          },
        ];
        break;
      case "จัดซื้อจัดจ้าง":
        menuItems = [
          {
            title: "ทรัพยากรทั้งหมด",
            path: "/inventory/onhandstock",
            icon: (
              <SvgIcon style={customIconStyle}>
                <InventoryIcon />
              </SvgIcon>
            ),
          },
          {
            title: "เพิ่มทรัพยากร",
            path: "/inventory/addproduct",
            icon: (
              <SvgIcon style={customIconStyle}>
                <AddHomeIcon />
              </SvgIcon>
            ),
          },
        ];
        break;
      case "หัวหน้าคนงาน":
        menuItems = [
          {
            title: "ทรัพยากรทั้งหมด",
            path: "/inventory/onhandstock",
            icon: (
              <SvgIcon style={customIconStyle}>
                <InventoryIcon />
              </SvgIcon>
            ),
          },
          {
            title: "การเพาะปลูก",
            path: "/inventory/farming/farming-em",
            icon: (
              <SvgIcon style={customIconStyle}>
                <FitScreenIcon />
              </SvgIcon>
            ),
          },
        ];
        break;
      default:
        break;
    }
  }

  return menuItems;
};


export const items = getMenuItemsByRole()
// [
//   {
//     title: "ทรัพยากรทั้งหมด",
//     path: "/inventory/onhandstock",
//     icon: (
//       <SvgIcon style={customIconStyle}>
//         <InventoryIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "เพิ่มทรัพยากร",
//     path: "/inventory/addproduct",
//     icon: (
//       <SvgIcon style={customIconStyle}>
//         <AddHomeIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "การเพาะปลูก",
//     path: "/inventory/farming/farming",
//     icon: (
//       <SvgIcon style={customIconStyle}>
//         <FitScreenIcon />
//       </SvgIcon>
//     ),
//   },
//   {
//     title: "พนักงาน",
//     path: "/inventory/employee",
//     icon: (
//       <SvgIcon style={customIconStyle}>
//         <ArticleIcon />
//       </SvgIcon>
//     ),
//   },
  
// ];
