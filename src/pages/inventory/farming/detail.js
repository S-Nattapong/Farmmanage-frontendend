import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import { Grid, Modal, TextField } from "@mui/material";
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
import DeleteIcon from "@mui/icons-material/Delete";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import HistoryToggleOffIcon from "@mui/icons-material/HistoryToggleOff";
import Swal from "sweetalert2";
import { DatePicker } from "@mui/x-date-pickers";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HeightIcon from "@mui/icons-material/Height";
import axios from "axios";

const now = new Date();

const Page = () => {
  const router = useRouter();
  const { Title, Farm_id, Area, Responsible_By, Date } = router.query;
  const formattedDate = dayjs(Date).format("DD/MM/YYYY");
  const formattedDate1 = dayjs(Date).format("YYYY-MM-DD");
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
  console.log(formattedDate1, "f1");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(0);

  const currentDate = dayjs().format("DD/MM/YYYY");
  const [data, setData] = useState([]);

  const [reportIncome, setReportIncome] = useState(""); // เก็บข้อความที่เราจะรายงาน
  const [reportDate, setReportDate] = useState(null); // วันที่เราจะรายงาน

  const handleReportIncomeChange = (event) => {
    setReportIncome(event.target.value);
  };

  const handleReportDateChange = (date) => {
    setReportDate(date);
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

  const initial = useRef(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleHistoryButtonClick = () => {
    router.push(
      `/inventory/farming/history?Title=${Title}&Farm_id=${Farm_id}&Area=${Area}&Responsible_By=${Responsible_By}&Date=${Date}`
    );
  };

  const handleWithdrawReturnButtonClick = () => {
    router.push(
      `/inventory/farming/withdraw-return?Title=${Title}&Farm_id=${Farm_id}&Area=${Area}&Responsible_By=${Responsible_By}&Date=${Date}`
    );
  };

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

  const handleDeleteButtonClick = () => {
    Swal.fire({
      title: "ต้องการลบแปลงนี้หรือไม่ ?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      confirmButtonText: "ใช่, ลบแปลงเลย!",
      cancelButtonText: "ไม่, เก็บแปลงไว้!",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "ลบแปลงสำเร็จ!",
          // text: "Your file has been deleted.",
          icon: "success",
        }).then(() => {
          // นำผู้ใช้ไปยังหน้า /inventory/employee
          router.push("/inventory/farming/farming");
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire({
          title: "ไม่มีการลบแปลงนี้",
          // text: "Your imaginary file is safe :)",
          icon: "error",
        });
      }
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
    GrayButton: {
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

  const handleHarvest = async () => {
    try {
      // เรียกใช้ API ด้วย axios
      const response = await axios.post("http://localhost:3000/summary/create", {
        title: Title,
        cost: reportIncome,
        date: reportDate.toISOString().split("T")[0],
        start_date: formattedDate1,
      });

      // ตรวจสอบคำตอบจาก API
      if (response.status === 201) {
        // แสดงข้อความว่าเก็บเกี่ยวสำเร็จ
        Swal.fire({
          position: "center",
          icon: "success",
          title: "เก็บเกี่ยวสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });

        // ปิด Modal
        handleCloseModal();
      } else {
        // แสดงข้อความว่ามีข้อผิดพลาด
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "เกิดข้อผิดพลาดขณะเก็บเกี่ยว!",
        });
      }
    } catch (error) {
      console.error("Error harvesting:", error);
      // แสดงข้อความว่ามีข้อผิดพลาด
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "เกิดข้อผิดพลาดขณะเก็บเกี่ยว!",
      });
    }
  };

  return (
    <>
      <Head>
        <title> F.I.M | รายละเอียดการเพาะปลูก</title>
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
                  รายละเอียดการเพาะปลูก
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Link href={"/inventory/farming/farming"}>
                  <Button
                    variant="contained"
                    sx={customButtonStyles.GrayButton}
                    startIcon={
                      <SvgIcon fontSize="small">
                        <ArrowBackIcon />
                      </SvgIcon>
                    }
                  >
                    กลับ
                  </Button>
                </Link>

                <Button
                  variant="contained"
                  sx={customButtonStyles.GrayButton}
                  onClick={handleHistoryButtonClick}
                  startIcon={
                    <SvgIcon fontSize="small">
                      <HistoryToggleOffIcon />
                    </SvgIcon>
                  }
                >
                  ประวัติ
                </Button>

                {/* <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <DeleteIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={customButtonStyles.GrayButton}
                  onClick={handleDeleteButtonClick}
                >
                  ลบแปลง
                </Button> */}
                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <AgricultureIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={customButtonStyles.GrayButton}
                  onClick={handleOpenModal}
                >
                  เก็บเกี่ยว
                </Button>

                <Button
                  startIcon={
                    <SvgIcon fontSize="small">
                      <HeightIcon />
                    </SvgIcon>
                  }
                  variant="contained"
                  sx={customButtonStyles.ButtonAdd}
                  onClick={handleWithdrawReturnButtonClick}
                >
                  เบิก-คืน
                </Button>
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
              {/* <HarvestModal isOpen={isModalOpen} onClose={handleCloseModal} /> */}
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
                      ทำการเก็บเกี่ยว
                    </Typography>

                    <Box sx={{ my: 3 }}>
                      <Grid container spacing={1}>
                        <Grid item md={8}>
                          <Label>
                            {isNaN(reportIncome) ||
                            parseFloat(reportIncome) === 0 ||
                            reportIncome.toString().charAt(0) === "0" ? (
                              <span style={{ color: "red" }}>
                                รายได้ของแปลงนี้ ต้องเป็นตัวเลขเท่านั้น
                              </span>
                            ) : (
                              "รายได้ของแปลงนี้"
                            )}
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
                              value={reportIncome}
                              onChange={handleReportIncomeChange}
                              sx={{
                                height: 40,
                                // display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            />
                          </Box>
                        </Grid>
                        <Grid item md={4}>
                          <Label htmlFor="unnamed-select">วันที่เก็บเกี่ยว</Label>
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
                                height: 40,
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#fff",
                                borderRadius: 1,
                              }}
                            />
                          </Box>
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
                        disabled={
                          !reportIncome ||
                          reportIncome === "" || // ไม่ได้รับค่าใน reportIncome
                          isNaN(reportIncome) || // ตรวจสอบว่า reportIncome เป็น NaN หรือไม่ (ไม่ใช่ตัวเลข)
                          parseFloat(reportIncome) === 0 || // ตรวจสอบว่า reportIncome เป็นเลข 0 หรือไม่
                          reportIncome.toString().charAt(0) === "0" || // ตรวจสอบว่าเลขแรกของ reportIncome เป็น '0' หรือไม่
                          reportDate === null // ตรวจสอบว่า reportDate เป็น null หรือไม่
                        }
                      >
                        ใช่, เก็บเกี่ยวเลย!
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
