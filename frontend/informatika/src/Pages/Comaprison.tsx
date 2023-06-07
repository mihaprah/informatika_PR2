import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import api from "../Service/api";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts";
import "../styles/Settings.css";
import { initialState } from "../Modules/CabinetInitState";
import { useNavigate } from "react-router";
import { auth } from "../firebase";

interface Props {
  cabinetID: string;
}

export default function Comparison(props: Props) {
  const [usage, setUsage] = useState<number>(0);
  const [year, setYear] = useState<number>(2022);
  const [oldPrice, setOldPrice] = useState<number>(0);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [selectedCabinet, setSelectedCabinet] = useState<Cabinet>(initialState);
  const navigate = useNavigate();

  let currentYear = new Date().getFullYear();
  let fixedPrice: number = 0.1299;
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
    if (auth.currentUser == null) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const getUsage = await api.get("/measurement/usage/" + props.cabinetID + "/" + year + "-01-01");
          setUsage(getUsage.data);

          const getCabinet = await api.get("/cabinet/" + props.cabinetID);
          setSelectedCabinet(getCabinet.data);

          const getLowHighUsage = await api.get(
            "/measurement/low_high_usage/" + props.cabinetID + "/" + year + "-01-01"
          );
          // Check if low and high data exists
          if (getLowHighUsage.data[0] != 0 && getLowHighUsage.data[1] != 0) {
            // Check if it is the same as normal usage (50kWh difference allowed)
            if (getLowHighUsage.data[0] + getLowHighUsage.data[1] + 50 > getUsage.data) {
              // Check if cabinet data is set for low and high usage
              if (getCabinet.data.lowPrice > 0 && getCabinet.data.highPrice > 0) {
                setOldPrice(
                  getLowHighUsage.data[0] * getCabinet.data.lowPrice +
                    getLowHighUsage.data[1] * getCabinet.data.highPrice
                );
              }
            } else {
              setOldPrice(getUsage.data * fixedPrice);
            }
          } else {
            setOldPrice(getUsage.data * fixedPrice);
          }

          const getIntervals = await api.get("/interval/year/" + props.cabinetID + "/" + year + "-01-01");
          await calculateNewPrice(getIntervals.data, getCabinet.data);
        } catch (error) {
          console.log(error);
          console.log(usage);
          console.log(selectedCabinet);
        }
      };
      fetchData();
    }
  }, [year]);

  const calculateNewPrice = (yearlyIntervalData: Interval[], cabinet: Cabinet) => {
    yearlyIntervalData.forEach((interval: Interval) => {
      // Check time block
      if (interval.timeBlock === 1) {
        usageBlockOne += interval.hourlyUsage;
        //   Check if there over the agreed limit
        if (interval.hourlyUsage > cabinet?.agreedPowerOne) {
          // Add penalties for usage over the agreed limit
          penaltiesBlockOne += cabinet?.penaltiesBlockOne;
        }
      } else if (interval.timeBlock === 2) {
        usageBlockTwo += interval.hourlyUsage;
        if (interval.hourlyUsage > cabinet?.agreedPowerTwo) {
          penaltiesBlockTwo += cabinet?.penaltiesBlockTwo;
        }
      } else if (interval.timeBlock === 3) {
        usageBlockThree += interval.hourlyUsage;
        if (interval.hourlyUsage > cabinet?.agreedPowerThree) {
          penaltiesBlockThree += cabinet?.penaltiesBlockThree;
        }
      } else if (interval.timeBlock === 4) {
        usageBlockFour += interval.hourlyUsage;
        if (interval.hourlyUsage > cabinet?.agreedPowerFour) {
          penaltiesBlockFour += cabinet?.penaltiesBlockFour;
        }
      } else {
        usageBlockFive += interval.hourlyUsage;
        if (interval.hourlyUsage > cabinet?.agreedPowerFive) {
          penaltiesBlockFive += cabinet?.penaltiesBlockFive;
        }
      }
    });
    console.log(usageBlockOne + usageBlockTwo + usageBlockThree + usageBlockFour + usageBlockFive);
    // Multiply with the price set for cabinet
    usageBlockOne *= cabinet.priceBlockOne;
    usageBlockTwo *= cabinet.priceBlockTwo;
    usageBlockThree *= cabinet.priceBlockThree;
    usageBlockFour *= cabinet.priceBlockFour;
    usageBlockFive *= cabinet.priceBlockFive;

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
              }}
              style={{ height: "48px", width: "90px" }}
            >
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
          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", marginBottom: "3vh" }}>
              Cena na mesec: <b>{(oldPrice / 12).toFixed(2).replace(".", ",")} €</b>
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto: <b>{oldPrice.toFixed(2).replace(".", ",")} €</b>
            </Typography>
          </div>
          {year == currentYear ? (
            <Typography sx={{ paddingTop: "1vh" }}>
              <b>Izbrano leto je še tekoče, zato podatki morda niso končni.</b>
            </Typography>
          ) : (
            ""
          )}
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
          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", marginBottom: "3vh" }}>
              Cena na mesec: <b>{(newPrice / 12).toFixed(2).replace(".", ",")} €</b>
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto: <b>{newPrice.toFixed(2).replace(".", ",")} €</b>
            </Typography>
          </div>
          {year == currentYear ? (
            <Typography sx={{ paddingTop: "1vh" }}>
              <b>Izbrano leto je še tekoče, zato podatki morda niso končni.</b>
            </Typography>
          ) : (
            ""
          )}
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
                  - {(Math.abs(oldPrice - newPrice) / 12).toFixed(2).replace(".", ",")} €
                </Typography>
              ) : (
                <Typography sx={{ color: "#E45454" }}>
                  {" "}
                  + {(Math.abs(oldPrice - newPrice) / 12).toFixed(2).replace(".", ",")} €
                </Typography>
              )}
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Na leto:
              {oldPrice > newPrice ? (
                <Typography sx={{ color: "#37B76A" }}>
                  {" "}
                  -{" "}
                  {Math.abs(oldPrice - newPrice)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  €
                </Typography>
              ) : (
                <Typography sx={{ color: "#E45454" }}>
                  {" "}
                  +{" "}
                  {Math.abs(oldPrice - newPrice)
                    .toFixed(2)
                    .replace(".", ",")}{" "}
                  €
                </Typography>
              )}
            </Typography>
          </div>
        </Card>
      </div>
    </>
  );
}
