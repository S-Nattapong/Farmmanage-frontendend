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

const now = new Date();
const data = [];

const customStyles = {
  h4: {
    color: "#FFFFFF",
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
    { id: "UOM", label: "UOM" },
    { id: "Company", label: "Company" },
    { id: "LastUpdate", label: "LastUpdate" },
    { id: "Status", label: "Status" },
  ];

  const data = [
    {
      id: 1,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      UOM: "BOTT",
      Company: "PCL Holding",
      LastUpdated: new Date(),
      Status: "Active",
    },
    {
      id: 2,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      UOM: "BOTT",
      Company: "PCL Holding",
      LastUpdated: new Date(),
      Status: "Active",
    },
    {
      id: 3,
      ProductCode: "Group A",
      No: "ORS6121",
      Description: "GRUCOSE",
      UOM: "BOTT",
      Company: "PCL Holding",
      LastUpdated: new Date(),
      Status: "Active",
    },
  ];

  const Status = [
    { value: "10", label: "Active" },
    { value: "20", label: "Inactive" },
  ];

  const Company = [
    { value: "companya", label: "PCL Holding" },
    { value: "companyb", label: "Wachirawut Hospital" },
    { value: "companyc", label: "Banprow Hospital" },
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
            <Stack  direction="row" justifyContent="space-between" spacing={4} sx={{  paddingTop: 6 }}>
              <Stack spacing={1}>
                <Typography variant="h4" sx={customStyles.h4}>Product Mangement</Typography>
              </Stack>

              <>
                <Stack alignItems="center" direction="row" spacing={1}>
                  <Button
                    startIcon={
                      <SvgIcon fontSize="small">
                        <AddIcon />
                      </SvgIcon>
                    }
                    variant="contained" sx={customButtonStyles.StockInButton}
                  >
                    Product
                  </Button>
                </Stack>
              </>
            </Stack>
            <Card  sx={{
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
                  py: 0,
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
                        <Box sx={{ mb: 1 }}>
                          <Label htmlFor="unnamed-select">What are you looking for ?</Label>
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
                          />
                        </Box>
                      </Stack>
                      <>
                        <Stack alignItems="center" direction="row" spacing={1}>
                        <Box sx={{ mb: 1 }}>
                            <Label htmlFor="unnamed-select">Company</Label>
                            <SearchSelected options={Company} />
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Label htmlFor="unnamed-select">Product Code</Label>
                            <SearchSelected options={ProductCode} />
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Label htmlFor="unnamed-select">Description</Label>
                            <SearchSelected options={options} />
                          </Box>
                          <Box sx={{ mb: 1 }}>
                            <Label htmlFor="unnamed-select">Status</Label>
                            <SearchSelected options={Status} />
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
