import { Avatar, Box, Button, Grid, SvgIcon, Typography } from "@mui/material";
import Head from "next/head";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import ArticleIcon from "@mui/icons-material/Article";
import { format } from 'date-fns'; 
import CustomersTable from "@/src/sections/customer/customers-table";
import { TopNav } from "@/src/layouts/dashboard/top-nav";

export default function DetailStockHistory() {
  const date = new Date(2566, 5, 17, 9, 2); // กำหนดวันที่และเวลา
  const formattedDate = format(date, "dd/MM/yyyy HH:mm"); // ฟอร์แมตวันที่และเวลา
  const columns = [
    { id: "ProductCode", label: "Product Code" },
    { id: "No", label: "No" },
    { id: "Description", label: "Description" },
    { id: "LotNo", label: "LotNo" },
    { id: "ExpireDate", label: "Expire Date", format: (date) => format(date, "dd/MM/yyyy") },
    { id: "Type", label: "Type" },
    { id: "CutAdj", label: "Cutting / Adjust QTY" },
    { id: "QTY", label: "QTY" },
    { id: "UOM", label: "UOM" },
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
      CutAdj: "15",
      UOM: "BOTT",
      QTY: "15",
      
    },
    {
      id: 2,
      ProductCode: "Group A",
      No: "OSR6121",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      CutAdj: "1",
      UOM: "BOTT",
      QTY: "15",
      
    },
    {
      id: 3,
      ProductCode: "Group A",
      No: "OSR6121",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      CutAdj: "2",
      UOM: "BOTT",
      QTY: "15",
      
    },
    {
      id: 4,
      ProductCode: "Group A",
      No: "OSR6134",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      CutAdj: "3",
      UOM: "BOTT",
      QTY: "15",
      
    },
    {
      id: 5,
      ProductCode: "Group C",
      No: "OSR6132",
      Description: "รูป",
      LotNo: "LOT-0102920202",
      ExpireDate: new Date(),
      Type: "Cutting Stock",
      CutAdj: "20",
      UOM: "BOTT",
      QTY: "15",
      
    },
  ];
  const customButtonStyles = {
    cancelButton: {
      backgroundColor: "transparent",
      color: "text.secondary",
      border: "1px solid transparent", // เพิ่มเส้นขอบของปุ่ม (โปร่งใส)
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาทุกด้าน
      "&:hover": {
        backgroundColor: "darkgray",
        border: "1px solid transparent", // ใส่สีขอบเป็นสีดำ
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)", // เพิ่มเงาทุกด้านเมื่อโฮเวอร์
      },
    },
    exportButton: {
      backgroundColor: "transparent",
      color: "error.main",
      border: "1px solid transparent", // เพิ่มเส้นขอบของปุ่ม (โปร่งใส)
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาทุกด้าน
      "&:hover": {
        backgroundColor: "darkgray",
        border: "1px solid transparent", // ใส่สีขอบเป็นสีดำ
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)", // เพิ่มเงาทุกด้านเมื่อโฮเวอร์
      },
    },
    printButton: {
      backgroundColor: "red",
      color: "white",
      border: "1px solid transparent", // เพิ่มเส้นขอบของปุ่ม (โปร่งใส)
      boxShadow: "0 0 8px rgba(0, 0, 0, 0.2)", // เพิ่มเงาทุกด้าน
      "&:hover": {
        backgroundColor: "darkgray",
        border: "1px solid transparent", // ใส่สีขอบเป็นสีดำ
        boxShadow: "0 0 12px rgba(0, 0, 0, 0.3)", // เพิ่มเงาทุกด้านเมื่อโฮเวอร์
      },
    },
  };

  return (
    <>
      <Head>
        <title> PCL Inventory | Stock history </title>
      </Head>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 8,
          backgroundColor: "#f7f7f7",
        }}
      >
        <Grid container sx={{ display: "flex", alignItems: "center", justifyItems: "center" }}>
          <Grid sm={7.6}>
            <Box>
              <Typography variant="h4" sx={{ color: "text.secondary" }}>
                Stock history
              </Typography>
            </Box>
          </Grid>
          <Grid sm={1.3}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Button variant="contained" sx={{ ...customButtonStyles.cancelButton, width: 110 }}>
                Cancel
              </Button>
            </Box>
          </Grid>
          <Grid sm={0.2}>
            <Box sx={{ display: "flex", justifyContent: "center", color: "text.disabled" }}>|</Box>
          </Grid>

          <Grid sm={1.6}>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                variant="contained"
                startIcon={
                  <SvgIcon fontSize="small">
                    <LogoutIcon />
                  </SvgIcon>
                }
                sx={{ ...customButtonStyles.exportButton, width: 150 }}
              >
                Export
              </Button>
            </Box>
          </Grid>

          <Grid sm={1.3}>
            <Box sx={{ display: "flex", justifyContent: "right" }}>
              <Button
                variant="contained"
                startIcon={
                  <SvgIcon fontSize="small">
                    <LocalPrintshopIcon />
                  </SvgIcon>
                }
                sx={{ ...customButtonStyles.printButton, width: 110 }}
              >
                Print
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid sx={{ marginTop: 5 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              height: 80,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              boxShadow: "0 4px 4px rgba(0, 0, 0, 0.05)",
            }}
          >
            <Grid container sx={{ height: 80, justifyContent: "center", alignContent: "center" }}>
              <Grid sm={0.4}>
                <Box
                  sx={{
                    backgroundColor: "#fceae8",
                    width: 35,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                  }}
                >
                  <ArticleIcon color="error" /> {/* เพิ่ม ArticleIcon */}
                </Box>
              </Grid>
              <Grid sm={10.5}>
                <Box>
                  <Typography variant="h6" sx={{ color: "text.secondary" }}>
                    Cutting / Adjust Stock
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    Stock history
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid sx={{ marginTop: 1 }}>
          <Box
            sx={{
              backgroundColor: "#fff",
              height: "auto",
              borderEndStartRadius: 10,
              borderEndEndRadius: 10,
            }}
          >
            <Grid container sx={{ justifyContent: "center", alignContent: "center", padding: 2 }}>
              <Grid sm={2} sx={{ marginRight: 3 }}>
                <Box sx={{ width: 200, height: 60, backgroundColor: "#f7f7f7", borderRadius: 1 }}>
                  <Grid
                    container
                    sx={{ justifyContent: "center", alignContent: "center", padding: 1 }}
                  >
                    <Grid sm={3.3}>
                      <Avatar
                        alt="image"
                        src="data:image/jpeg;base64,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"
                        sx={{ width: 40, height: 45, borderRadius: 1 }}
                        variant="square"
                      />
                    </Grid>
                    <Grid sm={7}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Customer
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          รพ.ค่ายวชิราวุธ
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>

              <Grid sm={2} sx={{ marginRight: 3 }}>
                <Box sx={{ width: 200, height: 60, backgroundColor: "#f7f7f7", borderRadius: 1 }}>
                  <Grid
                    container
                    sx={{ justifyContent: "center", alignContent: "center", padding: 1 }}
                  >
                    <Grid sm={11}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Customer
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          -
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid sm={2} sx={{ marginRight: 3 }}>
                <Box sx={{ width: 200, height: 60, backgroundColor: "#f7f7f7", borderRadius: 1 }}>
                  <Grid
                    container
                    sx={{ justifyContent: "center", alignContent: "center", padding: 1 }}
                  >
                    <Grid sm={11}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Created Date
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          17/06/2566 13:15
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid sm={2} sx={{ marginRight: 3 }}>
                <Box sx={{ width: 200, height: 60, backgroundColor: "#f7f7f7", borderRadius: 1 }}>
                  <Grid
                    container
                    sx={{ justifyContent: "center", alignContent: "center", padding: 1 }}
                  >
                    <Grid sm={11}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Confirm Date
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          17/06/2566 09:02
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid sm={1.9} >
                <Box sx={{ width: 200, height: 60, backgroundColor: "#f7f7f7", borderRadius: 1 }}>
                  <Grid
                    container
                    sx={{ justifyContent: "center", alignContent: "center", padding: 1 }}
                  >
                    <Grid sm={11}>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Confirm by
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          รพ.ค่ายวชิราวุธ
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              
            </Grid>
            <Grid container sx={{ justifyContent: "center", alignContent: "center", padding: 2 }}>
              <Grid sm={11}># Item</Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "center", alignContent: "center", padding: 2 }}>
              <Grid sm={11}>
                <CustomersTable columns={columns} data={data} />
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Box>
    </>
  );
}
