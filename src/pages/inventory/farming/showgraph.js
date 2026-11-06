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
import { OnHandStockTableList } from "@/src/sections/table/onhand-table-list";
import UseServiceAPI from "@/src/hooks/use-service-api";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRouter } from "next/router";

const now = new Date();

const Page = () => {
  const router = useRouter();
  const { Time } = router.query;
  console.log(Time,'d')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const data1 = [
    { name: "อ้อย", รายได้: getRandomInt(10000, 1000000), ระยะเวลา: 0, amt: 0 },
    { name: "พริก", รายได้: getRandomInt(10000, 1000000), ระยะเวลา: 0, amt: 0 },
    { name: "มะเขือเทศ", รายได้: getRandomInt(10000, 1000000), ระยะเวลา: 0, amt: 0 },
    { name: "ทุเรียน", รายได้: getRandomInt(10000, 1000000), ระยะเวลา: 0, amt: 0 },
    { name: "มะเขือ", รายได้: getRandomInt(10000, 1000000), ระยะเวลา: 0, amt: 0 },
  ];

  // สุ่มค่าจำนวนเต็มในช่วงที่กำหนด
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const currentDate = dayjs().format("DD/MM/YYYY");

  const columns = [
    { id: "title", label: "ชื่อ" },
    { id: "supplies_count", label: "จำนวน" },
    { id: "unit", label: "หน่วย" },
    { id: "created_at", label: "วันที่เพิ่มของ" },
    { id: "created_by", label: "เพิ่มโดย" },
  ];
  const fetchData = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/summary/read/${Time}`);
      setData(response.data);
      console.log(data, "data");
      setFilteredData(response.data);
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  const newData = data.map((item) => ({
    name: item.title,
    รายได้: item.cost,
    ระยะเวลา: dayjs(item.date).diff(dayjs(item.start_date), "day"),
  }));

  useEffect(() => {
    fetchData();
    handleSearch();
  }, []);

  console.log(data, "data2");
  const initial = useRef(false);
  console.log("a:", data);

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
  };

  return (
    <>
      <Head>
        <title> F.I.M | กราฟแสดงผล</title>
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
                  กราฟแสดงผลปี {Time}
                </Typography>
              </Stack>
            </Stack>

            <Box sx={{ paddingTop: 3 }}>
              <Box>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    width={500}
                    height={300}
                    data={newData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="รายได้" fill="#8884d8" />
                    <Bar dataKey="ระยะเวลา" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
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
