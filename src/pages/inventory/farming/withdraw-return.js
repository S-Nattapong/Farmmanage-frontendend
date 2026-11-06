import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
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
import * as React from "react";
import axios from "axios";

const now = new Date();

const Page = () => {
  const router = useRouter();
  const { Title, Farm_id, Area, Responsible_By, Date } = router.query;
  const formattedDate = dayjs(Date).format("DD/MM/YYYY");
  console.log(
    "Title: ",
    Title,
    "Farm_id: ",
    Farm_id,
    "Area;",
    Area,
    "Responsible_By;",
    Responsible_By,
    "Date:",
    formattedDate
  );
  const [data, setData] = useState([]);
  const [page, setPage] = useState(0);

  const [value, setValue] = React.useState("เบิกของ");
  const [name, setName] = useState("วายุ กินดี");
  const [area, setArea] = useState("10");
  const [responsibility, setResponsibility] = useState("สมชาย มงคงดี");
  const [date, setDate] = useState(null);
  const [numItems, setNumItems] = useState(1); // เพิ่ม state เพื่อเก็บจำนวนของส่วนที่ต้องการเพิ่ม

  console.log("name", name, "a", area, "r", responsibility, "d", date);

  const [items, setItems] = useState([
    // เริ่มต้นด้วยสินค้าเปล่า 1 รายการ
    { resource: "", quantity: "", unit: "", supplies_count :""},
  ]);

  const [errors, setErrors] = useState(Array(items.length).fill({}));

  console.log("item: ", items);
  console.log("error: ", errors);

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    if (field === "resource") {
      // ค้นหาข้อมูลของ resource ใน data
      const selectedItem = data.find((item) => item.title === value);
      // เมื่อเจอข้อมูลให้กำหนดหน่วยให้กับรายการนี้
      if (selectedItem) {
        newItems[index].unit = selectedItem.unit;
        newItems[index].supplies_count = selectedItem.supplies_count;
      }
    }
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
        newErrors[index].resource = value ? "" : "โปรดเลือกทรัพยากร";
        break;
      case "quantity":
        newErrors[index].quantity = /^\d+$/.test(value) ? "" : "จำนวนต้องเป็นตัวเลขเท่านั้น";
        // เพิ่มเงื่อนไขเช็คว่าค่าที่ป้อนไม่เกินค่า supplies_count
        if (parseInt(value) > parseInt(items[index].supplies_count)) {
          newErrors[index].quantity = `ค่าต้องไม่เกิน ${items[index].supplies_count}`;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // ฟังก์ชันเพิ่มจำนวนของส่วนที่ต้องการเพิ่ม
  const addItem = () => {
    setItems([...items, { resource: "", quantity: "", unit: "", supplies_count: "" }]);
    setErrors([...errors, {}]);
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const columns = [
    { id: "Customer", label: "ชื่อ" },
    { id: "CreatedDate", label: "วันที่เพาะปลูก", format: (date) => format(date, "dd/MM/yyyy") },
    { id: "Area", label: "พื้นที่" },
    // { id: "ConfirmDate", label: "วันที่ใช้ของ", format: (date) => format(date, "dd/MM/yyyy") },
    { id: "Product", label: "ใช้ของ(อย่าง)" },
    { id: "ConfirmBy", label: "รับผิดชอบโดย" },

    // { id: "IconClick", label: "" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/supplies/read");
      setData(response.data);
      console.log(data, "data");
      // setFilteredData(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
    handleSearch();
  }, []);

  const initial = useRef(false);

  console.log('data',data)
  const [filteredData, setFilteredData] = useState([]);
  

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
  //         router.push("/inventory/farming/farming");
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
    const hasExceeded = items.some(
      (item) => (parseInt(item.quantity) > parseInt(item.supplies_count)&&value==="เบิกของ")
    );
    if (hasExceeded) {
      Swal.fire({
        title: "ผิดพลาด!",
        text: "มีรายการที่มีจำนวนเกินจำนวนที่มีอยู่",
        icon: "error",
      });
      return; // ออกจากฟังก์ชันเพื่อไม่ให้ดำเนินการต่อ
    }
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
            router.push("/inventory/farming/farming");
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
        const response = await axios.post("http://localhost:3000/farms_product/create", {
          farmId: Farm_id,
          title: item.resource,
          count: parseInt(item.quantity),
          unit: item.unit,
          // created_by: user ? user.username : "Unknown",
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
        <title> F.I.M | เบิก-คืน ทรัพยากร</title>
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
                  เบิก-คืน ทรัพยากร
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1}>
                <Link href={"/inventory/farming/farming"}>
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
                      (item.quantity > item.supplies_count && value==="เบิกของ") ||
                      item.resource === "" ||
                      item.quantity === "" ||
                      date === null ||
                      isNaN(item.quantity) || // ตรวจสอบว่าเป็นตัวเลข
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
                  <Grid item md={12}>
                    <Grid
                      container
                      sx={{
                        backgroundColor: "#fff",
                        width: "100%",
                        borderRadius: 1,
                        p: 2,
                        m: 0.5,
                      }}
                      spacing={1}
                    >
                      <Grid item md={3}>
                        <Box>
                          <Label sx={customStyles.h4}>ชื่อ</Label>
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
                              disabled
                              value={Title}
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
                      <Grid item md={3}>
                        <Box>
                          <Label sx={customStyles.h4}>พื้นที่</Label>
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
                              disabled
                              value={Area + "ไร่"}
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
                      <Grid item md={3}>
                        <Box>
                          <Label sx={customStyles.h4}>รับผิดชอบโดย</Label>
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
                              disabled
                              value={Responsible_By}
                              sx={{
                                height: 40,
                                // display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <MenuItem value="a">นายณัฐพงษ์</MenuItem>
                              <MenuItem value="b">นายพงษ์ณัฐ</MenuItem>
                              <MenuItem value="c">นายสิทธิโชค</MenuItem>
                            </TextField>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item md={3}>
                        <Box>
                          <Label sx={customStyles.h4}>วัน/เดือน/ปี</Label>
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
                              value={date}
                              onChange={(newValue) => setDate(newValue)}
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
                      <Grid item md={11}>
                        {items.map((item, index) => (
                          <Grid container key={index} spacing={1} sx={{ mt: 1 }}>
                            <Grid item md={3}>
                              <Box>
                                <Label sx={customStyles.h4}>เพิ่มทรัพยากรลงแปลงเพาะปลูก</Label>
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
                                    value={item.resource}
                                    error={Boolean(errors[index]?.name)}
                                    // helperText={errors[index]?.name}
                                    onChange={(e) =>
                                      handleItemChange(index, "resource", e.target.value)
                                    }
                                    sx={{
                                      height: 40,
                                      // display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    {data.map((item) => (
                                      <MenuItem key={item.supplies_id} value={item.title}>
                                        {item.title}
                                      </MenuItem>
                                    ))}
                                  </TextField>
                                </Box>
                              </Box>
                            </Grid>
                            <Grid item md={2}>
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
                                  mt: 3,
                                }}
                              ></TextField>
                            </Grid>
                            <Grid item md={2}>
                              <Box sx={{ mt: 5.5 }}>{item.unit}</Box>
                            </Grid>
                            <Grid item md={2}>
                              <Box sx={{ mt: 5.5 }}>{"มีอยู่ :" + item.supplies_count}</Box>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid>
                      <Grid
                        item
                        md={1}
                        sx={{
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <Button variant="contained" color="error" onClick={addItem} size="small">
                          +
                        </Button>
                      </Grid>
                      <Grid item md={12}>
                        <FormControl>
                          <FormLabel id="demo-controlled-radio-buttons-group">สถานะ</FormLabel>
                          <RadioGroup
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={value}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              value="เบิกของ"
                              control={<Radio color="error" />}
                              label="เบิกของ"
                            />
                            {/* <FormControlLabel
                              value="คืนของ"
                              control={<Radio color="error" />}
                              label="คืนของ"
                            /> */}
                          </RadioGroup>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* <Grid
                    item
                    md={1}
                    sx={{ display: "flex", alignItems: "flex-end", justifyContent: "center" }}
                  >
                    <Button variant="contained" color="error" onClick={addItem}>
                      +
                    </Button>
                  </Grid> */}
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
