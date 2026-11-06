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
import ArticleSharpIcon from '@mui/icons-material/ArticleSharp';

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
  PrintButton: {
    backgroundColor: "lightgray",
    color: "black",
    "&:hover": {
      backgroundColor: "red",
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
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
    { id: "ExpireDate", label: "Expire Date", format: (date) => format(date, "dd/MM/yyyy") },
    { id: "Type", label: "Type" },
    { id: "OrderStock", label: "Order Stock" },
    { id: "UOM", label: "UOM" },
    { id: "QTY", label: "QTY" },
    { id: "Remark", label: "Remark" },
  ];

  const data = [
    {
      id: 1,
      ProductCode: "Group A",
      No: "OSR6121",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      OrderStock: "35 / 50",
      UOM: "BOTT",
      QTY: "15",
      Remark: "",
    },
    {
      id: 2,
      ProductCode: "Group B",
      No: "OSR6121",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      OrderStock: "35 / 50",
      UOM: "BOTT",
      QTY: "15",
      Remark: "",
    },
    {
      id: 3,
      ProductCode: "Group C",
      No: "OSR6121",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      OrderStock: "35 / 50",
      UOM: "BOTT",
      QTY: "15",
      Remark: "",
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

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
                <Typography variant="h4" sx={customStyles.h4}>Import Data</Typography>
              </Stack>
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
                          <h5 >Select Data Type</h5>
                          
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Card>
            <Card  sx={{
                  display: "flex",
                  borderRadius: "10px",
                  // border: "2px dashed blue", 
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15vh",
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
                  <Stack
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "left",
                      height: "5vh",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Stack spacing={1}>
                        <Box sx={{ pb: 3 }}>
                          <Label htmlFor="unnamed-select">Data Type</Label>
                          <SearchSelected options={CustomerSelect} />
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Card>
            <Card  sx={{
                  display: "flex",
                  borderRadius: "10px",
                  // border: "2px dashed blue", 
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15vh",
                  backdropFilter: "blur(0.5px)", 
                  backgroundColor: "rgba(0, 0, 0, 0)", //เบลอ
                }}>
                   <Stack spacing={1} sx={{
                        display: "flex",
                        justifyContent: "center",
                        height: "5vh",
                      }}>
                    <Stack direction="row" justifyContent="left" spacing={4}>
                      <Stack spacing={1}>
                        <Box sx={{ mb: 1 }}>
                          <h6>Select file to upload</h6>
                          <Button
                            startIcon={
                              <SvgIcon fontSize="small">
                                <ArticleSharpIcon />
                              </SvgIcon>
                            }
                            variant="contained" sx={customButtonStyles.PrintButton}
                          >
                            Select file
                          </Button>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
            </Card>
            <Card  sx={{
                  display: "flex",
                  borderRadius: "10px",
                  // border: "2px dashed blue", 
                  justifyContent: "center",
                  alignItems: "center",
                  height: "15vh",
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
                  <Stack
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "left",
                      height: "5vh",
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Stack spacing={1}>
                        <Box sx={{ 
                          pb: 3 ,
                          color: "red",
                          }}>
                          <h6>Import file history</h6>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Container>
              </Box>
            </Card>
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
