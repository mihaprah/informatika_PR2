import "../styles/HomeDay.css";
import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/joy/Typography";
import { useNavigate } from "react-router";
import Card from "@mui/joy/Card";
import api from "../Service/api";
import { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Tooltip } from "@mui/material";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { initialState } from "../Modules/CabinetInitState";

interface Props {
  cabinetID: string;
}
export default function HomeDay(props: Props) {
  const [data, setData] = useState<Measurement[]>([]);
  const [cabinetData, setCabinetData] = useState<Cabinet>(initialState);
  const [intervalData, setIntervalData] = useState<Interval[]>([]);
  let dayUsage: number = 0;
  let pastDays: Measurement[] = [];
  let avgUsage: number = 0;
  let status: string = "";
  let overLimit: boolean = false;
  const [selectedDate, setSelectedDate] = useState("2022-02-28");

  useEffect(() => {
    const getMeasurementData = async () => {
      try {
        const res = await api.get("/measurement/day/" + props.cabinetID + "/" + selectedDate);
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getIntervalData = async () => {
      try {
        const res = await api.get("/interval/day/" + props.cabinetID + "/" + selectedDate);
        setIntervalData(res.data);
      } catch (errr) {
        console.log(errr);
      }
    };
    const getCabinetData = async () => {
      try {
        const res = await api.get("/cabinet/" + props.cabinetID);
        setCabinetData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCabinetData();
    getMeasurementData();
    getIntervalData();
  }, [selectedDate]);

  if (data.length !== 0) {
    dayUsage = Number(data[data.length - 1].usage.toFixed(2));
    pastDays = [...data];
    pastDays.splice(pastDays.length - 1, 1);
    pastDays.forEach((day) => {
      avgUsage += day.usage;
    });
    if (data[0].date !== "2022-01-01") {
      avgUsage /= pastDays.length;
    }
    avgUsage = Number(avgUsage.toFixed(2));
    if (data[data.length - 1].invalidFlag) {
      status = "Napačna";
    } else if (data[data.length - 1].filledWithZeros) {
      status = "Pravilna";
    } else {
      status = "Popravljena";
    }
  }

  intervalData.pop();
  const chartData2: any = [];
  if (intervalData.length !== 0) {
    let sumBlock1 = 0;
    let sumBlock2 = 0;
    let sumBlock3 = 0;
    let sumBlock4 = 0;
    let sumBlock5 = 0;

    intervalData.map((data) => {
      let hour = {
        name: data.timestamp,
        hourlyUsage: data.hourlyUsage,
        timeBlock: data.timeBlock,
        fill: "",
      };
      if (data.timeBlock === 1) {
        sumBlock1 += data.hourlyUsage;
        hour.fill = "#0077B6";
      } else if (data.timeBlock === 2) {
        sumBlock2 += data.hourlyUsage;
        hour.fill = "#00B4D8";
      } else if (data.timeBlock === 3) {
        sumBlock3 += data.hourlyUsage;
        hour.fill = "#878EBA";
      } else if (data.timeBlock === 4) {
        sumBlock4 += data.hourlyUsage;
        hour.fill = "#568C98";
      } else if (data.timeBlock === 5) {
        sumBlock5 += data.hourlyUsage;
        hour.fill = "#0077B6";
      }
      chartData2.push(hour);
    });
    if (
      sumBlock1 > cabinetData?.agreedPowerOne ||
      sumBlock2 > cabinetData?.agreedPowerTwo ||
      sumBlock3 > cabinetData?.agreedPowerThree ||
      sumBlock4 > cabinetData?.agreedPowerFour ||
      sumBlock5 > cabinetData?.agreedPowerFive
    ) {
      overLimit = true;
    }
  }

  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState("day");
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    event;
    setAlignment(newAlignment);
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const day = dayjs(date).format("DD");
      const month = dayjs(date).format("MM");
      const year = dayjs(date).format("YYYY");
      setSelectedDate(year + "-" + month + "-" + day);
    }
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

  const chartData = [
    { name: "Poraba", value: dayUsage, fill: "#0077B6" },
    { name: "Povprečna poraba", value: avgUsage, fill: "#00B4D8" },
  ];

  const selectedDateView = new Date(selectedDate).toLocaleDateString("SI");

  const CustomLegend = () => {
    return (
      <ul style={{ display: "flex", justifyContent: "center", margin: "2vh" }}>
        <li style={{ color: "#0077B6", marginRight: "10px" }}>Časovni blok 1 in 5</li>
        <li style={{ color: "#00B4D8", marginRight: "10px", marginLeft: "10px" }}>Časovni blok 2</li>
        <li style={{ color: "#878EBA", marginRight: "10px", marginLeft: "10px" }}>Časovni blok 3</li>
        <li style={{ color: "#568C98", marginRight: "10px", marginLeft: "10px" }}>Časovni blok 4</li>
      </ul>
    );
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <b>Pregled meritev - št. merilne omarice: {props.cabinetID}</b>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Datum" defaultValue={dayjs("2023-02-28") as any} onChange={handleDateChange} />
          </LocalizationProvider>
          <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            style={{ fontFamily: "Inter", width: "300px", float: "right", marginLeft: "20px" }}
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
          <Tooltip title="Poraba čez dan." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Skupna poraba
              </Typography>
              <Typography level="h2">
                <b>{dayUsage} kWh</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Povprečna poraba zadbjih 10ih dni." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Povprečna poraba (10 dni)
              </Typography>
              <Typography level="h2">
                <b>{avgUsage} kWh</b>
              </Typography>
            </Card>
          </Tooltip>
          <Tooltip title="Ali je dosežena prekoračitev zakupljene porabe." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Dosežena prekoračitev
              </Typography>
              {overLimit ? (
                <Typography level="h2">
                  <b>DA</b>
                </Typography>
              ) : (
                <Typography level="h2">
                  <b>NE</b>
                </Typography>
              )}
            </Card>
          </Tooltip>
          <Tooltip title="Status meritve." placement="top">
            <Card
              variant="outlined"
              sx={{ width: 225, height: 85, backgroundColor: "background.level2", alignItems: "center" }}
            >
              <Typography level="body1" sx={{ fontSize: "18px" }}>
                Status meritve
              </Typography>
              <Typography level="h2">
                {status === "Pravilna" ? (
                  <span style={{ color: "#37B76A" }}>Pravilna</span>
                ) : status === "Napačna" ? (
                  <span style={{ color: "#E45454" }}>Napačna</span>
                ) : (
                  <span style={{ color: "#FFCC00" }}>Popravljena</span>
                )}
              </Typography>
            </Card>
          </Tooltip>
        </div>

        <div style={{ display: "flex", gap: "4vh", marginTop: "4vh", justifyContent: "center" }}>
          <Card
            variant="outlined"
            sx={{
              width: 420,
              height: 325,
              backgroundColor: "background.level2",
              alignItems: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Primerjava skupne porabe z povprečno porabo preteklih 10 dni - {selectedDateView}</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={600} height={600}>
                <Pie
                  dataKey="value"
                  data={chartData}
                  cx={100}
                  cy={102}
                  innerRadius={50}
                  outerRadius={100}
                  fill="#82ca9d"
                />
                <RechartsTooltip />
                <Legend
                  width={170}
                  wrapperStyle={{
                    top: 65,
                    right: 0,
                    backgroundColor: "#f5f5f5",
                    border: "1px solid #d5d5d5",
                    borderRadius: 3,
                    lineHeight: "40px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          <Card
            variant="outlined"
            sx={{
              width: "90vh",
              height: 325,
              backgroundColor: "background.level2",
              alignItems: "left",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Dnevna poraba po urah (kWh) - {selectedDateView}</h3>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={540} height={300} data={chartData2}>
                <XAxis dataKey="" />
                <YAxis unit="" />
                <RechartsTooltip />
                <Legend content={<CustomLegend />} />
                <Bar dataKey="hourlyUsage" name="Poraba">
                  {chartData2.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} name={`Blok ${entry.timeBlock}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </>
  );
}
