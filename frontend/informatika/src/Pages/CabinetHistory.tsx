import Card from '@mui/joy/Card';
import { useEffect, useState } from "react";
import api from "../Service/api.tsx";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';

export default function CabinetHistory() {
    const [data, setData] = useState<Measurement[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/measurement/5-001"); // hardcoded
                const cabinet = res.data;
                setData(cabinet);
            } catch (error) {
                console.log(error);
            }
        };

        getCabinetData();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const rowsToDisplay = data.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <>
            <div>
                <b>Zgodovina meritev - št. merilne omarice: 5-001</b>
            </div>
            <div style={{ display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center' }}>
                <Card variant="outlined" sx={{ width: 1165, height: 650, backgroundColor: 'background.level2', alignItems: 'center' }}>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Datum</TableCell>
                                    <TableCell align="right">Poraba (kWh)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rowsToDisplay.map((row) => (
                                    <TableRow
                                        key={row.date}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {(new Date(row.date)).toLocaleDateString("en-GB")}
                                        </TableCell>
                                        <TableCell align="right">{row.usage}</TableCell>
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
        </>
    );
}
