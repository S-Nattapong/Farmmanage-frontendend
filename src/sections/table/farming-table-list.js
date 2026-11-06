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
import RateReviewIcon from "@mui/icons-material/RateReview";
import ListAltIcon from "@mui/icons-material/ListAlt";
import SignalCellularAltIcon from "@mui/icons-material/SignalCellularAlt";
import ChatIcon from "@mui/icons-material/Chat";
import parseISO from "date-fns/parseISO";
import { Scrollbar } from "src/components/scrollbar";

import { Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

export const FarmingTableList = (props) => {
  const { columns = 0, items = [] } = props;
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

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
                          {column.id === "created_at" || column.id === "date"
                            ? data[column.id]
                              ? format(parseISO(data[column.id]), "dd/MM/yyyy")
                              : "-"
                            : column.format
                            ? column.format(data[column.id])
                            : data[column.id] || "-"}
                        </TableCell>
                      ))}
                      {user && user.role === "เจ้าของไร่" ? (
                        <TableCell align="center">
                          <Link
                            href={{
                              pathname: "detail",
                              query: {
                                Title: data.title,
                                Farm_id: data.farm_id,
                                Area: data.AREA,
                                Responsible_By: data.responsible_by,
                                Date: data.date,
                              },
                            }}
                          >
                            <IconButton>
                              <SvgIcon>
                                <ListAltIcon />
                              </SvgIcon>
                            </IconButton>
                          </Link>
                        </TableCell>
                      ) : null}
                      {user && user.role === "หัวหน้าคนงาน" ? (
                        <TableCell align="center">
                          <Link
                            href={{
                              pathname: "farmingreport",
                              query: {
                                Title: data.title,
                                Farm_id: data.farm_id,
                                Area: data.AREA,
                                Responsible_By: data.responsible_by,
                                Date: data.date,
                              },
                            }}
                            // as={`/inventory/farming/${encodeURIComponent(data.Customer)}`}
                          >
                            <IconButton>
                              <SvgIcon>
                                <RateReviewIcon />
                              </SvgIcon>
                            </IconButton>
                          </Link>
                        </TableCell>
                      ) : null}
                      {user && user.role === "เจ้าของไร่" ? (
                        <TableCell align="center">
                          <Link
                            href={{
                              pathname: "/inventory/farming/comment-report/",
                              query: {
                                Farm_id: data.farm_id,
                                // CreatedDate: encodeURIComponent(data.CreatedDate),
                              },
                            }}
                            // as={`/inventory/farming/comment-report/`}
                          >
                            <IconButton>
                              <SvgIcon>
                                <ChatIcon />
                              </SvgIcon>
                            </IconButton>
                          </Link>
                        </TableCell>
                      ) : null}
                      {/* {user && user.role === "เจ้าของไร่" ? (
                        <TableCell align="center">
                          <Link
                            href={{
                              pathname: "/farming/graph",
                              query: {
                                Customer: encodeURIComponent(data.Customer),
                                CreatedDate: encodeURIComponent(data.CreatedDate),
                              },
                            }}
                            as={`/inventory/farming/graph`}
                          >
                            <IconButton>
                              <SvgIcon>
                                <SignalCellularAltIcon />
                              </SvgIcon>
                            </IconButton>
                          </Link>
                        </TableCell>
                      ) : null} */}
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
    </Card>
  );
};
