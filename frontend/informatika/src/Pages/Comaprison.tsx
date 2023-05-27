import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";

interface Props {
  cabinetID: string;
}
export default function Comparison(props: Props) {
  return (
    <>
      <div style={{ display: "flex", gap: "4vh", marginTop: "6vh", justifyContent: "center" }}>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
        >
          <Typography level="h4">
            <b>Vt/Nt način obračunavanja</b>
          </Typography>
          <div style={{ paddingLeft: "2vh", marginTop: "2vh" }}>
            <Typography level="body1" sx={{ fontSize: "18px", marginBottom: "3vh" }}>
              Cena na mesec:
            </Typography>
            <Typography level="body1" sx={{ fontSize: "18px" }}>
              Cena na leto:
            </Typography>
          </div>
        </Card>
        <Card
          variant="outlined"
          sx={{ width: 560, height: 250, backgroundColor: "background.level2", alignItems: "left", margin: "1vh" }}
        >
          <Typography level="h4">
            <b>15min intervali način obračunavanja</b>
          </Typography>
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
              <b>Graf primerjave</b>
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
