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
import * as dayjs from "dayjs";
import { Tooltip } from "@mui/material";

import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";

interface Props {
  cabinetID: string;
}
export default function HomeDay(props: Props) {
  const [data, setData] = useState<Measurement[]>([]);
  let dayUsage: number = 0;
  let pastDays: Measurement[] = [];
  let avgUsage: number = 0;
  let status: string = "";
  let overLimit: boolean = false;
  const [selectedDate, setSelectedDate] = useState("2022-02-28");

  useEffect(() => {
    const getCabinetData = async () => {
      try {
        const res = await api.get("/measurement/day/" + props.cabinetID + "/" + selectedDate);
        const measurementData = res.data;
        setData(measurementData);
      } catch (error) {
        console.log(error);
      }
    };
    getCabinetData();
  }, [selectedDate]);

  if (data.length !== 0) {
    dayUsage = Number(data[data.length - 1].usage.toFixed(2));
    pastDays = data.splice(0, data.length - 1);
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

  const navigate = useNavigate();
  const [alignment, setAlignment] = React.useState("day");
  const handleChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
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
      navigate("/home-day");
    } else if (object.value === "month") {
      navigate("/home-month");
    } else if (object.value === "year") {
      navigate("/home-year");
    }
  };

  const chartData = [{ usage: dayUsage, avgUsage: avgUsage }];

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
              width: "100vh",
              height: "45vh",
              backgroundColor: "background.level2",
              alignItems: "left",
              mt: 2,
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h3>Primerjava skupne porabe z povprečno porabo preteklih 10 dni - {selectedDate}</h3>
            </div>
            <div style={{ display: "flex", justifyContent: "center", margin: "1vh" }}>
              <ResponsiveContainer height={300}>
                <BarChart width={540} height={300} data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis unit="kWh" />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="usage" name="Poraba" fill="#0077B6" />
                  <Bar dataKey="avgUsage" name="Povprečna poraba" fill="#00B4D8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
