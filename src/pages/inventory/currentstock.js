import Head from 'next/head';
import CustomersTable from "src/sections/customer/customers-table";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
import useInput from "@/src/hooks/use-input";
import { TextField } from "@mui/material";
import { format } from "date-fns";
import { styled } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { applyPagination } from 'src/utils/apply-pagination';
import DescriptionIcon from "@mui/icons-material/Description";
import Link from "next/link";

const now = new Date();
const data = [];

const customStyles = {
  h4: {
    color: "#FFFFFF",
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
};

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);
  const columns = [
    { id: "CustomerNo", label: "Customer No" },
    { id: "Customer", label: "Customer" },
    { id: "Products", label: "Products" },
    { id: "QTY", label: "QTY" },
    { id: "IconClick", label: "" },
  ];

  const data = [
    {
      id: 1,
      CustomerNo: "C0000010",
      Customer: "รพ.ค่ายวชิราวุธ",
      Products: "10",
      QTY: "109",
      IconClick: (
        <>
          <Box sx={{ color: "#fff" }}>
            <Link href="/detail-inventory/detail-customer">
              <DescriptionIcon sx={{ color: "text.disabled" }} />
            </Link>
          </Box>
        </>
      ),
    },
    {
      id: 2,
      CustomerNo: "C0000009",
      Customer: "รพ.บ้านแพ้ว",
      Products: "20",
      QTY: "19",
      IconClick: (
        <>
          <Box sx={{ color: "#fff" }}>
            <Link href="/detail-inventory/detail-customer">
              <DescriptionIcon sx={{ color: "text.disabled" }} />
            </Link>
          </Box>
        </>
      ),
    },
    {
      id: 3,
      CustomerNo: "C0000008",
      Customer: "รพ.เอกชล",
      Products: "50",
      QTY: "45",
      IconClick: (
        <>
          <Box sx={{ color: "#fff" }}>
            <Link href="/detail-inventory/detail-customer">
              <DescriptionIcon sx={{ color: "text.disabled" }} />
            </Link>
          </Box>
        </>
      ),
    },
  ];

  const CustomerSelect = [
    { value: "10", label: "รพ.ค่ายวชิราวุธ" },
    { value: "20", label: "รพ.บ้านแพ้ว" },
    { value: "30", label: "รพ.เกษมราษฏร์ อินเตอร์เนชั่นเนล" },
    { value: "40", label: "รพ.พระรามเก้า" },
    { value: "50", label: "รพ.เกษมราษฏร์ รัตนาธิเบศร์" },
    { value: "60", label: "รพ.เอกชล" },
    { value: "70", label: "รพ.ชัยนาทนเรนทร" },
    { value: "80", label: "รพ.คูเมือง" },
    { value: "90", label: "รพ.ค่ายสุรศักด์มนตรี" },
    { value: "100", label: "รพ.เกษมราษฏร์ อินเตอร์เนชั่นเนล" },
    { value: "110", label: "รพ.จอมพระ" },
  ];

  const [dataFilter, setDataFilter] = useState([]);
  useEffect(() => {
    setDataFilter(data);
  }, []);

  const search = useInput("");
  const onFetch = () => {
    const onFilter = data.filter((item) => {
      for (const key in item) {
        console.log(key);
        console.log(item);
        if (item[key] == search.value) {
          return true;
        }
        // if (item[key].toLowerCase() == includes((search.value).toLowerCase()) && item[key] == ) {
        //   return true;
        // }
      }
      return false;
    });

    setDataFilter(onFilter);
  };

  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  return (
    <>
      <Head>
        <title> PCL Inventory | Current Stock </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          backgroundImage: `url('/assets/logos/BG.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          maxHeight:"45%"
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={1}>
            <Stack
              direction="row" justifyContent="space-between" spacing={4} sx={{  paddingTop: 6 }}
            >
              <Stack spacing={1}>
                <Typography variant="h4" sx={customStyles.h4}>
                  Current Stock
                </Typography>
              </Stack>
            </Stack>
            <Card sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15vh",
                  backdropFilter: "blur(0.5px)", 
                  backgroundColor: "rgba(0, 0, 0, 0.3)", //เบลอ
                }}>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 5,
                }}
              >
                <Container maxWidth="xl">
                  <Stack spacing={1} sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "5vh",
                      }}>
                    <Stack direction="row" justifyContent="space-between" spacing={4}>
                      <Stack spacing={1}>
                        <Box sx={{ pb: 3 }}>
                          <Label htmlFor="unnamed-select" sx={customStyles.h4}>What are you looking for ?</Label>
                          <TextField
                            type="search"
                            label="Search..."
                            value={search.value}
                            fullWidth
                            size="small"
                            onChange={search.onChange}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                onFetch();
                              }
                            }}
                            sx={{
                              backgroundColor: 'white',
                              borderRadius: 1,
                            }}
                          />
                        </Box>
                      </Stack>
                      <>
                        <Stack alignItems="center" direction="row" spacing={1}>
                          <Box sx={{ mb: 1 }}>
                            <Label htmlFor="unnamed-select" sx={customStyles.h4}>Customer</Label>
                            <SearchSelected options={CustomerSelect} />
                          </Box>
                          <Button
                            startIcon={
                              <SvgIcon fontSize="small">
                                <SearchIcon />
                              </SvgIcon>
                            }
                            variant="contained" sx={customButtonStyles.ButtonSearch}
                          >
                            Search
                          </Button>
                        </Stack>
                      </>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Card>
            <CustomersTable columns={columns} data={data} />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

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
