import Typography from "@mui/joy/Typography";
import Card from "@mui/joy/Card";
import { TextField, Button } from "@mui/material";
import "../styles/UserProfile.css";

export default function UserProfile() {
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
                <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                    Številka števca:
                </Typography>
                <TextField
                    id="stevilka-stevca"
                    variant="outlined"
                    size="small"
                    fullWidth
                />
                <Typography level="body1" sx={{ fontSize: "18px", mt: 2 }}>
                    Tip objekta:
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        display: "block",
                        margin: "0 auto",
                        mt: "9vh",
                        backgroundColor: "#023E8A",
                    }}
                >
                    Posodobi števec
                </Button>
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
