import "../styles/HomeDay.css"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/joy/Typography';
import {useNavigate} from "react-router";
import Card from '@mui/joy/Card';
import api from "../Service/api";
import {useEffect, useState} from "react";
import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import * as dayjs from "dayjs";

export default function HomeDay() {
    const [data, setData] = useState<Measurement[]>([]);
    let dayUsage = 0;
    let pastDays: Measurement[] = [];
    let avgUsage = 0;
    let status = '';
    const [selectedDate, setSelectedDate] = useState('2022-02-28');

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/measurement/day/5-001/" + selectedDate); //hardcoded
                const cabinet = res.data;
                setData(cabinet);
            } catch (error) {
                console.log(error)
            }
        }
        getCabinetData();
    }, [selectedDate])

    if (data.length !== 0) {
        dayUsage = Math.round(data[data.length - 1].usage);
        pastDays = data.splice(0, data.length - 1);
        pastDays.forEach(day => {
            avgUsage += day.usage;
        });
        avgUsage /= pastDays.length;
        if (data[data.length - 1].invalidFlag) {
            status = "Napačna";
        } else if (data[data.length - 1].filledWithZeros) {
            status = "Pravilna";
        } else {
            status = "Popravljena";
        }
    }

    const navigate = useNavigate();
    const [alignment, setAlignment] = React.useState('day');
    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string,
    ) => {
        setAlignment(newAlignment);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            const day = dayjs(date).format('DD');
            const month = dayjs(date).format('MM');
            const year = dayjs(date).format('YYYY');
            setSelectedDate(year + "-" + month + "-" + day);
        }

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
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker label="Datum" defaultValue={dayjs('2023-02-28')}
                                onChange={handleDateChange}
                    />
                </LocalizationProvider>
                <ToggleButtonGroup
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    style={{fontFamily: 'Inter', width: '300px', float: 'right', marginLeft: "20px"}}
                >
                    <ToggleButton className={"button"} value="day"
                                  onClick={() => changeURL(event?.target)}>DAN</ToggleButton>
                    <ToggleButton className={"button"} value="month"
                                  onClick={() => changeURL(event?.target)}>MESEC</ToggleButton>
                    <ToggleButton className={"button"} value="year"
                                  onClick={() => changeURL(event?.target)}>LETO</ToggleButton>
                </ToggleButtonGroup>
            </div>
        </div>
        <div>
            <div style={{display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center',}}>
                <Card variant="outlined"
                      sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                    <Typography level="body1" sx={{fontSize: '18px'}}>Skupna poraba</Typography>
                    <Typography level="h2">
                        <b>{dayUsage} kWh</b>
                    </Typography>
                </Card>
                <Card variant="outlined"
                      sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                    <Typography level="body1" sx={{fontSize: '18px'}}>Povprečna poraba (10 dni)</Typography>
                    <Typography level="h2">
                        <b>{Math.round(avgUsage)} kWh</b>
                    </Typography>
                </Card>
                <Card variant="outlined"
                      sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                    <Typography level="body1" sx={{fontSize: '18px'}}>Št. prekoračitev</Typography>
                    <Typography level="h2">
                        <b>0</b>
                    </Typography>
                </Card>
                <Card variant="outlined"
                      sx={{width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center'}}>
                    <Typography level="body1" sx={{fontSize: '18px'}}>Status meritve</Typography>
                    <Typography level="h2">
                        <b>{status}</b>
                    </Typography>
                </Card>
            </div>

        </div>
    </>
}