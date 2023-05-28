import Card from "@mui/joy/Card";
import { SetStateAction, useEffect, useState } from "react";
import api from "../Service/api.tsx";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";

interface Props {
  cabinetID: string;
}
export default function CabinetHistory(props: Props) {
  const [data, setData] = useState<Measurement[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const getCabinetData = async () => {
      try {
        const res = await api.get("/measurement/" + props.cabinetID);
        const cabinet = res.data;
        setData(cabinet);
      } catch (error) {
        console.log(error);
      }
    };

    getCabinetData();
  }, []);

  const handleChangePage = (event: any, newPage: SetStateAction<number>) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToDisplay = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <div>
        <b>Zgodovina meritev - št. merilne omarice: {props.cabinetID}</b>
      </div>
      <div style={{ display: "flex", gap: "4vh", marginTop: "6vh", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: 1165, height: 650, backgroundColor: "background.level2", alignItems: "center" }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <b>Datum</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Status meritve</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Poraba (kWh)</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Visoka Poraba (kWh)</b>
                  </TableCell>
                  <TableCell align="right">
                    <b>Nizka Poraba (kWh)</b>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rowsToDisplay.map((row) => (
                  <TableRow key={row.date} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell component="th" scope="row">
                      {new Date(row.date).toLocaleDateString("en-GB")}
                    </TableCell>
                    <TableCell align="right">
                      {row.filledWithZeros === true ? (
                        <span style={{ color: "#37B76A" }}>Pravilna</span>
                      ) : row.invalidFlag === true ? (
                        <span style={{ color: "#E45454" }}>Napačna</span>
                      ) : (
                        <span style={{ color: "#FFCC00" }}>Popravljena</span>
                      )}
                    </TableCell>

                    <TableCell align="right">{row.usage}</TableCell>
                    <TableCell align="right">
                      {row.highUsage != 0 ? row.highUsage : row.lowUsage != 0 ? row.highUsage : "Podatek ni na voljo"}
                    </TableCell>
                    <TableCell align="right">
                      {row.lowUsage != 0 ? row.lowUsage : row.highUsage != 0 ? row.lowUsage : "Podatek ni na voljo"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </div>
      <div style={{ display: "flex", gap: "4vh", marginTop: "6vh", justifyContent: "center" }}>
        <Card variant="outlined" sx={{ width: 1165, height: 280, backgroundColor: "background.level2" }}>
          <h3 style={{ marginBottom: "0" }}>Razlaga pojmov</h3>
          <div style={{ paddingLeft: "1vh" }}>
            <h4>Status meritve:</h4>
            <ul>
              <li>
                <span style={{ color: "#37B76A" }}>Pravilna</span> - podatki iz 15 minutnih meritev se ujemajo z
                dnevnimi podatki.
              </li>
              <li>
                <span style={{ color: "#FFCC00" }}>Popravljena</span> - podatki iz 15 minutnih meritev se ne ujemajo z
                dnevnimi podatki, zato je meritev namoščena z metodo soležnih dni.
              </li>
              <li>
                <span style={{ color: "#E45454" }}>Napačna</span> - podatki iz 15 minutnih meritev se ne ujemajo z
                dnevnimi podatki, prav tako podatka ni bilo mogoče nadomestiti z metodo soležnih dni. Na voljo je
                podatek iz 15 minutnih meritev, ki pa ni preverjen.
              </li>
            </ul>
            <h4>Visoka in Nizka poraba</h4>
            <ul>
              <li>
                <b>Podatek ni na voljo</b> - podatek manjka, saj med uporabo metode soležnih dni, prejšnji dnevi tega
                podatka niso imeli.
              </li>
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}
