import Head from "next/head";
import AddIcon from "@mui/icons-material/Add";
import CustomersTable from "src/sections/customer/customers-table";
import SearchSelected from "@/src/components/inventory/searchselected";
import SearchIcon from "@mui/icons-material/Search";
import useInput from "@/src/hooks/use-input";
import { TextField } from "@mui/material";
import { styled } from "@mui/system";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Button, Card, Container, Stack, SvgIcon, Typography } from "@mui/material";
import { format } from "date-fns";
import { useSelection } from "src/hooks/use-selection";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { applyPagination } from "src/utils/apply-pagination";
import CheckIcon from '@mui/icons-material/Check';

const now = new Date();
const data = [];

const customStyles = {
  h4: {
    color: "#black",
  },
};

//style button
const customButtonStyles = {
  StockInButton: {
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
  const columns = [
    { id: "ProductCode", label: "Product Code" },
    { id: "No", label: "No" },
    { id: "Description", label: "Description" },
    { id: "LotNo", label: "LotNo" },
    { id: "UOM", label: "UOM" },
    { id: "LastUpdate", label: "LastUpdate" },
    { id: "Status", label: "Status" },
  ];

  const data = [
    {
      id: 1,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      LotNo: "LOT-0102920201",
      UOM: "BOTT",
      LastUpdated: new Date(),
      Status: "Active",
    },
    {
      id: 2,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      LotNo: "LOT-0102920201",
      UOM: "BOTT",
      LastUpdated: new Date(),
      Status: "Active",
    },
    {
      id: 3,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      LotNo: "LOT-0102920201",
      UOM: "BOTT",
      LastUpdated: new Date(),
      Status: "Active",
    },
  ];

  const Status = [
    { value: "10", label: "Active" },
    { value: "20", label: "Inactive" },
  ];

  const ProductCode = [
    { value: "groupa", label: "Group A" },
    { value: "groupb", label: "Group B" },
    { value: "groupc", label: "Group C" },
  ];

  const options = [
    { value: "glucose", label: "GLUCOSE" },
    { value: "ureabun", label: "UREA / BUN" },
    { value: "creatinine", label: "CREATININE EN..." },
    { value: "totalprotein", label: "TOTAL PROTEIN" },
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

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  return (
    <>
      <Head>
        <title> PCL Inventory | Product Stock In</title>
      </Head>
        <Container maxWidth="xl">
        <Stack spacing={1}>
            <Stack  direction="row" justifyContent="space-between" spacing={4} sx={{  paddingTop: 6 }}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={customStyles.h4}>Setting</Typography>
              </Stack>

              <>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <CheckIcon />
                      </SvgIcon>
                    }
                    variant="contained" sx={customButtonStyles.StockInButton}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </>
            </Stack>
            <Card  sx={{
                  display: "flex",
                  borderRadius: "10px",
                  // border: "2px dashed blue", 
                  justifyContent: "center",
                  alignItems: "center",
                  height: "5vh",
                  backdropFilter: "blur(0.5px)", 
                  backgroundColor: "rgba(0, 0, 0, 0)", //เบลอ
                }}>
              <Box
                component="main"
                sx={{
                  flexGrow: 1,
                  py: 0,
                }}
              >
                <Container maxWidth="xl">
                <Stack spacing={1} sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "left",
                        height: "5vh",
                      }}>
                    <Stack direction="row" justifyContent="left" spacing={4}>
                      <Stack spacing={1}>
                        <Box sx={{ mb: 1 }}>
                          <h5 >Reader Device</h5>
                          
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Card>
            <Box
              sx={{
                backgroundColor: 'white',
                padding: '16px',
                borderRadius: '10px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'white',
                  padding: '8px',
                  borderRadius: '5px',
                  marginTop: '16px', // ระยะห่างข้างบน
                  border: '1px solid blue',
                  width: '200px',
                }}
              >
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<img src="/assets/logos/Tel.png" alt="Your Image" />}
                   />
              </Box>
            </Box>
            {/* <CustomersTable columns={columns} data={data} /> */}
          </Stack>
        </Container>
     
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
