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
import AddIcon from "@mui/icons-material/Add";
import { OnHandStockTableList } from "@/src/sections/table/onhand-table-list";
import axios from "axios";
import { getUser } from "@/src/hooks/user-api";
import { EmployeeTableList } from "@/src/sections/table/employee-tabel";

const now = new Date();
// const data = [
//   {
//     id: 1,
//     first_name: "สิธิ คาฟา",
//     phonenumber: "0123456789",
//     role: "หัวหน้าคนงาน",
//     create_at: "1/01/2000",
//     status: "ทำงาน",
//     confirmBy: "สิทธิโชค คุ้มครอง",
//   },
//   {
//     id: 2,
//     first_name: "มานพ พารารี",
//     phonenumber: "1234567890",
//     role: "จัดซื้อจัดจ้าง",
//     create_at: "11/08/2014",
//     status: "ทำงาน",
//     confirmBy: "สิทธิโชค คุ้มครอง",
//   },
//   {
//     id: 3,
//     first_name: "มณี ศรีสวัส",
//     phonenumber: "2345678901",
//     role: "หัวหน้าคนงาน",
//     create_at: "1/12/2003",
//     status: "ทำงาน",
//     confirmBy: "สิทธิโชค คุ้มครอง",
//   },
//   {
//     id: 4,
//     first_name: "สมชาติ ปาจิรา",
//     phonenumber: "4567890123",
//     role: "จัดซื้อจัดจ้าง",
//     create_at: "1/09/2023",
//     status: "ทำงาน",
//     confirmBy: "สิทธิโชค คุ้มครอง",
//   },
//   {
//     id: 5,
//     first_name: "สมรัก ปาจิรา",
//     phonenumber: "4567890123",
//     role: "จัดซื้อจัดจ้าง",
//     create_at: "1/01/2000",
//     status: "ลาออก",
//     confirmBy: "สิทธิโชค คุ้มครอง",
//   },
// ];

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const currentDate = dayjs().format("DD/MM/YYYY");
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([data]);

  const columns = [
    { id: "first_name", label: "ชื่อ" },
    { id: "phonenumber", label: "เบอร์โทร" },
    { id: "role", label: "ตำแหน่ง" },
    { id: "create_at", label: "วันที่เริ่มทำงาน" },
    { id: "status", label: "สถานะ" },
  ];
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/read");
      setData(response.data);
      setFilteredData(response.data);
      console.log("API Response1:", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();
    handleSearch();
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
        <title> F.I.M | พนักงาน</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          // backgroundImage: `url('/assets/logos/BGG.png')`,
          backgroundSize: "cover",
          backgroundrole: "center",
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
                  พนักงาน
                </Typography>
              </Stack>
              <Stack spacing={1}>
                <Link href={"/inventory/addemployee"}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <AddIcon />
                      </SvgIcon>
                    }
                    variant="contained"
                    sx={customButtonStyles.ButtonAdd}
                  >
                    เพิ่มพนักงาน
                  </Button>
                </Link>
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
                        label="Search..."
                        // variant="outlined"
                        value={search.value}
                        placeholder="สมชาย,094942xxxx, หัวหนเาคนงาน, ทำงาน"
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
              <EmployeeTableList columns={columns} items={filteredData} />
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
