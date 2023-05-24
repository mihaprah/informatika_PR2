import "../styles/HomeDay.css"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/joy/Typography';
import { useNavigate } from "react-router";
import Card from '@mui/joy/Card';
import api from "../Service/api";
import {useEffect, useState} from "react";

export default function HomeDay() {
    const [data, setData] = useState<Measurement>();

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/measurement/2022-01-01/5-001"); //hardcoded
                const cabinet = res.data;
                setData(cabinet);
            } catch (error) {
                console.log(error)
            }
        }
        getCabinetData();
    },[])


    const navigate = useNavigate();
    const [alignment, setAlignment] = React.useState('day');
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
        <div>
            <b>Pregled meritev - št. merilne omarice: 5-001</b>
            <ToggleButtonGroup
                color="primary"
                value={alignment}
                exclusive
                onChange={handleChange}
                style={{ fontFamily: 'Inter', width: '300px', float: 'right' }}
            >
                <ToggleButton value="day" onClick={() => changeURL(event?.target)}>DAN</ToggleButton>
                <ToggleButton value="month" onClick={() => changeURL(event?.target)}>MESEC</ToggleButton>
                <ToggleButton value="year" onClick={() => changeURL(event?.target)}>LETO</ToggleButton>
            </ToggleButtonGroup>
        </div>
        <div>
            <div style={{ display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center', }}>
                <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
                    <Typography level="body1" sx={{ fontSize: '18px' }}>Skupna poraba</Typography>
                    <Typography level="h2" >
                        <b>{data?.usage} kWh</b>
                    </Typography>
                </Card>
                <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
                    <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba (10 dni)</Typography>
                    <Typography level="h2" >
                        <b></b>
                    </Typography>
                </Card>
                <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
                    <Typography level="body1" sx={{ fontSize: '18px' }}>Št. prekoračitev</Typography>
                    <Typography level="h2" >
                        <b>0</b>
                    </Typography>
                </Card>
                <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
                    <Typography level="body1" sx={{ fontSize: '18px' }}>Status meritve</Typography>
                    <Typography level="h2" >
                        <b>{data?.invalidFlag ? "Napačna" : data?.filledWithZeros ? "Pravilna" : "Popravljena" }</b>
                    </Typography>
                </Card>
            </div>

        </div>
    </>
}