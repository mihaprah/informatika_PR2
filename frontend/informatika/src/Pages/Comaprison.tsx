import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import api from "../Service/api";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import "../styles/UserProfile.css";
import { initialState } from "../Modules/CabinetInitState";

interface Props {
  cabinetID: string;
}

export default function Comparison(props: Props) {
  const [usage, setUsage] = useState<number>(0);
  const [year, setYear] = useState<number>(0);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [fixedPrice, setFixedPrice] = useState<number>(0.17);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet>(initialState);

  let usageBlockOne: number = 0;
  let usageBlockTwo: number = 0;
  let usageBlockThree: number = 0;
  let usageBlockFour: number = 0;
  let usageBlockFive: number = 0;
  let penaltiesBlockOne: number = 0;
  let penaltiesBlockTwo: number = 0;
  let penaltiesBlockThree: number = 0;
  let penaltiesBlockFour: number = 0;
  let penaltiesBlockFive: number = 0;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getUsage = await api.get("/measurement/usage/" + props.cabinetID + "/" + year + "-01-01");
        setUsage(getUsage.data);

        const getCabinet = await api.get("/cabinet/" + props.cabinetID);
        setSelectedCabinet(getCabinet.data);

        const getHighLowUsage = await api.get("/measurement/low_high_usage/" + props.cabinetID + "/" + year + "-01-01");
        if (getHighLowUsage.data[0] != 0 && getHighLowUsage.data[1] != 0) {
          if (selectedCabinet.lowPrice > 0 && selectedCabinet.highPrice > 0) {
            setOldPrice(
              getHighLowUsage.data[0] * selectedCabinet.lowPrice + getHighLowUsage.data[1] * selectedCabinet.highPrice
            );
          } else {
            setOldPrice(usage * fixedPrice);
          }
        } else {
          setOldPrice(usage * fixedPrice);
        }

        const getIntervals = await api.get("/interval/year/" + props.cabinetID + "/" + year + "-01-01");
        await calculateNewPrice(getIntervals.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [year]);

  const calculateNewPrice = (yearlyIntervalData: Interval[]) => {
    console.log(yearlyIntervalData);
    yearlyIntervalData.forEach((interval: Interval, index: number) => {
      // Check time block
      if (interval.timeBlock === 1) {
        usageBlockOne += interval.hourlyUsage;
        //   Check if there over the agreed limit
        if (interval.hourlyUsage > selectedCabinet?.agreedPowerOne) {
          // Add penalties for usage over the agreed limit
          penaltiesBlockOne +=
            (selectedCabinet?.agreedPowerOne - interval.hourlyUsage) * selectedCabinet?.penaltiesBlockOne;
        }
      } else if (interval.timeBlock === 2) {
        usageBlockTwo += interval.hourlyUsage;
        if (interval.hourlyUsage > selectedCabinet?.agreedPowerTwo) {
          penaltiesBlockTwo +=
            (selectedCabinet?.agreedPowerTwo - interval.hourlyUsage) * selectedCabinet?.penaltiesBlockTwo;
        }
      } else if (interval.timeBlock === 3) {
        usageBlockThree += interval.hourlyUsage;
        if (interval.hourlyUsage > selectedCabinet?.agreedPowerThree) {
          penaltiesBlockThree +=
            (selectedCabinet?.agreedPowerThree - interval.hourlyUsage) * selectedCabinet?.penaltiesBlockThree;
        }
      } else if (interval.timeBlock === 4) {
        usageBlockFour += interval.hourlyUsage;
        if (interval.hourlyUsage > selectedCabinet?.agreedPowerFour) {
          penaltiesBlockFour +=
            (selectedCabinet?.agreedPowerFour - interval.hourlyUsage) * selectedCabinet?.penaltiesBlockFour;
        }
      } else {
        usageBlockFive += interval.hourlyUsage;
        if (interval.hourlyUsage > selectedCabinet?.agreedPowerFive) {
          penaltiesBlockFive +=
            (selectedCabinet?.agreedPowerFive - interval.hourlyUsage) * selectedCabinet?.penaltiesBlockFive;
        }
      }
    });
    // Multiply with the price set for cabinet
    usageBlockOne *= selectedCabinet.priceBlockOne;
    usageBlockTwo *= selectedCabinet.priceBlockTwo;
    usageBlockThree *= selectedCabinet.priceBlockThree;
    usageBlockFour *= selectedCabinet.priceBlockFour;
    usageBlockFive *= selectedCabinet.priceBlockFive;

    console.log(usageBlockOne);

    setNewPrice(
      usageBlockOne +
        usageBlockTwo +
        usageBlockThree +
        usageBlockFour +
        usageBlockFive +
        penaltiesBlockOne +
        penaltiesBlockTwo +
        penaltiesBlockThree +
        penaltiesBlockFour +
        penaltiesBlockFive
    );
  };

  const chartData = [{ oldPrice: oldPrice.toFixed(2), newPrice: newPrice.toFixed(2) }];

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ display: "flex", justifyContent: "left" }}>
          <b>Št. merilne omarice: {props.cabinetID}</b>
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <FormControl>
            <InputLabel>Leto</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Leto"
              value={year}
              onChange={(event) => {
                setYear(Number(event.target.value));
                console.log(year);
              }}
              style={{ height: "48px", width: "90px" }}
            >
              <MenuItem value={0}>Leto</MenuItem>
              <MenuItem value={2022}>2022</MenuItem>
              <MenuItem value={2023}>2023</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>
      <div className={"container"}>
        <Card
          variant="outlined"
          sx={{
            width: 560,
            height: 250,
            backgroundColor: "background.level2",
            alignItems: "left",
            mt: 2,
            mr: 2,
          }}
        >
          <Typography level="h4">
            <b>Vt/Nt način obračunavanja - {year}</b>
          </Typography>
          {year == currentYear ? (
            <Typography>
              <b>Izbrano leto je še tekoče, zato podatki morda niso končni.</b>
            </Typography>
          ) : (
            ""
          )}

          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", marginBottom: "3vh" }}>
              Cena na mesec: <b>{(oldPrice / 12).toFixed(2)} €</b>
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto: <b>{oldPrice.toFixed(2)} €</b>
            </Typography>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{
            width: 560,
            height: 250,
            backgroundColor: "background.level2",
            alignItems: "left",
            mt: 2,
            mr: 2,
          }}
        >
          <Typography level="h4">
            <b>15min intervali način obračunavanja - {year}</b>
          </Typography>
          {year == currentYear ? (
            <Typography>
              <b>Izbrano leto je še tekoče, zato podatki morda niso končni.</b>
            </Typography>
          ) : (
            ""
          )}
          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", marginBottom: "3vh" }}>
              Cena na mesec: <b>{(newPrice / 12).toFixed(2)} €</b>
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto: <b>{newPrice.toFixed(2)} €</b>
            </Typography>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{
            width: 560,
            height: 250,
            backgroundColor: "background.level2",
            alignItems: "left",
            mt: 2,
            mr: 2,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography level="h6">
              <b>Graf primerjave - {year}</b>
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center", margin: "1vh" }}>
            <ResponsiveContainer height={220}>
              <BarChart width={540} height={300} data={chartData}>
                <XAxis dataKey="name" />
                <YAxis unit="€" />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="oldPrice" name="Vt/Nt obračunavanje" fill="#0077B6" />
                <Bar dataKey="newPrice" name="15min obračunavanje" fill="#00B4D8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{
            width: 560,
            height: 250,
            backgroundColor: "background.level2",
            alignItems: "left",
            mt: 2,
            mr: 2,
          }}
        >
          <Typography level="h4">
            <b>Primerjava</b>
          </Typography>
          <Typography level="body1" sx={{ fontSize: "18px" }}>
            Z novim načinom obračunavanja elektične energije boste povprečno porabili:
          </Typography>
          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", fontWeight: "bold", marginBottom: "2vh" }}>
              Na mesec:
              {oldPrice > newPrice ? (
                <Typography sx={{ color: "#37B76A" }}>
                  {" "}
                  - {(Math.abs(oldPrice - newPrice) / 12).toFixed(2)} €
                </Typography>
              ) : (
                <Typography sx={{ color: "#E45454" }}>
                  {" "}
                  + {(Math.abs(oldPrice - newPrice) / 12).toFixed(2)} €
                </Typography>
              )}
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Na leto:
              {oldPrice > newPrice ? (
                <Typography sx={{ color: "#37B76A" }}> - {Math.abs(oldPrice - newPrice).toFixed(2)} €</Typography>
              ) : (
                <Typography sx={{ color: "#E45454" }}> + {Math.abs(oldPrice - newPrice).toFixed(2)} €</Typography>
              )}
            </Typography>
          </div>
        </Card>
      </div>
    </>
  );
}
