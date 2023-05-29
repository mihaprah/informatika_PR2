import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import {TextField, Button, InputLabel, Box} from "@mui/material";
import "../styles/UserProfile.css";
import {useEffect, useState} from "react";
import api from "../Service/api.tsx";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

interface Props {
    onChange: (id: string) => void;
    cabinetID: string;
}

export default function UserProfile(props: Props) {
    const [data, setData] = useState<Cabinet[]>([]);
    const cabinetIDs: string[] = [];
    const [cabinetID, setCabinetID] = useState(props.cabinetID);
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet>();
    const handleChange = (e: { target: { value: any; name: any } }) => {
        //console.log(e.target.value);
        setCabinetID(e.target.value);
        props.onChange(e.target.value);
        changeCabinet(e.target.value);
    };

    const changeCabinet = async (id: string) => {
        console.log(id);
        const res = await api.get("/cabinet/" + id);
        setSelectedCabinet(res.data);
        console.log(res.data);
    };

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/cabinet");
                const cabinets = res.data;
                setData(cabinets);
            } catch (error) {
                console.log(error);
            }
        };
        getCabinetData();
        changeCabinet(props.cabinetID);
    }, [cabinetID]);

    if (data.length !== 0) {
        data.map((cabinet: Cabinet) => {
            cabinetIDs.push(cabinet.cabinetId);
        });
    }
    return (
        <div className="container">
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px"}}>
                    Podatki za omarico {selectedCabinet?.cabinetId}
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Številka omarice: {selectedCabinet?.cabinetNumber}
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Distribucijsko podjetje: {selectedCabinet?.energyCompany}
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Število priključkov: {selectedCabinet?.numberOfPhases}
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Odjemna skupina:{" "}
                    {selectedCabinet?.consumerGroup == 1
                        ? "Javna razsvestljava"
                        : selectedCabinet?.consumerGroup == 2
                            ? "Gospodinjstvo"
                            : selectedCabinet?.consumerGroup == 3
                                ? "Brez merljive moči"
                                : selectedCabinet?.consumerGroup == 4
                                    ? "T >= 2500 ur"
                                    : selectedCabinet?.consumerGroup == 5
                                        ? "T < 2500 ur"
                                        : selectedCabinet?.consumerGroup == 6
                                            ? "6000 > T >= 2500 ur"
                                            : "T >= 6000 ur"}
                </Typography>
            </Card>
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px"}}>
                    Sprememba merilnega števca
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Številka trenutnega števca: {cabinetID}
                </Typography>
                <Box sx={{minWidth: 120, mt: 5}}>
                    <FormControl>
                        <InputLabel>Nov števec</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Številka števca"
                            style={{height: "48px", width: "200px"}}
                            value={cabinetID}
                            onChange={handleChange}
                        >
                            {cabinetIDs.map((cabinetId) => (
                                <MenuItem key={cabinetId} value={cabinetId}>
                                    {cabinetId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </Card>
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px"}}>
                    Splošne nastavitve
                </Typography>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Dogovorjena poraba (kWh/mesec):
                </Typography>
                <TextField id="zakupljena-poraba" variant="outlined" size="small" style={{width: "300px"}}/>
                <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                    Cena penalov:
                </Typography>
                <TextField id="cena-penalov" variant="outlined" size="small" style={{width: "300px"}}/>
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        display: "block",
                        margin: "0 auto",
                        backgroundColor: "#023E8A",
                        bottom: "25px",
                        left: "190px"
                    }}
                >
                    Spremeni nastavitve
                </Button>
            </Card>
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px"}}>
                    Nastavitve cen blokov
                </Typography>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                            Višja sezona (November - Februar):
                        </Typography>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                1 -
                            </Typography>
                            <TextField id="visja-sezona-blok1" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                2 -
                            </Typography>
                            <TextField id="visja-sezona-blok2" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                3 -
                            </Typography>
                            <TextField id="visja-sezona-blok3" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                4 -
                            </Typography>
                            <TextField id="visja-sezona-blok4" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                    </div>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <Typography level="body1" sx={{fontSize: "18px", mt: 2}}>
                            Nižja sezona (Marec - Oktober):
                        </Typography>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                2 -
                            </Typography>
                            <TextField id="nizja-sezona-blok2" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                3 -
                            </Typography>
                            <TextField id="nizja-sezona-blok3" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                4 -
                            </Typography>
                            <TextField id="nizja-sezona-blok4" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                5 -
                            </Typography>
                            <TextField id="nizja-sezona-blok5" variant="outlined" size="small"
                                       style={{width: "150px"}}/>
                        </div>
                    </div>
                </div>
                <Button
                    variant="contained"
                    sx={{
                        position: "absolute",
                        display: "block",
                        margin: "0 auto",
                        backgroundColor: "#023E8A",
                        bottom: "25px",


                    }}
                >
                    Spremeni nastavitve
                </Button>
            </Card>
        </div>
    );
}
