import "../styles/HomeDay.css"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useNavigate} from "react-router";
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import {useEffect, useState} from "react";
import api from "../Service/api.tsx";
import {Box, InputLabel} from "@mui/material";
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


export default function HomeYear() {
    const navigate = useNavigate();
    const [alignment, setAlignment] = React.useState('year');
    const [data, setData] = useState<Measurement[]>([]);
    const [year, setYear] = useState(2023);
    let usage = 0;
    let modified = 0;
    let invalidData = 0;

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/measurement/year/5-001/" + year + "-01-01"); //hardcoded
                const cabinet = res.data;
                setData(cabinet);
            } catch (error) {
                console.log(error)
            }
        }
        getCabinetData();
    }, [year])

    if (data) {
        data.forEach(day => {
            usage += day.usage;

            if (day.modifiedWithEvenDatesStrategy) {
                modified++;
            }

            if (day.invalidFlag) {
                invalidData++;
            }
        });
    }
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    const changeURL = (object: any) => {
        if (object.value === "day") {
            navigate("/home-day");
        } else if (object.value === "month") {
            navigate("/home-month");
        } else if (object.value === "year") {
            navigate("/home-year");
        }
    }

    return <>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <b>Pregled meritev - št. merilne omarice: 5-001</b>
            <div style={{display: "flex"}}>
            <Box sx={{minWidth: 120}}>
                <FormControl>
                    <InputLabel>Leto</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={year}
                        label="Leto"
                        onChange={(event) =>
                            setYear(Number(event.target.value))
                        }
                        style={{height: "48px"}}
                    >
                        <MenuItem value={2022}>2022</MenuItem>
                        <MenuItem value={2023}>2023</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                style={{width: '300px'}}
            >
                <ToggleButton className={"button"} value="day" onClick={() => changeURL(event?.target)}>DAN</ToggleButton>
                <ToggleButton className={"button"} value="month" onClick={() => changeURL(event?.target)}>MESEC</ToggleButton>
                <ToggleButton className={"button"} value="year" onClick={() => changeURL(event?.target)}>LETO</ToggleButton>
            </ToggleButtonGroup>
            </div>
        </div>

        <div style={{display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center',}}>
            <Card variant="outlined"
                  sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                <Typography level="body1" sx={{fontSize: '18px'}}>Skupna poraba</Typography>
                <Typography level="h2">
                    <b>{Math.round(usage / 1000)} MWh</b>
                </Typography>
            </Card>
            <Card variant="outlined"
                  sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                <Typography level="body1" sx={{fontSize: '18px'}}>Povprečna poraba (dan)</Typography>
                <Typography level="h2">
                    <b>{Math.round((usage / 1000) / data?.length)} MWh</b>
                </Typography>
            </Card>
            <Card variant="outlined"
                  sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                <Typography level="body1" sx={{fontSize: '18px'}}>Št. spremenjenih podatkov</Typography>
                <Typography level="h2">
                    <b>{modified}</b>
                </Typography>
            </Card>
            <Card variant="outlined"
                  sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                <Typography level="body1" sx={{fontSize: '18px'}}>Št. anomalij</Typography>
                <Typography level="h2">
                    <b>{modified + invalidData}</b>
                </Typography>
            </Card>
        </div>
        <div style={{display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center',}}>
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 270,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2,
                }}
            >
            </Card>
        </div>
    </>
}