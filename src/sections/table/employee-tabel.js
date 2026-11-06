import * as React from "react";
import EditIcon from "@mui/icons-material/Edit";
import SummarizeIcon from "@mui/icons-material/Summarize";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import format from "date-fns/format";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Scrollbar } from "src/components/scrollbar";
import {
  Autocomplete,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { styled } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import Swal from "sweetalert2";
import parseISO from "date-fns/parseISO";

export const EmployeeTableList = (props) => {
  const { columns = 0, items = [] } = props;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = React.useState("ทำงาน");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleHarvest = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "แก้ไขสถานะสำเร็จ",
      showConfirmButton: false,
      timer: 1500,
    });
    handleModalClose();
  };

  useEffect(() => {
    if (items.length <= rowsPerPage) {
      setPage(0);
    }
  }, [items]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

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
    <Card
      style={{
        marginTop: "18px",
      }}
    >
      <TableContainer>
        <Scrollbar>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">#</TableCell>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {items &&
                items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((data, i) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={data.id}>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Typography variant="caption">{page * rowsPerPage + i + 1}</Typography>
                        </Box>
                      </TableCell>
                      {columns.map((column) => (
                        <TableCell key={column.id}>
                          {column.id === "create_at" || column.id === "date"
                            ? data[column.id]
                              ? format(parseISO(data[column.id]), "dd/MM/yyyy")
                              : "-"
                            : column.format
                            ? column.format(data[column.id])
                            : data[column.id] || "-"}
                        </TableCell>
                      ))}
                      <TableCell align="right">
                        <IconButton>
                          <Link
                            href={{
                              pathname: "/inventory/editemployee",
                              query: {
                                Id: data.id,
                                Username: data.username,
                                Password: data.password,
                                Confirm_password: data.confirm_password,
                                First_name: data.first_name,
                                Last_name: data.last_name,
                                Citizen_id: data.citizen_id,
                                Phonenumber: data.phonenumber,
                                Role: data.role,
                                Status: data.status,
                                Start_date: data.start_date,
                                // CreatedDate: encodeURIComponent(data.CreatedDate),
                              },
                            }}
                            // as={`/inventory/farming/comment-report/`}
                          >
                            <SvgIcon>
                              <AssignmentIndIcon />
                            </SvgIcon>
                          </Link>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </Scrollbar>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={items.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
      <Box>
        {/* <ReportEmplayeeModal isOpen={isModalOpen} onClose={handleModalClose} /> */}
        <Modal
          open={isModalOpen}
          onClose={handleModalClose}
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
              sx={{ bgcolor: "background.paper", p: 4, borderRadius: 1, textAlign: "left", m: 3 }}
            >
              <Typography id="modal-title" variant="h5" component="h2" gutterBottom>
                แก้ไขสถานะพนักงาน
              </Typography>
              {/* <Typography id="modal-description" variant="body1" gutterBottom>
            การดำเนินการนี้จะทำให้ข้อมูลถูกย้ายไปยังขั้นตอนการเก็บเกี่ยว
          </Typography> */}
              <Box sx={{ my: 3 }}>
                <Grid container spacing={1}>
                  <Grid item md={7}>
                    <Label>ชื่อ</Label>
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
                        defaultValue={"สิธิ คาฟา"}
                        sx={{
                          // width: 100,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={5}>
                    <Label>เบอร์โทร</Label>
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
                        defaultValue={"0123456789"}
                        sx={{
                          // width: 100,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={7}>
                    <Label>ตำแหน่ง</Label>
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
                        defaultValue={"จัดซื้อจัดจ้าง"}
                        sx={{
                          // width: 100,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={5}>
                    <Label>วันที่เริ่มทำงาน</Label>
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
                        defaultValue={"11/08/2014"}
                        sx={{
                          // width: 100,
                          height: 40,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      />
                    </Box>
                  </Grid>
                  <Grid item md={12}>
                    <FormControl>
                      <FormLabel id="demo-controlled-radio-buttons-group">สถานะ</FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                      >
                        <FormControlLabel value="ทำงาน" control={<Radio />} label="ทำงาน" />
                        <FormControlLabel value="เลิกจ้าง" control={<Radio />} label="เลิกจ้าง" />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                </Grid>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleModalClose}
                  sx={{ ...customButtonStyles.ButtonSearch, mr: 2 }}
                >
                  ไม่, ยกเลิก
                </Button>
                <Button
                  variant="contained"
                  onClick={handleHarvest}
                  sx={{ ...customButtonStyles.ButtonAdd }}
                >
                  ใช่, แก้ไขเลย!
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </Box>
    </Card>
  );
};
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
