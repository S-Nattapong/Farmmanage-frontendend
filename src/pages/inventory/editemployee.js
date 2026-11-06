import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import { FormLabel, Grid, IconButton, InputAdornment, MenuItem, TextField } from "@mui/material";
import { format } from "date-fns";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import dayjs from "dayjs";
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";
import { id } from "date-fns/locale";
import { OnHandStockTableList } from "@/src/sections/table/onhand-table-list";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import axios from "axios";
import { Radio, RadioGroup, FormControlLabel } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";

const now = new Date();
const data = [
  {
    id: 1,
    product_name: "ปุ๋ย",
    add_date: "4/01/2024",
    remain_qty: "100",
    uom: "กิโลกรัม",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 2,
    product_name: "เมล็ด",
    add_date: "4/01/2024",
    remain_qty: "10",
    uom: "กระสอบ",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 3,
    product_name: "ยาฆ่าแมลง",
    add_date: "4/01/2024",
    remain_qty: "15",
    uom: "กระป๋อง",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 4,
    product_name: "ปุ๋ย2",
    add_date: "4/01/2024",
    remain_qty: "100",
    uom: "กิโลกรัม",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 5,
    product_name: "ปุ๋ย3",
    add_date: "4/01/2024",
    remain_qty: "100",
    uom: "กิโลกรัม",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 6,
    product_name: "ปุ๋ย4",
    add_date: "4/01/2024",
    remain_qty: "100",
    uom: "กิโลกรัม",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
  {
    id: 7,
    product_name: "ปุ๋ย5",
    add_date: "4/01/2024",
    remain_qty: "100",
    uom: "กิโลกรัม",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
  },
];

const useCustomers = (page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [page, rowsPerPage]);
};

const useCustomerIds = (customers) => {
  return useMemo(() => {
    return customers.map((customer) => customer.id);
  }, [customers]);
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const router = useRouter();
  const {
    Id,
    Username,
    Password,
    Confirm_password,
    First_name,
    Last_name,
    Citizen_id,
    Phonenumber,
    Role,
    Status,
    Start_date,
  } = router.query;
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const currentDate = dayjs().format("DD/MM/YYYY");
  const formattedDate = dayjs(Start_date).format("MM/DD/YYYY");

  const [firstName, setFirstName] = useState(First_name);
  const [lastName, setLastName] = useState(Last_name);
  const [idCard, setIdCard] = useState(Citizen_id);
  const [phoneNumber, setPhoneNumber] = useState(Phonenumber);
  const [username, setUsername] = useState(Username);
  const [password, setPassword] = useState(Password);
  const [confirmPassword, setConfirmPassword] = useState(Confirm_password);
  const [position, setPosition] = useState(Role);
  const [startDate, setStartDate] = useState(null);
  const [employmentStatus, setEmploymentStatus] = useState(Status);
  const [isChecked, setIsChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const columns = [
    // { id: "id", label: "#" },
    // { id: "product_code", label: "Product Code" },
    // { id: "product_no", label: "No" },
    { id: "product_name", label: "ชื่อ" },
    // { id: "lot_no", label: "LotNo" },

    { id: "remain_qty", label: "จำนวน" },
    { id: "uom", label: "หน่วย" },
    { id: "add_date", label: "วันที่เพิ่มของ" },
    { id: "ConfirmBy", label: "เพิ่มโดย" },
  ];

  useEffect(() => {
    handleSearch();
  }, []);

  const initial = useRef(false);

  const [filteredData, setFilteredData] = useState([]);
  // useEffect(() => {
  //   if (!initial.current) {
  //     getOnHandProducts().then(function (result) {
  //       setData(result.Product);
  //       setDataFilter(result.Product); // Use result.Product instead of data
  //     });
  //     initial.current = true;
  //   }
  // }, []); // Removed data from the dependency array

  const search = useInput("");

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleIdCardChange = (event) => {
    setIdCard(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleToggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleEmploymentStatusChange = (event) => {
    setEmploymentStatus(event.target.value);
  };
  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked); // เมื่อ Checkbox ถูกเปลี่ยนแปลงให้อัปเดตค่า state
  };

  console.log("Name:", firstName);
  console.log("lastName:", lastName);
  console.log("ID Card:", idCard);
  console.log("Phone Number:", phoneNumber);
  console.log("Username:", username);
  console.log("Password:", password);
  console.log("confirmPassword:", confirmPassword);
  console.log("Position:", position);
  console.log("Start Date:", startDate);

  const onFetch = () => {
    const onFilter = data.filter((item) => {
      for (const key in item) {
        console.log(String(item[key]).toLowerCase());
        if (String(item[key]).toLowerCase() == search.value.toLowerCase()) {
          return true;
        }
        // if (String(item[key]).toLowerCase() == (search.value).toLowerCase()) && (Stirng(item[key]).toLowerCase() == (search.value).toLowerCase()) {
        //   return true;
        // }
      }
      return false;
    });

    setDataFilter(onFilter);
  };

  // const handleSaveButtonClick = () => {
  //   Swal.fire({
  //     title: "ต้องการบันทึกข้อมูล ?",
  //     // text: "You won't be able to revert this!",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonColor: "green",
  //     cancelButtonColor: "red",
  //     confirmButtonText: "ใช่, บันทึก!",
  //     cancelButtonText: "ไม่, ยกเลิก!",
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       Swal.fire({
  //         title: "บันทึกสำเร็จ!",
  //         // text: "Your file has been deleted.",
  //         icon: "success",
  //       }).then(() => {
  //         // นำผู้ใช้ไปยังหน้า /inventory/employee
  //         router.push("/inventory/employee");
  //       });
  //     } else if (result.dismiss === Swal.DismissReason.cancel) {
  //       Swal.fire({
  //         title: "ไม่มีการบันทึกข้อมูล",
  //         // text: "Your imaginary file is safe :)",
  //         icon: "error",
  //       });
  //     }
  //   });
  // };

  const handleSaveButtonClick = async () => {
    Swal.fire({
      title: "ต้องการบันทึกข้อมูล ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "ใช่, บันทึก!",
      cancelButtonText: "ไม่, ยกเลิก!",
      reverseButtons: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        // แก้ไข handleSaveButtonClick1() ให้ return Promise
        const success = await handleSaveButtonClick1();
        if (success) {
          Swal.fire({
            title: "บันทึกสำเร็จ!",
            icon: "success",
          }).then(() => {
            // นำผู้ใช้ไปยังหน้า /inventory/employee
            router.push("/inventory/employee");
          });
          // handleCloseModal();
        } else {
          Swal.fire({
            title: "เกิดข้อผิดพลาดขณะรายงานปัญหา",
            text: "โปรดลองอีกครั้งในภายหลัง",
            icon: "error",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "ไม่มีการบันทึกข้อมูล",
          icon: "error",
        });
      }
    });
  };

  const handleSaveButtonClick1 = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/users/${Id}`, {
        username: username,
        password: password,
        confirm_password: confirmPassword,
        first_name: firstName,
        last_name: lastName,
        citizen_id: idCard,
        phonenumber: phoneNumber,
        role: position,
        status: employmentStatus,
        // created_by: user ? user.username : "Unknown",
      });

      if (response.status !== 200) {
        return false; // หยุดลูปและส่งค่า false เมื่อมีข้อผิดพลาด
      }

      return true; // ถ้าผ่านทุกอย่างโดยไม่มีข้อผิดพลาด
    } catch (error) {
      console.error("Error:", error);
      return false; // หากเกิดข้อผิดพลาดในการส่งคำขอ API
    }
  };

  const handleSearch = () => {
    let filteredData = [...data];
    if (search.value !== "") {
      const searchValue = search.value.toLowerCase();
      filteredData = filteredData.filter((item) => {
        return columns.some((field) => {
          const fieldValue = String(item[field.id]).toLowerCase();
          return fieldValue.includes(searchValue);
        });
      });
    }
    setFilteredData(filteredData);
  };
  console.log(filteredData, "filteredData");

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  const customStyles = {
    h4: {
      color: "#000",
    },
  };

  console.log("search", search.value);

  //style button
  const customButtonStyles = {
    ButtonCancel: {
      backgroundColor: "grey",
      color: "black",
      "&:hover": {
        backgroundColor: "darkgray",
      },
    },
    ButtonBack: {
      backgroundColor: "white",
      color: "black",
      "&:hover": {
        backgroundColor: "darkgray",
      },
    },
    ButtonSearch: {
      backgroundColor: "red",
      color: "white",
      "&:hover": {
        backgroundColor: "darkred",
      },
    },
    ButtonSave: {
      backgroundColor: "green",
      color: "white",
      "&:hover": {
        backgroundColor: "darkgreen",
      },
    },
  };

  return (
    <>
      <Head>
        <title> F.I.M | เพิ่มพนักงาน</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // backgroundImage: `url('/assets/logos/BGG.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight: "45%",
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
              sx={{ paddingTop: 3, paddingBottom: 3 }}
            >
              <Stack spacing={1}>
                <Typography variant="h4" sx={customStyles.h4}>
                  แก้ไขพนักงาน
                </Typography>
              </Stack>
              <Stack spacing={0}>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Box>
                      <Link href={"/inventory/employee"}>
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <CancelIcon />
                            </SvgIcon>
                          }
                          variant="contained"
                          sx={customButtonStyles.ButtonCancel}
                        >
                          ยกเลิก
                        </Button>
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <Box>
                      <Button
                        startIcon={
                          <SvgIcon fontSize="small">
                            <SaveIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        className="btn btn-success"
                        sx={customButtonStyles.ButtonSave}
                        onClick={handleSaveButtonClick}
                        disabled={
                          !firstName ||
                          !lastName ||
                          !idCard ||
                          !/^\d{13}$/.test(idCard) || // idCard ต้องเป็นเลข 13 หลัก
                          /^0/.test(idCard) || // ห้ามขึ้นต้นด้วย 0
                          !phoneNumber ||
                          !/^\d{10}$/.test(phoneNumber) || // phoneNumber ต้องเป็นเลข 10 หลัก
                          !username ||
                          username.length < 6 || // username ต้องมีอย่างน้อย 6 ตัว
                          !password ||
                          password.length < 6 || // password ต้องมีอย่างน้อย 6 ตัว
                          !confirmPassword ||
                          confirmPassword.length < 6 || // confirmPassword ต้องมีอย่างน้อย 6 ตัว
                          password !== confirmPassword || // password ต้องเท่ากับ confirmPassword
                          !position ||
                          !isChecked
                          //   ||
                          //   !startDate
                        }
                      >
                        บันทึก
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </Stack>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                backdropFilter: "blur(0.5px)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
              }}
            >
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 5,
                }}
              >
                <Grid container sx={{ justifyContent: "space-evenly" }}>
                  <Grid item md={12}>
                    <Grid item md={3} sx={{ marginLeft: 8 }}>
                      <FormControlLabel
                        control={<Checkbox checked={isChecked} onChange={handleCheckboxChange} />}
                        label="แก้ไข"
                      />
                    </Grid>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3, width: "100%" }}>
                    <Box>
                      <Label
                        sx={firstName ? customStyles.h4 : { ...customStyles.h4, color: "red" }}
                      >
                        {firstName ? "ชื่อ" : "ชื่อ กรุณากรอกชื่อ"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={firstName}
                          onChange={handleFirstNameChange}
                          error={!firstName}
                          disabled={!isChecked}
                          sx={{
                            height: 40,
                            // display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <Box>
                      <Label sx={lastName ? customStyles.h4 : { ...customStyles.h4, color: "red" }}>
                        {lastName ? "นามสกุล" : "นามสกุล กรุณากรอกนามสกุล"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={lastName}
                          onChange={handleLastNameChange}
                          error={!lastName}
                          disabled={!isChecked}
                          sx={{
                            // width: 100,
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <Box>
                      <Label
                        htmlFor="unnamed-select"
                        sx={{
                          ...customStyles.h4,
                          color: !/^[1-9]\d{12}$/.test(idCard) ? "red" : customStyles.h4.color,
                        }}
                      >
                        {/^[1-9]\d{12}$/.test(idCard)
                          ? "เลขบัตรประชาชน"
                          : "เลขบัตรประชาชน ต้องเป็นเลข 13 หลัก"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={idCard}
                          onChange={handleIdCardChange}
                          error={!/^[1-9]\d{12}$/.test(idCard)}
                          disabled={!isChecked}
                          sx={{
                            // width: 100,
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: "space-evenly" }}>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3, width: "100%" }}>
                    <Box>
                      <Label
                        sx={{
                          ...customStyles.h4,
                          color: !/^\d{10}$/.test(phoneNumber) ? "red" : customStyles.h4.color,
                        }}
                      >
                        {/^\d{10}$/.test(phoneNumber) ? "เบอร์โทร" : "เบอร์โทร ต้องเป็นเลข 10 หลัก"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={phoneNumber}
                          onChange={handlePhoneNumberChange}
                          error={!/^\d{10}$/.test(phoneNumber)}
                          disabled={!isChecked}
                          sx={{
                            height: 40,
                            // display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <Box>
                      <Label
                        htmlFor="unnamed-select"
                        sx={{
                          ...customStyles.h4,
                          color: username.length < 6 ? "red" : customStyles.h4.color,
                        }}
                      >
                        {username.length < 6 ? "ชื่อผู้ใช้ ต้องมีอย่างน้อย 6 ตัว" : "ชื่อผู้ใช้"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          value={username}
                          onChange={handleUsernameChange}
                          error={username.length < 6}
                          disabled={!isChecked}
                          sx={{
                            // width: 100,
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <Box>
                      <Label
                        htmlFor="unnamed-select"
                        sx={{
                          ...customStyles.h4,
                          color: password.length < 6 ? "red" : customStyles.h4.color,
                        }}
                      >
                        {password.length < 6 ? "รหัสผ่าน ต้องมีอย่างน้อย 6 ตัว" : "รหัสผ่าน"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={handlePasswordChange}
                          disabled={!isChecked}
                          sx={{
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleToggleShowPassword} edge="end">
                                  {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={password.length < 6}
                        />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                <Grid container sx={{ justifyContent: "space-evenly" }}>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3, width: "100%" }}>
                    <Box>
                      <Label
                        sx={{
                          ...customStyles.h4,
                          color: confirmPassword.length < 6 ? "red" : customStyles.h4.color,
                        }}
                      >
                        {confirmPassword.length < 6
                          ? "ยืนยันรหัสผ่าน ต้องมีอย่างน้อย 6 ตัว"
                          : "ยืนยันรหัสผ่าน"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                          disabled={!isChecked}
                          sx={{
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={handleToggleShowConfirmPassword} edge="end">
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                          error={confirmPassword.length < 6}
                        />
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <Box>
                      <Label
                        htmlFor="unnamed-select"
                        sx={{
                          ...customStyles.h4,
                          color: !position ? "red" : customStyles.h4.color,
                        }}
                      >
                        {position ? "ตำแหน่ง" : "ตำแหน่ง กรุณาเลือก"}
                      </Label>
                      <Box
                        sx={{
                          backgroundColor: "#fff",
                          borderRadius: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <TextField
                          fullWidth
                          select
                          value={position}
                          onChange={handlePositionChange}
                          disabled={!isChecked}
                          sx={{
                            height: 40,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          error={!position}
                        >
                          <MenuItem value="หัวหน้าคนงาน">หัวหน้าคนงาน</MenuItem>
                          <MenuItem value="จัดซื้อจัดจ้าง">จัดซื้อจัดจ้าง</MenuItem>
                          <MenuItem value="เจ้าของไร่">เจ้าของไร่</MenuItem>
                        </TextField>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={3} sx={{ pb: 1, marginTop: 3 }}>
                    <FormLabel id="demo-controlled-radio-buttons-group">สถานะ</FormLabel>
                    <RadioGroup
                      disabled={!isChecked}
                      row
                      value={employmentStatus}
                      onChange={handleEmploymentStatusChange}
                    >
                      <FormControlLabel value="ทำงาน" control={<Radio />} label="ทำงาน" />
                      <FormControlLabel value="เลิกจ้าง" control={<Radio />} label="เลิกจ้าง" />
                    </RadioGroup>
                  </Grid>
                </Grid>
              </Box>
            </Card>
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;

const grey = {
  50: "#f6f8fa",
  100: "#eaeef2",
  200: "#d0d7de",
  300: "#afb8c1",
  400: "#8c959f",
  500: "#6e7781",
  600: "#57606a",
  700: "#424a53",
  800: "#32383f",
  900: "#24292f",
};

const Label = styled("label")(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.85rem;
  display: block;
  margin-bottom: 4px;
  font-weight: 400;
  color: ${theme.palette.mode === "dark" ? grey[400] : grey[700]};
  `
);
