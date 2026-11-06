import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import { Grid, Modal, TextField, Autocomplete } from "@mui/material";
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
import { useRouter } from "next/router";
import { FarmingReportTableList } from "@/src/sections/table/farming-report-table-list";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers";
import HeightIcon from "@mui/icons-material/Height";
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

  const currentDate = dayjs().format("DD/MM/YYYY");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reportText, setReportText] = useState(""); // เก็บข้อความที่เราจะรายงาน
  const [reportDate, setReportDate] = useState(null); // วันที่เราจะรายงาน
  const [data, setData] = useState([]);
  // console.log(reportDate.toISOString().split("T")[0]);

  const handleReportTextChange = (event) => {
    setReportText(event.target.value);
  };

  const handleReportDateChange = (date) => {
    setReportDate(date);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    // { id: "id", label: "#" },
    // { id: "product_code", label: "Product Code" },
    // { id: "product_no", label: "No" },
    { id: "title", label: "ชื่อ" },
    // { id: "lot_no", label: "LotNo" },

    { id: "COUNT", label: "จำนวน" },
    { id: "unit", label: "หน่วย" },
    { id: "created_at", label: "วันที่เพิ่มของ" },
    // { id: "ConfirmBy", label: "เพิ่มโดย" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/farms_product/read/${Farm_id}`);
      setData(response.data);
      console.log(data, "data");
      setFilteredData(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
    handleSearch();
  }, []);

  const handleWithdrawReturnButtonClick = () => {
    router.push(
      `/inventory/farming/withdraw-return-employee?Title=${Title}&Farm_id=${Farm_id}&Area=${Area}&Responsible_By=${Responsible_By}&Date=${Date}`
    );
  };

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
    ExportButton: {
      backgroundColor: "white",
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
    ButtonSave: {
      backgroundColor: "green",
      color: "white",
      "&:hover": {
        backgroundColor: "darkgreen",
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

  // const handleHarvest = () => {
  //   Swal.fire({
  //     position: "center",
  //     icon: "success",
  //     title: "รายงานปัญหาสำเร็จ",
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  //   handleCloseModal();

  // };

  const handleHarvest = () => {
    // สร้างข้อมูลที่จะส่งไปยัง API
    const requestBody = {
      title: Title, // ใช้ตัวแปร Customer ที่ได้จาก router.query
      description: reportText,
      date: reportDate.toISOString().split("T")[0], // แปลงวันที่เป็น ISO string และตัดออกเพื่อให้เหลือแค่ YYYY-MM-DD
      farm_id: Farm_id,
    };

    // ส่งข้อมูลผ่าน fetch()
    fetch("http://localhost:3000/reports/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        // ตรวจสอบสถานะการตอบกลับ
        if (response.ok) {
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

  return (
    <>
      <Head>
        <title> F.I.M | การเพาะปลูก(เขียนรายงาน)</title>
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
                  การเพาะปลูก(เขียนรายงาน)
                </Typography>
              </Stack>
              <Stack spacing={0}>
                <Grid container spacing={2}>
                  <Grid item md={4}>
                    <Box>
                      <Link href={"/inventory/farming/farming-em"}>
                        <Button
                          startIcon={
                            <SvgIcon fontSize="small">
                              <ArrowBackIcon />
                            </SvgIcon>
                          }
                          variant="contained"
                          sx={{ ...customButtonStyles.ButtonCancel, width: 120 }}
                        >
                          กลับ
                        </Button>
                      </Link>
                    </Box>
                  </Grid>
                  <Grid item md={4}>
                    <Box>
                      <Button
                        startIcon={
                          <SvgIcon fontSize="small">
                            <AddIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        sx={{ ...customButtonStyles.ButtonSave, width: 120 }}
                        onClick={handleOpenModal}
                      >
                        รายงาน
                      </Button>
                    </Box>
                  </Grid>
                  <Grid item md={4}>
                    <Box>
                      <Button
                        startIcon={
                          <SvgIcon fontSize="small">
                            <HeightIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        onClick={handleWithdrawReturnButtonClick}
                        sx={{ ...customButtonStyles.ButtonAdd, width: 120 }}
                      >
                        เบิก-คืน
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
                height: "15vh",
                backdropFilter: "blur(0.5px)",
                backgroundColor: "rgba(0, 0, 0, 0.2)",
                borderRadius: 0,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              }}
            >
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 5,
                }}
              >
                <Grid container spacing={0} sx={{ justifyContent: "space-evenly" }}>
                  <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
                    <Box>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        ชื่อ
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
                          disabled
                          fullWidth
                          id="outlined-disabled"
                          defaultValue={Title}
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
                  <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
                    <Box>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        วันที่เพาะปลูก
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
                          disabled
                          fullWidth
                          id="outlined-disabled"
                          defaultValue={formattedDate}
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
                  <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
                    <Box>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        พื้นที่
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
                          disabled
                          fullWidth
                          id="outlined-disabled"
                          defaultValue={Area + "ไร่"}
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
                  {/* <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
                    <Box>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        ใช้ทรัพยากร
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
                          disabled
                          fullWidth
                          id="outlined-disabled"
                          defaultValue={"10ป,2ต,5ย,6อ"}
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
                  </Grid> */}
                  <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
                    <Box>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        รับผิดชอบโดย
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
                          disabled
                          fullWidth
                          id="outlined-disabled"
                          defaultValue={Responsible_By}
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
              </Box>
            </Card>
            <Box sx={{ paddingTop: 0 }}>
              <FarmingReportTableList columns={columns} items={filteredData} />
            </Box>
            <Box>
              {/* <ReportModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
              <Modal
                open={isModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80%",
                    maxWidth: 600,
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "background.paper",
                      p: 4,
                      borderRadius: 1,
                      textAlign: "left",
                      m: 3,
                    }}
                  >
                    <Typography id="modal-title" variant="h5" component="h2" gutterBottom>
                      เขียนรายงานที่พบ
                    </Typography>
                    {/* <Typography id="modal-description" variant="body1" gutterBottom>
            การดำเนินการนี้จะทำให้ข้อมูลถูกย้ายไปยังขั้นตอนการเก็บเกี่ยว
          </Typography> */}
                    <Box sx={{ my: 3 }}>
                      <Grid container spacing={1}>
                        <Grid item md={7}>
                          <Label>รายงาน</Label>
                          <TextField
                            fullWidth
                            value={reportText}
                            onChange={handleReportTextChange}
                            multiline // เพิ่ม prop multiline เพื่อให้สามารถใส่ข้อความหลายบรรทัดได้
                            rows={6} // กำหนดจำนวนบรรทัดที่ต้องการให้แสดง
                            sx={{ height: 150 }} // สามารถกำหนดสไตล์เพิ่มเติมได้ตามต้องการ
                          />
                        </Grid>
                        <Grid item md={5}>
                          <Grid container>
                            <Grid item md={12}>
                              <Label htmlFor="unnamed-select">วันที่เขียนรายงาน</Label>
                              <Box
                                sx={{
                                  // backgroundColor: "#fff",
                                  borderRadius: 1,
                                  display: "flex",
                                  // justifyContent: "center",
                                }}
                              >
                                <DatePicker
                                  fullWidth
                                  value={reportDate}
                                  onChange={handleReportDateChange}
                                  sx={{
                                    height: 55,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#fff",
                                    borderRadius: 1,
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item md={12} sx={{ mt: 1.5 }}>
                              <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                                รับผิดชอบโดย
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
                                  disabled
                                  fullWidth
                                  id="outlined-disabled"
                                  defaultValue={Responsible_By}
                                  sx={{
                                    // width: 100,
                                    height: 60,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                />
                              </Box>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                      <Button
                        variant="contained"
                        onClick={handleCloseModal}
                        sx={{ ...customButtonStyles.ButtonSearch, mr: 2 }}
                      >
                        ไม่, ยกเลิก
                      </Button>
                      <Button
                        variant="contained"
                        onClick={handleHarvest}
                        sx={{ ...customButtonStyles.ButtonSave }}
                        disabled={!reportText || !reportDate}
                      >
                        ใช่, รายงานเลย!
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Modal>
            </Box>
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
