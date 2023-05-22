import "../styles/HomeDay.css"
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { useNavigate } from "react-router";
import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';

export default function HomeMonth() {
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
      <div style={{ display: 'flex', gap: '5%', marginTop: '6%', justifyContent: 'center', }}>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Skupna poraba</Typography>
          <Typography level="h2" >
            <b>3580kWh</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Št. spremenjenih podatkov</Typography>
          <Typography level="h2" >
            <b>33</b>
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
            <b>14%</b>
          </Typography>
        </Card>
      </div>
      <div style={{ display: 'flex', gap: '5%', marginTop: '2%', justifyContent: 'center', }}>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba</Typography>
          <Typography level="h2" >
            <b>13kWh/h</b>
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
            <b>15.05</b>
          </Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 225, height: 85, backgroundColor: 'background.level2', alignItems: 'center' }}>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Najmanjša poraba</Typography>
          <Typography level="h2" >
            <b>24.05</b>
          </Typography>
        </Card>
      </div>

    </div>

  </>
}