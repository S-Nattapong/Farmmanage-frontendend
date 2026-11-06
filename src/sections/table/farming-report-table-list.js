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
import parseISO from "date-fns/parseISO";
import { Scrollbar } from "src/components/scrollbar";

import { Typography } from "@mui/material";
import Link from "next/link";
import { useEffect } from "react";

export const FarmingReportTableList = (props) => {
  const { columns = 0, items = [] } = props;

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
        marginTop: "-8px",
        borderRadius:0,
        borderBottomLeftRadius:20,
        borderBottomRightRadius:20,
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
                          {column.id === "created_at" ||
                          column.id === "date" ||
                          column.id === "DATE"
                            ? data[column.id]
                              ? format(parseISO(data[column.id]), "dd/MM/yyyy")
                              : "-"
                            : column.format
                            ? column.format(data[column.id])
                            : data[column.id] || "-"}
                        </TableCell>
                      ))}
                      {/* <TableCell align="right">
                        <Link
                          href={{
                            pathname: "/currentstock/" + encodeURIComponent(data.cust_no),
                            query: {
                              cust_no: encodeURIComponent(data.cust_no),
                              total_qty: data.total_qty,
                            },
                          }}
                          as={`/currentstock/${encodeURIComponent(data.cust_no)}`}
                        >
                          <IconButton>
                            <SvgIcon>
                              <SummarizeIcon />
                            </SvgIcon>
                          </IconButton>
                        </Link>
                      </TableCell> */}
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
