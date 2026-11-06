import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import SelectForm from "@/src/components/inventory/selected";
import CustomersTable from "src/sections/customer/customers-table";
import useInput from "@/src/hooks/use-input";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
// import getOnHandProducts from "@/src/hooks/use-service-api";
import { Grid, TextField } from "@mui/material";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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
  const currentDate = dayjs().format("DD/MM/YYYY");

  const columns = [
    // { id: "id", label: "#" },
    // { id: "product_code", label: "Product Code" },
    // { id: "product_no", label: "No" },
    { id: "title", label: "ชื่อ" },
    // { id: "lot_no", label: "LotNo" },

    { id: "COUNT", label: "จำนวนที่อัพเดทล่าสุด" },
    { id: "STATUS", label: "สถานะ" },
    { id: "DATE", label: "วันที่อัพเดท" },
    // { id: "phase", label: "ครั้งที่" },
  ];

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/use_history/read/${Farm_id}`);
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

  const handleHetailButtonClick = () => {
    router.push(
      `/inventory/farming/detail?Title=${Title}&Farm_id=${Farm_id}&Area=${Area}&Responsible_By=${Responsible_By}&Date=${Date}`
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
                  ประวัติ
                </Typography>
              </Stack>

              <Button
                variant="contained"
                sx={customButtonStyles.GrayButton}
                onClick={handleHetailButtonClick}
                startIcon={
                  <SvgIcon fontSize="small">
                    <ArrowBackIcon />
                  </SvgIcon>
                }
              >
                กลับ
              </Button>
            </Stack>
            <Card
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "15vh",
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
                <Grid container spacing={0} sx={{ justifyContent: "" }}>
                  <Grid item md={8.5}>
                    <Box sx={{ pb: 1, width: "auto", margin: 3 }}>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        ใส่สิ่งที่ต้องการค้นหา ?
                      </Label>
                      <TextField
                        type="text"
                        label="ค้นหา"
                        value={search.value}
                        placeholder="ใส่ข้อมูลเช่น ปุ๋ย, -10, กิโลกรัม, 4/01/2024"
                        fullWidth
                        size="small"
                        onChange={search.onChange}
                        onSubmit={handleSearch}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        sx={{
                          backgroundColor: "white",
                          borderRadius: 1,
                          width: "fullWidth",
                          height: 40,
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={2}>
                    <Box sx={{ pb: 1, width: "fullWidth", margin: 3 }}>
                      <Label htmlFor="unnamed-select" sx={customStyles.h4}>
                        วันที่ปัจจุบัน
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
                          defaultValue={currentDate}
                          sx={{
                            height: 40,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item md={1.25}>
                    <Box sx={{ marginTop: 6 }}>
                      <Button
                        fullWidth
                        onClick={handleSearch}
                        startIcon={
                          <SvgIcon fontSize="small">
                            <SearchIcon />
                          </SvgIcon>
                        }
                        variant="contained"
                        sx={customButtonStyles.ButtonSearch}
                      >
                        Search
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>
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
                  <Grid item md={2} sx={{ pb: 1, width: "fullWidth", marginTop: 3 }}>
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
                  </Grid>
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
