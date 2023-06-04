import "../styles/HomeDay.css";
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useNavigate } from "react-router";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import api from "../Service/api";
import FormControl from "@mui/material/FormControl";
import { Box, InputLabel, Tooltip } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  cabinetID: string;
}
export default function HomeMonth(props: Props) {
  const [data, setData] = useState<Measurement[]>();
  const [year, setYear] = useState(2023);
  const [month, setMonth] = useState("02");

  let usage = 0;
  let avgUsage = 0;
  let modified = 0;
  let maxDate = "";
  let minDate = "";
  let anomaly = 0;
  let correctedData = 0;

  useEffect(() => {
    const getCabinetData = async () => {
      try {
        const res = await api.get("/measurement/month/" + props.cabinetID + "/" + year + "-" + month + "-01");
        const cabinet = res.data;
        setData(cabinet);
      } catch (error) {
        console.log(error);
      }
    };
    getCabinetData();
  }, [month, year]);

  if (data) {
    let max = -1;
    let min = 10000000;
    data.forEach((day) => {
      usage += day.usage;

      if (day.modifiedWithEvenDatesStrategy) {
        modified++;
      }
      if (day.onlyMeasuredValue) {
        anomaly++;
      }

      if (max < day.usage) {
        max = day.usage;
        maxDate = day.date;
      }
      if (min > day.usage) {
        min = day.usage;
        minDate = day.date;
      }
    });

    usage = Number((usage / 1000).toFixed(3)); // from kWh to MWh
    avgUsage = Number(((usage / data.length) * 1000).toFixed(2)); // from MWh to kWh
    correctedData = Number((((modified + anomaly) / data.length) * 100).toFixed(2));
  }

  const minDateDate = new Date(minDate).toLocaleDateString("SI");
  const maxDateDate = new Date(maxDate).toLocaleDateString("SI");

  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState("month");
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    event;
    setAlignment(newAlignment);
  };

  const changeURL = (object: any) => {
    if (object.value === "day") {
      navigate("/");
    } else if (object.value === "month") {
      navigate("/home-month");
    } else if (object.value === "year") {
      navigate("/home-year");
    }
  };

  const chartData: any = [];
  if (data) {
    data?.forEach((entry: Measurement) => {
      let day = {
        name: new Date(entry.date).toLocaleDateString("en-SI"),
        correctValue: 0,
        modifiedValue: 0,
        invalidValue: 0,
      };
      if (entry.filledWithZeros === true) {
        day.correctValue = Number(entry.usage.toFixed(2));
      } else if (entry.modifiedWithEvenDatesStrategy === true) {
        day.modifiedValue = Number(entry.usage.toFixed(2));
      } else {
        day.invalidValue = Number(entry.usage.toFixed(2));
      }
      chartData.push(day);
    });
  }

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Pregled meritev - št. merilne omarice: {props.cabinetID}</b>
        <div style={{ display: "flex" }}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl>
              <InputLabel>Leto</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={year}
                label="Leto"
                onChange={(event) => setYear(Number(event.target.value))}
                style={{ height: "48px" }}
              >
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ minWidth: 120 }}>
            <FormControl>
              <InputLabel>Mesec</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={month}
                label="Leto"
                onChange={(event) => setMonth(event.target.value)}
                style={{ height: "48px" }}
              >
                <MenuItem value={"01"}>Januar</MenuItem>
                <MenuItem value={"02"}>Februar</MenuItem>
                <MenuItem value={"03"}>Marec</MenuItem>
                <MenuItem value={"04"}>April</MenuItem>
                <MenuItem value={"05"}>Maj</MenuItem>
                <MenuItem value={"06"}>Junij</MenuItem>
                <MenuItem value={"07"}>Julij</MenuItem>
                <MenuItem value={"08"}>Avgust</MenuItem>
                <MenuItem value={"09"}>September</MenuItem>
                <MenuItem value={"10"}>Oktober</MenuItem>
                <MenuItem value={"11"}>November</MenuItem>
                <MenuItem value={"12"}>December</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            style={{ width: "300px", float: "right" }}
          >
            <ToggleButton className={"button"} value="day" onClick={() => changeURL(event?.target)}>
              DAN
            </ToggleButton>
            <ToggleButton className={"button"} value="month" onClick={() => changeURL(event?.target)}>
              MESEC
            </ToggleButton>
            <ToggleButton className={"button"} value="year" onClick={() => changeURL(event?.target)}>
              LETO
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      <div>
        <div style={{ display: "flex", gap: "4vh", marginTop: "6vh", justifyContent: "center" }}>
          <Tooltip title="Poraba čez mesec." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Skupna poraba
              </Typography>
              <Typography level="h2">
                <b>{usage} MWh</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Število nadomeščenih podatkov." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Št. spremenjenih podatkov
              </Typography>
              <Typography level="h2">
                <b>{modified}</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Število mankajočih podatkov." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Št. anomalij
              </Typography>
              <Typography level="h2">
                <b>{anomaly}</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Nadomeščeni in mankajoči podatki." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Nepravilne meritve
              </Typography>
              <Typography level="h2">
                <b>{correctedData}%</b>
              </Typography>
            </Card>
          </Tooltip>
        </div>
        <div style={{ display: "flex", gap: "4vh", marginTop: "4vh", justifyContent: "center" }}>
          <Tooltip title="Povprečna poraba na dan čez mesec." placement="bottom">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Povprečna poraba (dan)
              </Typography>
              <Typography level="h2">
                <b>{avgUsage} kWh</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Število dni, ko je bila poraba prekoračena." placement="bottom">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Št. prekoračitev
              </Typography>
              <Typography level="h2">
                <b>0</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Dan v mesecu z največjo porabo." placement="bottom">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Največja poraba
              </Typography>
              <Typography level="h2">
                <b>{maxDateDate}</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Dan v mesecu z najnižjo porabo." placement="bottom">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Najmanjša poraba
              </Typography>
              <Typography level="h2">
                <b>{minDateDate}</b>
              </Typography>
            </Card>
          </Tooltip>
        </div>
        <div style={{ display: "flex", gap: "4vh", marginTop: "4vh", justifyContent: "center" }}>
          <Card
            variant="outlined"
            sx={{
              width: "142vh",
              height: "45vh",
              backgroundColor: "background.level2",
              alignItems: "left",
              mt: 2,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Poraba po dnevih (kWh) </h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis unit="" />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="correctValue" name="Pravilna meritev" stackId="a" fill="#37B76A" />
                <Bar dataKey="modifiedValue" name="Popravljena meritev" stackId="a" fill="#FFCC00" />
                <Bar dataKey="invalidValue" name="Napačna meritev" stackId="a" fill="#E45454" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
}
