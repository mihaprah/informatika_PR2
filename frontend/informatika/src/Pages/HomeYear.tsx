import "../styles/HomeDay.css";
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { useNavigate } from "react-router";
import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import api from "../Service/api.tsx";
import { Box, InputLabel, Tooltip } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  PieChart,
  Pie,
  Legend,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { parse } from "path";

interface Props {
  cabinetID: string;
}

export default function HomeYear(props: Props) {
  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState("year");
  const [data, setData] = useState<Measurement[]>([]);
  const [monthData, setMonthData] = useState<any>([]);
  const [year, setYear] = useState(2023);
  let usage = 0;
  let modified = 0;
  let anomaly = 0;

  useEffect(() => {
    const getCabinetData = async () => {
      try {
        const res = await api.get("/measurement/year/" + props.cabinetID + "/" + year + "-01-01"); //hardcoded
        const cabinet = res.data;
        setData(cabinet);
      } catch (error) {
        console.log(error);
      }
    };

    const getYearMonthData = async () => {
      try {
        const res = await api.get("/measurement/year/month/" + props.cabinetID + "/" + year + "-01-01"); //hardcoded
        const monthD = res.data;
        setMonthData(monthD);
      } catch (error) {
        console.log(error);
      }
    }
    getCabinetData();
    getYearMonthData();
  }, [year]);

  if (data) {
    data.forEach((day) => {
      usage += day.usage;

      if (day.modifiedWithEvenDatesStrategy) {
        modified++;
      }

      if (day.onlyMeasuredValue) {
        anomaly++;
      }
    });
  }
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
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
  };

  const chartData = [
    { name: "Pravilne meritve", value: data.length - modified - anomaly, fill: "#37B76A" },
    { name: "Popravljene meritve", value: modified, fill: "#FFCC00" },
    { name: "Napačne meritve", value: anomaly, fill: "#E45454" },
  ];


  const chartData2: any = []
  if (monthData) {
    monthData?.forEach((month: any) => {
      let monthData = {
        name: month.name,
        correctValue: month.correctValue,
        modifiedValue: month.modifiedValue,
        invalidValue: month.invalidValue,
      };
      switch (monthData.name) {
        case 'JANUARY':
          monthData.name = 'JAN'
          break;
        case 'FEBRUARY':
          monthData.name = 'FEB'
          break;
        case 'MARCH':
          monthData.name = 'MAR'
          break;
        case 'APRIL':
          monthData.name = 'APR'
          break;
        case 'MAY':
          monthData.name = 'MAJ'
          break;
        case 'JUNE':
          monthData.name = 'JUN'
          break;
        case 'JULY':
          monthData.name = 'JUL'
          break;
        case 'AUGUST':
          monthData.name = 'AVG'
          break;
        case 'SEPTEMBER':
          monthData.name = 'SEP'
          break;
        case 'OCTOBER':
          monthData.name = 'OKT'
          break;
        case 'NOVEMBER':
          monthData.name = 'NOV'
          break;
        case 'DECEMBER':
          monthData.name = 'DEC'
          break;
      }
      chartData2.push(monthData);
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
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            style={{ width: "300px" }}
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
      <div style={{ display: "flex", gap: "4vh", marginTop: "6vh", justifyContent: "center" }}>
        <div>
          <Tooltip title="Poraba čez leto." placement="top">
            <Card
              variant="outlined"
              sx={{
                width: 225,
                height: 85,
                backgroundColor: "background.level2",
                alignItems: "center",
                marginBottom: "4vh",
              }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Skupna poraba
              </Typography>
              <Typography level="h2">
                <b>{Number((usage / 1000).toFixed(2))} MWh</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Povprečna poraba na dan čez leto." placement="bottom">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Povprečna poraba (dan)
              </Typography>
              <Typography level="h2">
                <b>{Number((usage / data?.length).toFixed(2))} kWh</b>
              </Typography>
            </Card>
          </Tooltip>
        </div>
        <div>
          <Tooltip title="Število nadomeščenih podatkov." placement="top">
            <Card
              variant="outlined"
              sx={{
                width: 225,
                height: 85,
                backgroundColor: "background.level2",
                alignItems: "center",
                marginBottom: "4vh",
              }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Št. spremenjenih podatkov
              </Typography>
              <Typography level="h2">
                <b>{modified}</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Število mankajočih podatkov." placement="bottom">
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
        </div>
        <div>
          <Card
            variant="outlined"
            sx={{
              width: 559,
              height: 235,
              backgroundColor: "background.level2",
              alignItems: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Typography level="h6">
                <b>Stanje meritev - {year}</b>
              </Typography>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={600} height={600}>
                <Pie
                  dataKey="value"
                  data={chartData}
                  cx={120}
                  cy={102}
                  innerRadius={50}
                  outerRadius={100}
                  fill="#82ca9d"
                />
                <RechartsTooltip />
                <Legend
                  width={200}
                  wrapperStyle={{
                    top: 50,
                    right: 50,
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #d5d5d5",
                    borderRadius: 3,
                    lineHeight: "40px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
      <div style={{ display: "flex", gap: "4vh", marginTop: "4vh", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{
            width: "148vh",
            height: "45vh",
            backgroundColor: "background.level2",
            alignItems: "left",
            mt: 2,
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={600}
              height={300}
              data={chartData2}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name"/>
              <YAxis />
              <RechartsTooltip />
              <Legend />
              <Bar dataKey="correctValue" name="Pravilne meritve" stackId="a" fill="#37B76A" />
              <Bar dataKey="modifiedValue" name="Popravljene meritve" stackId="a" fill="#FFCC00" />
              <Bar dataKey="invalidValue" name="Napačne meritve" stackId="a" fill="#E45454" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}
