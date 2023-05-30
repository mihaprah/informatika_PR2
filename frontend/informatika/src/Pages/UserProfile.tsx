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

const initialState = {
    cabinetId: "",
    cabinetNumber: "",
    energyCompany: "",
    connectionPower: "",
    numberOfPhases: 0,
    consumerGroup: 0,
    agreedPowerOne: 0,
    agreedPowerTwo: 0,
    agreedPowerThree: 0,
    agreedPowerFour: 0,
    agreedPowerFive: 0,
    priceBlockOne: 0,
    priceBlockTwo: 0,
    priceBlockThree: 0,
    priceBlockFour: 0,
    priceBlockFive: 0,
    penaltiesBlockOne: 0,
    penaltiesBlockTwo: 0,
    penaltiesBlockThree: 0,
    penaltiesBlockFour: 0,
    penaltiesBlockFive: 0,
    lowPrice: 0,
    highPrice: 0
};

export default function UserProfile(props: Props) {
    const [data, setData] = useState<Cabinet[]>([]);
    const cabinetIDs: string[] = [];
    const [cabinetID, setCabinetID] = useState(props.cabinetID);
    const [selectedCabinet, setSelectedCabinet] = useState<Cabinet>(initialState);
    const handleChangeCabinet = (e: { target: { value: any; name: any } }) => {
        //console.log(e.target.value);
        setCabinetID(e.target.value);
        props.onChange(e.target.value);
        changeCabinet(e.target.value);
    };
    const handleChangeSettings = (e) => {
        const { value, name } = e.target;

        setSelectedCabinet((prevState: Cabinet) => {
            const nextState = {
                ...prevState,
                [name]: value,
            };
            return nextState;
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(selectedCabinet);
        api.put("/cabinet/settings", selectedCabinet);
    };

    const changeCabinet = async (id: string) => {
        console.log(id);
        const res = await api.get("/cabinet/" + id);
        setSelectedCabinet(res.data);
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
                    width: 600,
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
                    width: 600,
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
                            onChange={handleChangeCabinet}
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
                    width: 600,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px", mb: 1}}>
                    Nastavitve Vt/Mt
                </Typography>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", marginTop: "5px", justifyContent:"space-between"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                Manjša tarifa
                            </Typography>
                            <TextField type={"number"} id="lowPrice" name="lowPrice" value={selectedCabinet.lowPrice} variant="outlined" size="small" placeholder={"Cena (€)"}  label="Cena (€)"
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px", justifyContent:"space-between"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                Višja tarifa
                            </Typography>
                            <TextField type={"number"} id="highPrice" name="highPrice" value={selectedCabinet.highPrice} variant="outlined" size="small" placeholder={"Cena (€)"}  label="Cena (€)"
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
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
                    onClick={handleSubmit}
                >
                    Spremeni nastavitve
                </Button>
            </Card>
            <Card
                variant="outlined"
                sx={{
                    width: 600,
                    height: 350,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mt: 2, mr: 2
                }}
            >
                <Typography level="h1" sx={{fontSize: "22px", mb: 1}}>
                    Nastavitve časovnih blokov
                </Typography>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                    <div style={{display: "flex", flexDirection: "column"}}>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                1 -
                            </Typography>
                            <TextField type={"number"} id="agreedPowerOne" name="agreedPowerOne" value={selectedCabinet.agreedPowerOne} variant="outlined" size="small" placeholder={"Moč (kWh)"} label={"Moč (kWh)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="priceBlockOne" name="priceBlockOne" value={selectedCabinet.priceBlockOne} variant="outlined" size="small" placeholder={"Cena (€)"} label={"Cena (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="penaltiesBlockOne" name="penaltiesBlockOne" value={selectedCabinet.penaltiesBlockOne} variant="outlined" size="small" placeholder={"Cena penala (€)"} label={"Cena penala (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                2 -
                            </Typography>
                            <TextField type={"number"} id="agreedPowerTwo" name="agreedPowerTwo" value={selectedCabinet.agreedPowerTwo} variant="outlined" size="small" placeholder={"Moč (kWh)"} label={"Moč (kWh)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="priceBlockTwo" name="priceBlockTwo" value={selectedCabinet.priceBlockTwo} variant="outlined" size="small" placeholder={"Cena (€)"} label={"Cena (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="penaltiesBlockTwo" name="penaltiesBlockTwo" value={selectedCabinet.penaltiesBlockTwo} variant="outlined" size="small" placeholder={"Cena penala (€)"} label={"Cena penala (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                3 -
                            </Typography>
                            <TextField type={"number"} id="agreedPowerThree" name="agreedPowerThree" value={selectedCabinet.agreedPowerThree}variant="outlined" size="small" placeholder={"Moč (kWh)"} label={"Moč (kWh)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="priceBlockThree" name="priceBlockThree" value={selectedCabinet.priceBlockThree} variant="outlined" size="small" placeholder={"Cena (€)"} label={"Cena (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="penaltiesBlockThree" name="penaltiesBlockThree" value={selectedCabinet.penaltiesBlockThree} variant="outlined" size="small" placeholder={"Cena penala (€)"} label={"Cena penala (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                4 -
                            </Typography>
                            <TextField type={"number"} id="agreedPowerFour" name="agreedPowerFour" value={selectedCabinet.agreedPowerFour} variant="outlined" size="small" placeholder={"Moč (kWh)"} label={"Moč (kWh)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="priceBlockFour" name="priceBlockFour" value={selectedCabinet.priceBlockFour} variant="outlined" size="small" placeholder={"Cena (€)"} label={"Cena (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"}id="penaltiesBlockFour" name="penaltiesBlockFour" value={selectedCabinet.penaltiesBlockFour} variant="outlined" size="small" placeholder={"Cena penala (€)"} label={"Cena penala (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                        </div>
                        <div style={{display: "flex", marginTop: "5px"}}>
                            <Typography level="body1" sx={{fontSize: "18px", mt: 1, mr: 2}}>
                                5 -
                            </Typography>
                            <TextField type={"number"} id="agreedPowerFive" name="agreedPowerFive" value={selectedCabinet.agreedPowerFive} variant="outlined" size="small" placeholder={"Moč (kWh)"} label={"Moč (kWh)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="priceBlockFive" name="priceBlockFive" value={selectedCabinet.priceBlockFive} variant="outlined" size="small" placeholder={"Cena (€)"} label={"Cena (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
                            <TextField type={"number"} id="penaltiesBlockFive" name="penaltiesBlockFive" value={selectedCabinet.penaltiesBlockFive} variant="outlined" size="small" placeholder={"Cena penala (€)"} label={"Cena penala (€)"}
                                       style={{width: "150px", marginRight: "20px", marginTop: "5px"}} onChange={handleChangeSettings}/>
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
                    onClick={handleSubmit}
                >
                    Spremeni nastavitve
                </Button>
            </Card>
        </div>
    );
}
