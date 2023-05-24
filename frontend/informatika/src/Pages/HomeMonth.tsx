import "../styles/HomeDay.css"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from "react-router";
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';
import {useEffect, useState} from "react";
import api from "../Service/api";

export default function HomeMonth() {
  //TODO št anomalij dinamicno, št. prekoračitev in da poisce datum in avtomatsko geta za ta mesec podatke oz za ta mesec leta 2022

  const [data, setData] = useState<Measurement>();
  let usage = 0;
  let avgUsage = 0;
  let modified = 0;
  let maxDate = "";
  let minDate = "";
  let invalidData = 0;

  useEffect(() => {
      const getCabinetData = async () => {
          try {
              const res = await api.get("/measurement/month/5-001/2022-01-01"); //hardcoded
              const cabinet = res.data;
              setData(cabinet);
             
          } catch (error) {
              console.log(error)
          }
      }
      getCabinetData();
  },[])

  if (data){
    let max = 0;
    let min = 100;
    data.forEach(day => {
      usage += day.usage;
      usage = Math.round(usage * 100) / 100

      if(day.modifiedWithEvenDatesStrategy){
        modified ++;
      }
      if(day.invalidFlag){
        invalidData ++;
      }

      if(max < day.usage){
        max = day.usage;
        maxDate = day.date;
      }
      if(min > day.usage){
        min = day.usage;
        minDate = day.date;
      }
    });

    avgUsage = Math.round(usage/data.length * 100) / 100
    invalidData = invalidData/data.length * 100;
  }

  
  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState('month');
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
        style={{ width: '300px', float: 'right' }}
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
            <b>{usage}kWh</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Št. spremenjenih podatkov</Typography>
          <Typography level="h2" >
            <b>{modified}</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Št. anomalij</Typography>
          <Typography level="h2" >
            <b>52</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Nepravilne meritve</Typography>
          <Typography level="h2" >
            <b>{invalidData}%</b>
          </Typography>
        </Card>
      </div>
      <div style={{ display: 'flex', gap: '4vh', marginTop: '4vh', justifyContent: 'center', }}>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba</Typography>
          <Typography level="h2" >
            <b>{avgUsage}kWh/h</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Št. prekoračitev</Typography>
          <Typography level="h2" >
            <b>66</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Največja poraba</Typography>
          <Typography level="h2" >
            <b>{maxDate}</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Najmanjša poraba</Typography>
          <Typography level="h2" >
            <b>{minDate}</b>
          </Typography>
        </Card>
      </div>

    </div>

  </>
}