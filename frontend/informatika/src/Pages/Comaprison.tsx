import Typography from '@mui/joy/Typography';
import Card from '@mui/joy/Card';

export default function Comparison() {
  return (
    <>
      <div style={{ display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ width: 560, height: 250, backgroundColor: 'background.level2', alignItems: 'left', margin: '1vh' }}>
          <Typography level="h4" >
            <b>Vt/Nt način obračunavanja</b>
          </Typography>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba</Typography>
        </Card>
        <Card variant="outlined" sx={{ width: 560, height: 250, backgroundColor: 'background.level2', alignItems: 'left', margin: '1vh' }}>
          <Typography level="h4" >
            <b>15min intervali način obračunavanja</b>
          </Typography>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba</Typography>
        </Card>
      </div>

      <div style={{ display: 'flex', gap: '4vh', marginTop: '6vh', justifyContent: 'center' }}>
      <Card variant="outlined" sx={{ width: 560, height: 250, backgroundColor: 'background.level2', alignItems: 'left', margin: '1vh' }}>
          <Typography level="h4" >
            <b>15min intervali način obračunavanja</b>
          </Typography>
          <Typography level="body1" sx={{ fontSize: '18px' }}>Povprečna poraba</Typography>
        </Card>
      </div>
    </>
  );
}
