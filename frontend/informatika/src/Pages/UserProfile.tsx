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
    const handleChange = (e: { target: { value: any; name: any } }) => {
        //console.log(e.target.value);
        setCabinetID(e.target.value);
        props.onChange(e.target.value);
    };

    useEffect(() => {
        const getCabinetData = async () => {
            try {
                const res = await api.get("/cabinet");
                const cabinets = res.data;
                setData(cabinets);
            } catch (error) {
                console.log(error)
            }
        }
        getCabinetData();
    }, [cabinetID])

    if(data.length !== 0){
        data.map((cabinet: Cabinet) => {
            cabinetIDs.push(cabinet.cabinetId);
        })
    }
    return (
        <div className="user-profile-container">
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 270,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    mr:3
                }}
            >
                <Typography level="h1" sx={{ fontSize: "22px" }}>
                    Profil uporabnika
                </Typography>
                <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                    Email:
                </Typography>
            </Card>
            <Card
                variant="outlined"
                sx={{
                    width: 559,
                    height: 270,
                    backgroundColor: "background.level2",
                    alignItems: "left",
                    ml: 2, // Add margin left to create spacing between cards
                }}
            >
                <Typography level="h1" sx={{ fontSize: "22px" }}>
                    Podatki merilnega števca
                </Typography>
                <Box sx={{ minWidth: 120, mt:5 }}>
                    <FormControl>
                        <InputLabel>Številka števca</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Številka števca"
                            style={{ height: "48px", width:"200px"}}
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
                <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                    Številka števca: {cabinetID}
                </Typography>
            </Card>
            <div className="new-row-container">
                <Card
                    variant="outlined"
                    sx={{
                        width: 559,
                        height: 270,
                        backgroundColor: "background.level2",
                        alignItems: "left",
                        mt: 2, // Add margin top to create spacing between rows
                    }}
                >
                    <Typography level="h1" sx={{ fontSize: "22px" }}>
                        Nastavitve
                    </Typography>
                    <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                        Zakupljena poraba:
                    </Typography>
                    <TextField
                        id="zakupljena-poraba"
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                    <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                        Cena penalov:
                    </Typography>
                    <TextField
                        id="cena-penalov"
                        variant="outlined"
                        size="small"
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        sx={{
                            display: "block",
                            margin: "0 auto",
                            mt: "4vh",
                            backgroundColor: "#023E8A"
                        }}
                    >
                        Spremeni nastavitve
                    </Button>
                </Card>
            </div>
        </div>
    );
}

