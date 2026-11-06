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
import { FarmingTableList } from "@/src/sections/table/farming-table-list";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
const now = new Date();
// const data = [
//   {
//     id: 1,
//     Customer: "อ้อย",
//     CreatedDate: new Date(),
//     // ConfirmDate: new Date(),
//     Product: "10ป,2ต,5ย,6อ",
//     ConfirmBy: "สิทธิโชค คุ้มครอง",
//     Area: "20 ไร่",
//   },
//   {
//     id: 2,
//     Customer: "มะเขือเทศ",
//     CreatedDate: new Date(),
//     // ConfirmDate: new Date(),
//     Product: "10ป,4ม,5ย,5อ",
//     ConfirmBy: "สิทธิโชค คุ้มครอง",
//     Area: "15 ไร่",
//   },
//   {
//     id: 3,
//     Customer: "พริก",
//     CreatedDate: new Date(),
//     // ConfirmDate: new Date(),
//     Product: "13ป,8ม,5ย,6อ",
//     ConfirmBy: "สิทธิโชค คุ้มครอง",
//     Area: "20 ไร่",
//   },
// ];

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const currentDate = dayjs().format("DD/MM/YYYY");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [fullName, setFullName] = useState(user ? `${user.first_name} ${user.last_name}` : "");


  const columns = [
    { id: "title", label: "ชื่อ" },
    { id: "date", label: "วันที่เพาะปลูก" },
    { id: "AREA", label: "พื้นที่" },
    // { id: "ConfirmDate", label: "วันที่ใช้ของ", format: (date) => format(date, "dd/MM/yyyy") },
    // { id: "Product", label: "ใช้ของ(อย่าง)" },
    { id: "responsible_by", label: "รับผิดชอบโดย" },

    // { id: "IconClick", label: "" },
  ];

  const fetchData = async () => {
    console.log("sss");
    console.log(fullName, "d");

    try {
      const response = await axios.get(`http://localhost:3000/farms/read/${fullName}`);
      setData(response.data);
      console.log(data, "data");
      setFilteredData(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  // useEffect(() => {
  //   fetchData();
  //   handleSearch();
  // }, []);

  useEffect(() => {
    const user = userString ? JSON.parse(userString) : null;
    setFullName(user && user.first_name + " " + "1");
    fetchData();
    handleSearch();
  }, []);

  const initial = useRef(false);

  console.log(filteredData, "filteredData");
  console.log(data, "data");

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
        <title> F.I.M | ทรัพยากรทั้งหมด</title>
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
                  การเพาะปลูก
                </Typography>
              </Stack>

              {user && user.role === "เจ้าของไร่" ? (
                <Stack direction="row" spacing={1}>
                  <Link href={"/inventory/farming/vegetableplot"}>
                    <Button
                      startIcon={
                        <SvgIcon fontSize="small">
                          <AddIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      sx={customButtonStyles.ButtonAdd}
                    >
                      เพิ่มแปลง
                    </Button>
                  </Link>
                  <Link href={"/inventory/farming/graph"}>
                    <Button
                      startIcon={
                        <SvgIcon fontSize="small">
                          <SignalCellularAltIcon />
                        </SvgIcon>
                      }
                      variant="contained"
                      sx={{ ...customButtonStyles.ButtonAdd, width: 120 }}
                    >
                      กราฟ
                    </Button>
                  </Link>
                </Stack>
              ) : null}
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
                        placeholder="ใส่ข้อมูลเช่น อ้อย, 19/03/2024, 20ไร่, 10ป,2ต,5ย, สมชาย"
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
            <Box sx={{ paddingTop: 3 }}>
              <FarmingTableList columns={columns} items={filteredData} />
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
