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
const data = [
  {
    id: 1,
    Customer: "อ้อย",
    CreatedDate: new Date(),
    // ConfirmDate: new Date(),
    Product: "10ป,2ต,5ย,6อ",
    ConfirmBy: "สิทธิโชค คุ้มครอง",
    Area: "20 ไร่",
  },
  {
    id: 2,
    Customer: "มะเขือเทศ",
    CreatedDate: new Date(),
    // ConfirmDate: new Date(),
    Product: "10ป,4ม,5ย,5อ",
    ConfirmBy: "เดชา เปลี่ยนวิถี",
    Area: "15 ไร่",
  },
  {
    id: 3,
    Customer: "พริก",
    CreatedDate: new Date(),
    // ConfirmDate: new Date(),
    Product: "13ป,8ม,5ย,6อ",
    ConfirmBy: "เดชา เปลี่ยนวิถี",
    Area: "20 ไร่",
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
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const currentDate = dayjs().format("DD/MM/YYYY");
  const router = useRouter();
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [date, setDate] = useState(null);
  const [data, setData] = useState([]);
  const [numItems, setNumItems] = useState(1); // เพิ่ม state เพื่อเก็บจำนวนของส่วนที่ต้องการเพิ่ม

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/read");
      const userData = response.data;

      // สร้างเซตเพื่อเก็บค่าชื่อและนามสกุลทั้งหมด
      const nameSet = new Set();

      // วนลูปผ่านข้อมูลผู้ใช้เพื่อเก็บชื่อและนามสกุลทั้งหมดลงในเซต
      userData.forEach((user) => {
       if (user.role === "หัวหน้าคนงาน" && user.status === "ทำงาน") {
         const fullName = `${user.first_name} ${user.last_name}`;
         nameSet.add(fullName);
       }
      });

      // แปลงเซตเป็นอาเรย์เพื่อนำไปใช้งาน
      const uniqueNames = Array.from(nameSet);

      console.log("Unique Names:", uniqueNames);

      setData(uniqueNames);

      // ทำสิ่งที่ต้องการกับ uniqueNames ที่มีค่าชื่อและนามสกุลที่ไม่ซ้ำกัน
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  console.log("name", name, "a", area, "r", responsibility, "d", date);

  const [items, setItems] = useState([
    // เริ่มต้นด้วยสินค้าเปล่า 1 รายการ
    { resource: "", quantity: "" },
  ]);

  const [errors, setErrors] = useState(Array(items.length).fill({}));

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
        newErrors[index].resource = value ? "" : "โปรดเลือกทรัพยากร";
        break;
      case "quantity":
        newErrors[index].quantity = /^\d+$/.test(value) ? "" : "จำนวนต้องเป็นตัวเลขเท่านั้น";
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  // ฟังก์ชันเพิ่มจำนวนของส่วนที่ต้องการเพิ่ม
  const addItem = () => {
    setItems([...items, { name: "", quantity: "" }]);
    setErrors([...errors, {}]);
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

  useEffect(() => {
    fetchData();
  }, []);

  const initial = useRef(false);
  console.log(data, "data");

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
    try {
      const response = await axios.post("http://localhost:3000/farms/create", {
        title: name,
        area: area,
        responsible_by: responsibility,
        date: date.toISOString().split("T")[0],
        status: "Active",
        phase: "Phase 1",
      });

      if (response.status === 201) {
        Swal.fire({
          title: "บันทึกสำเร็จ!",
          icon: "success",
        }).then(() => {
          // นำผู้ใช้ไปยังหน้า /inventory/farming/farming
          router.push("/inventory/farming/farming");
        });
        // บอกให้รู้ว่าสำเร็จ
        return true;
      } else {
        // บอกให้รู้ว่าไม่สำเร็จ
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      // บอกให้รู้ว่าไม่สำเร็จ
      return false;
    }
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
        <title> F.I.M | เพิ่มแปลง</title>
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
                  เพิ่มแปลงในการเพาะปลูก
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
                  disabled={
                    !name || !responsibility || !date || isNaN(area) || area.startsWith("0")
                  }
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
                          <Label sx={name ? customStyles.h4 : { ...customStyles.h4, color: "red" }}>
                            {name ? "ชื่อ" : "ชื่อ กรุณากรอกชื่อ"}
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
                              value={name}
                              error={!name}
                              onChange={(e) => setName(e.target.value)}
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
                          <Label
                            sx={{
                              ...customStyles.h4,
                              color: area && !/^\d+$/.test(area) ? "red" : customStyles.h4.color,
                            }}
                          >
                            {area && !/^\d+$/.test(area)
                              ? "พื้นที่ โปรดใส่ตัวเลขเท่านั้น"
                              : "พื้นที่"}
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
                              value={area}
                              onChange={(e) => setArea(e.target.value)}
                              error={Boolean(area && !/^\d+$/.test(area))}
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
                              select
                              value={responsibility}
                              onChange={(e) => setResponsibility(e.target.value)}
                              sx={{
                                height: 40,
                                // display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              {data.map((name, index) => (
                                <MenuItem key={index} value={name}>
                                  {name}
                                </MenuItem>
                              ))}
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
                      {/* <Grid item md={11}>
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
                                    <MenuItem value="a">ปุ๋ย</MenuItem>
                                    <MenuItem value="b">เมล็ด</MenuItem>
                                    <MenuItem value="c">ยาฆ่าแลง</MenuItem>
                                    <MenuItem value="c">อุปกรณ์เพาะปลูก</MenuItem>
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
                              <Box sx={{ mt: 5.5 }}>หน่วย</Box>
                            </Grid>
                          </Grid>
                        ))}
                      </Grid> */}
                      {/* <Grid
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
                      </Grid> */}
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
