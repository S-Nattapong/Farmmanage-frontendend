import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import { Grid, MenuItem, TextField } from "@mui/material";
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
import { FarmingTableList } from "@/src/sections/table/farming-table-list";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { DesktopDatePicker } from "@mui/x-date-pickers";
import Swal from "sweetalert2";
import { useRouter } from "next/router";
import axios from "axios";

const now = new Date();

const Page = () => {
  const currentDate = dayjs().format("DD/MM/YYYY");
  const router = useRouter();

  const [items, setItems] = useState([
    // เริ่มต้นด้วยสินค้าเปล่า 1 รายการ
    { name: "", quantity: null, unit: "", date: null },
  ]);

  const [errors, setErrors] = useState(Array(items.length).fill({}));

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  console.log("item: ", items);
  console.log("error: ", errors);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    validateItem(index, field, value);
  };

  const handleDateChange = (index, date) => {
    const newItems = [...items];
    newItems[index].date = date;
    setItems(newItems);
    validateItem(index, "date", date);
  };

  const validateItem = (index, field, value) => {
    const newErrors = [...errors];
    switch (field) {
      case "name":
        newErrors[index].name = value ? "" : "โปรดกรอกฟิวล์นี้";
        break;
      case "quantity":
        newErrors[index].quantity = /^\d+$/.test(value) ? "" : "จำนวนต้องเป็นตัวเลขเท่านั้น";
        break;
      case "unit":
        newErrors[index].unit = value ? "" : "โปรดเลือกหน่วย";
        break;
      case "date":
        newErrors[index].date = value ? "" : "โปรดเลือกวัน/เดือน/ปี";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const addItem = () => {
    setItems([...items, { name: "", quantity: null, unit: "", date: null }]);
    setErrors([...errors, {}]);
  };

  useEffect(() => {
    validateItem();
  }, []);

  const initial = useRef(false);

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

  const handleSaveButtonClick2 = async () => {
    const promises = items.map(async (item) => {
      try {
        const response = await axios.post("http://localhost:3000/supplies/create", {
          title: item.name,
          supplies_count: parseInt(item.quantity),
          unit: item.unit,
          created_by: user ? user.username : "Unknown",
        });

        if (response.status === 201) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        console.error("Error:", error);
        return { success: false };
      }
    });

    Promise.all(promises)
      .then((results) => {
        const allSuccess = results.every((result) => result.success);
        console.logsuccess(allSuccess, "success");
        if (allSuccess) {
          // ถ้าสำเร็จ ให้แสดงข้อความ
          Swal.fire({
            position: "center",
            icon: "success",
            title: "รายงานปัญหาสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          // ปิด Modal
          handleCloseModal();
        } else {
          // ถ้าไม่สำเร็จ ให้แสดงข้อความผิดพลาด
          handleCloseModal();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "เกิดข้อผิดพลาดขณะรายงานปัญหา",
            text: "โปรดลองอีกครั้งในภายหลัง",
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        // หากมีข้อผิดพลาดในการเชื่อมต่อ ให้แสดงข้อความผิดพลาด
        console.error("Error:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "เกิดข้อผิดพลาดขณะรายงานปัญหา",
          text: "โปรดลองอีกครั้งในภายหลัง",
          showConfirmButton: true,
        });
      });
  };

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
            router.push("/inventory/onhandstock");
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
    const promises = items.map(async (item) => {
      try {
        const response = await axios.post("http://localhost:3000/supplies/create", {
          title: item.name,
          supplies_count: parseInt(item.quantity),
          unit: item.unit,
          created_by: user ? user.username : "Unknown",
        });

        if (response.status === 201) {
          return true; // บอกให้รู้ว่าสำเร็จ
        } else {
          return false; // บอกให้รู้ว่าไม่สำเร็จ
        }
      } catch (error) {
        console.error("Error:", error);
        return false; // บอกให้รู้ว่าไม่สำเร็จ
      }
    });

    const results = await Promise.all(promises);
    // ตรวจสอบผลลัพธ์ทั้งหมดว่าสำเร็จหรือไม่
    return results.every((result) => result);
  };

  const handleHarvest = () => {
    // สร้างข้อมูลที่จะส่งไปยัง API
    const promises = items.map(async (item) => {
      try {
        const response = await axios.post("http://localhost:3000/suppiles/create", {
          title: item.name,
          supplies_count: parseInt(item.quantity),
          unit: item.unit,
          created_by: user ? user.username : "Unknown",
        });

        if (response.status === 200) {
          return { success: true };
        } else {
          return { success: false };
        }
      } catch (error) {
        console.error("Error:", error);
        return { success: false };
      }
    });

    Promise.all(promises)
      .then((results) => {
        const allSuccess = results.every((result) => result.success);
        if (allSuccess) {
          // ถ้าสำเร็จ ให้แสดงข้อความ
          Swal.fire({
            position: "center",
            icon: "success",
            title: "รายงานปัญหาสำเร็จ",
            showConfirmButton: false,
            timer: 1500,
          });
          // ปิด Modal
          // handleCloseModal();
        } else {
          // ถ้าไม่สำเร็จ ให้แสดงข้อความผิดพลาด
          // handleCloseModal();
          Swal.fire({
            position: "center",
            icon: "error",
            title: "เกิดข้อผิดพลาดขณะรายงานปัญหา",
            text: "โปรดลองอีกครั้งในภายหลัง",
            showConfirmButton: true,
          });
        }
      })
      .catch((error) => {
        // หากมีข้อผิดพลาดในการเชื่อมต่อ ให้แสดงข้อความผิดพลาด
        console.error("Error:", error);
        Swal.fire({
          position: "center",
          icon: "error",
          title: "เกิดข้อผิดพลาดขณะรายงานปัญหา",
          text: "โปรดลองอีกครั้งในภายหลัง",
          showConfirmButton: true,
        });
      });
  };

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

  //style button
  const customButtonStyles = {
    ExportButton: {
      backgroundColor: "Gainsboro",
      color: "black",
      "&:hover": {
        backgroundColor: "darkgray",
      },
    },
    PrintButton: {
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
    ButtonAdd: {
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
        <title> F.I.M | เพิ่มทรัพยากร</title>
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
                  เพิ่มทรัพยากร
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Link href={"/inventory/onhandstock"}>
                  <Button variant="contained" sx={customButtonStyles.ExportButton}>
                    ยกเลิก
                  </Button>
                </Link>
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <SaveIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={customButtonStyles.ButtonAdd}
                  onClick={handleSaveButtonClick}
                  disabled={items.some(
                    (item) =>
                      item.name === "" ||
                      item.quantity === "" ||
                      item.unit === "" ||
                      item.date === null ||
                      isNaN(item.quantity) ||
                      /![^1-9][0-9]*/.test(item.quantity)
                  )}
                >
                  บันทึก
                </Button>
              </Stack>
            </Stack>
            <Card
              sx={{
                // display: "flex",
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
                  py: 5,
                  px: 5,
                }}
              >
                <Grid container>
                  <Grid item md={11}>
                    {items.map((item, index) => (
                      <Grid
                        container
                        key={index}
                        sx={{
                          backgroundColor: "#fff",
                          border:
                            item.name === "" ||
                            item.quantity === "" ||
                            item.unit === "" ||
                            item.price === "" ||
                            item.date === null
                              ? "1px solid red"
                              : "none", // กำหนดเส้นขอบเป็นสีแดงเมื่อมีข้อผิดพลาด
                          width: "100%",
                          borderRadius: 1,
                          p: 2,
                          m: 0.5,
                        }}
                        spacing={1}
                      >
                        <Grid item md={4}>
                          <Box>
                            <Label
                              sx={{
                                ...customStyles.h4,
                                color: errors[index]?.name ? "red" : "inherit",
                              }}
                            >
                              {errors[index]?.name === "โปรดกรอกฟิวล์นี้"
                                ? "ชื่อ โปรดกรอกฟิวล์นี้"
                                : "ชื่อ"}
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
                                value={item.name}
                                error={Boolean(errors[index]?.name)}
                                // helperText={errors[index]?.name}
                                onChange={(e) => handleItemChange(index, "name", e.target.value)}
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
                        <Grid item md={4}>
                          <Box>
                            <Label
                              sx={{
                                ...customStyles.h4,
                                color: errors[index]?.quantity ? "red" : "inherit",
                              }}
                            >
                              {errors[index]?.quantity === "จำนวนต้องเป็นตัวเลขเท่านั้น"
                                ? "จำนวน ต้องเป็นตัวเลขเท่านั้น"
                                : "จำนวน"}
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
                                value={item.quantity}
                                error={Boolean(errors[index]?.quantity)}
                                // helperText={errors[index]?.quantity}
                                onChange={(e) =>
                                  handleItemChange(index, "quantity", e.target.value)
                                }
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
                        <Grid item md={4}>
                          <Box>
                            <Label
                              sx={{
                                ...customStyles.h4,
                                color: errors[index]?.unit ? "red" : "inherit",
                              }}
                            >
                              {errors[index]?.unit === "โปรดเลือกหน่วย"
                                ? "หน่วย โปรดเลือกหน่วย"
                                : "หน่วย"}
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
                                // select
                                value={item.unit}
                                error={Boolean(errors[index]?.unit)}
                                // helperText={errors[index]?.unit}
                                onChange={(e) => handleItemChange(index, "unit", e.target.value)}
                                sx={{
                                  height: 40,
                                  // display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <MenuItem value="กิโลกรัม">กิโลกรัม</MenuItem>
                                <MenuItem value="กระป๋อง">กระป๋อง</MenuItem>
                                <MenuItem value="ชิ้น">ชิ้น</MenuItem>
                                <MenuItem value="ต้น">ต้น</MenuItem>
                                <MenuItem value="อัน">อัน</MenuItem>
                                <MenuItem value="กระสอบ">กระสอบ</MenuItem>
                              </TextField>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item md={4}>
                          <Box>
                            <Label
                              sx={{
                                ...customStyles.h4,
                                color: errors[index]?.date ? "red" : "inherit",
                              }}
                            >
                              {errors[index]?.date === "โปรดเลือกวัน/เดือน/ปี"
                                ? "วันที่เพิ่มของ โปรดเลือกวัน/เดือน/ปี"
                                : "วันที่เพิ่มของ"}
                            </Label>
                            <Box
                              sx={{
                                backgroundColor: "#fff",
                                borderRadius: 1,
                                display: "flex",
                                // justifyContent: "center",
                              }}
                            >
                              <DesktopDatePicker
                                fullWidth
                                value={item.date}
                                error={Boolean(errors[index]?.date)}
                                // helperText={errors[index]?.date}
                                onChange={(date) => handleDateChange(index, date)}
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
                      </Grid>
                    ))}
                  </Grid>
                  <Grid
                    item
                    md={1}
                    sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <Button variant="contained" color="error" onClick={addItem}>
                      +
                    </Button>
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
