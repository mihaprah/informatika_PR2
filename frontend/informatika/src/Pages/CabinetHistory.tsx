import Typography from '@mui/joy/Typography';
import { useNavigate } from "react-router";
import Card from '@mui/joy/Card';

export default function CabinetHistory() {
  return (
    <>
      <div>
        <b>Zgodovina meritev - št. merilne omarice: 5-001</b>
      </div>
      <div style={{ display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center', }}>
        <Card variant="outlined" sx={{ width: 1165, height: 500, backgroundColor: 'background.level2', alignItems: 'center' }}>

        </Card>
      </div>

    </>
  );
}
