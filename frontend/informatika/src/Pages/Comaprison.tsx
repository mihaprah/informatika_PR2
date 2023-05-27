import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import api from "../Service/api";
import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface Props {
  cabinetID: string;
}
export default function Comparison(props: Props) {
  const [usage, setUsage] = useState<number>(0);
  const [year, setYear] = useState<number>(2022);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [price, setPrice] = useState<number>(0.17);
  const [finalPrice, setFinalPrice] = useState<number>(0);

  useEffect(() => {
    const getUsage = async () => {
      const res = await api.get("/measurement/usage/" + props.cabinetID + "/" + year + "-01-01");
      setUsage(res.data);
      setFinalPrice(res.data * price);
    };
    getUsage();
  }, [year]);
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <FormControl>
          <InputLabel>Leto</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Leto"
            value={year}
            onChange={(event) => setYear(Number(event.target.value))}
            style={{ height: "48px", width: "90px" }}
          >
            <MenuItem value={2022}>2022</MenuItem>
            <MenuItem value={2023}>2023</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <div style={{ display: "flex", gap: "4vh", marginTop: "2vh", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
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
              Cena na mesec: <b>{(finalPrice / 12).toFixed(2)} €</b>
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto: <b>{finalPrice.toFixed(2)} €</b>
            </Typography>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
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
              Cena na mesec:
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto:
            </Typography>
          </div>
        </Card>
      </div>

      <div style={{ display: "flex", gap: "4vh", marginTop: "2vh", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
        >
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Typography level="h6">
              <b>Graf primerjave - {year}</b>
            </Typography>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
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
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Na leto:
            </Typography>
          </div>
        </Card>
      </div>
    </>
  );
}
