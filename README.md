# Informatika - Smart Watt
<p align="center">
  <img src="https://github.com/mihaprah/informatika_PR2/assets/116807398/5d64edfc-01b5-4ab7-9e53-5b793e4d6385" alt="INFORMATIKA">
</p>

**<p align="center">Program za pregled, prikaz in obdelavo podatkov povezanih z porabo eletrične energije, ki temelji na 15 minutnih meritvah.</p>**

## Ključne funkcionalnosti
- Obdeleva prejetih podatkov
  - Nadomeščanje mankajočih vrednosti
  - Preverjanje ustreznosti 15 minutnih meritev
  - Izračun potrebnih vrednosti
- Prikaz zbranih podatkov
  - Prikaz porabe za posamezno omarico
  - Prikaz število zabeležih anomalij
  - Prikaz števila mankajočih podatkov
- Primerjava cen električne energije
  - Način obračunavanja z Vt/Nt proti načinu z 15 min odčitki in časovnimi bloki
  - Razlago 15 min odčitkov in časovnih blokov lahko najdete na [tej povezavi](https://www.zurnal24.si/pod-streho/varcna-hisa/placevanje-po-novem-zapleten-sistem-in-za-nepoucene-tudi-drazji-405870)

## Uporabljene tehnologije
- Frontend
  - `React` (`Typescript`)
- Backend
  - `Java` (Springboot)
  - `PostgreSQL` 

![GitHub language count](https://img.shields.io/github/languages/count/mihaprah/informatika_PR2) ![GitHub top language](https://img.shields.io/github/languages/top/mihaprah/informatika_PR2)

## Razlaga programa
Program obdela prejete podatke, jih primerja z drugimi prejetimi podatki in na podlagi zbranih podatkov vodi analizo nad podatki. Ta analiza je nato vidna s pomočjo spletne aplikacije, ki prikaže zbrane podatke z pomočjo merilskih lestvic in različnih grafov. Gre za podatke dnevnih meritev posameznih merilnih mest, ki so rezultat odbelave prejetih podatkov in medsebojne primerjave.

## Uporabniški vmesnik
<img width="1680" alt="Home-day" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/41a9f782-fc97-4a5a-a95a-0cc12ba2bb10">
<img width="1680" alt="Home-month" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/b93b4320-c2bb-4a11-a98b-eda3c48ac123">
<img width="1680" alt="Home-year" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/d739a605-3819-4a58-b6d2-8428f7fe7ebc">
<img width="1680" alt="History" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/8b478ffb-0832-49c1-a95c-54a8a9513723">
<img width="1680" alt="Comparison" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/f0484851-5a74-4137-af7d-d88df1f5211d">
<img width="1680" alt="Settings" src="https://github.com/mihaprah/informatika_PR2/assets/116807398/0993a1ab-95b5-41cc-b69e-f6b524488572">

## Zunanje odvisnosti
### Recharts
- Program uporablja za izris vseh grafov zunanjo knjižnico za `React` pod imenom `Recharts`. Uporablja stolpične in tortne diagrame, ki so bili narejeni s pomočjo dokumentacije ki je na voljo na [sledeči povezavi](https://recharts.org/en-US).

## REST API - opis
Spodaj je predstavljen opis API-ja za merilne mesta oziroma omarice (cabinet) in merilne podatke (measurement data).

### MERILNE OMARICE
Pridobivanje podatkov o merilnih omaricah.

#### Request - GET ALL
- `GET /cabinet/`
#### Response
- Vrne seznam vseh omaric

#### Request - GET ONE
- `GET /cabinet/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"
#### Response
- `JSON` objekt naslednje oblike
```json
{
  "cabinetId": {String},
  "cabinetNumber": {String},
  "energyCompany": {int},
  "connectionPower": {int},
  "numberOfPhases": {int},
  "consumerGroup": {int},
  "priceBlockOne": {double},
  "priceBlockTwo": {double},
  "priceBlockThree": {double},
  "priceBlockFour": {double},
  "priceBlockFive": {double},
  "penaltiesBlockOne": {double},
  "penaltiesBlockTwo": {double},
  "penaltiesBlockThree": {double},
  "penaltiesBlockFour": {double},
  "penaltiesBlockFice": {double},
  "agreedPowerOne": {double},
  "agreedPowerTwo": {double},
  "agreedPowerThree": {double},
  "agreedPowerFour": {double},
  "agreedPowerFive": {double},
  "highPrice": {double},
  "lowPrice": {double}
}
```

#### Request - PUT
- `PUT /cabinet/settings`
- Request body ima naslednjo obliko `JSON`
```json
{
  "cabinetId": {String},
  "cabinetNumber": {String},
  "energyCompany": {int},
  "connectionPower": {int},
  "numberOfPhases": {int},
  "consumerGroup": {int},
  "priceBlockOne": {double},
  "priceBlockTwo": {double},
  "priceBlockThree": {double},
  "priceBlockFour": {double},
  "priceBlockFive": {double},
  "penaltiesBlockOne": {double},
  "penaltiesBlockTwo": {double},
  "penaltiesBlockThree": {double},
  "penaltiesBlockFour": {double},
  "penaltiesBlockFice": {double},
  "agreedPowerOne": {double},
  "agreedPowerTwo": {double},
  "agreedPowerThree": {double},
  "agreedPowerFour": {double},
  "agreedPowerFive": {double},
  "highPrice": {double},
  "lowPrice": {double}
}
```
- Ne vrača ničesar

### MERILNI PODATKI
Pridobivanje podatkov o dnevnih meritvah za vse omarice.
#### Request - GET ALL
- `GET /measurement/`
#### Response
- Vrne seznam vseh dnevnih meritev za vse omarice
```JSON
{
  "date": {LocalDate},
  "usage": {double},
  "register": {String},
  "filledWithZeros": {boolean},
  "modifiedWithEvenDatesStrategy": {boolean},
  "invalidFlag": {boolean},
  "onlyMeasuredValue": {boolean},
  "measuredValue": {double},
  "highUsage": {double},
  "lowUsage": {double},
}
``` 

#### Request - GET ONE
- `GET /measurement/day/{date}/{cabinet_id}/`
- Primer {date} je npr. "2022-01-01"
- Primer {cabinet_id} je npr. "5-001"
#### Response
- Vrne seznam dnevnih meritev za določen datum in meritve prejšnjih 10ih dni
```JSON
{
  "date": {LocalDate},
  "usage": {double},
  "register": {String},
  "filledWithZeros": {boolean},
  "modifiedWithEvenDatesStrategy": {boolean},
  "invalidFlag": {boolean},
  "onlyMeasuredValue": {boolean},
  "measuredValue": {double},
  "highUsage": {double},
  "lowUsage": {double},
}
``` 

#### Request - GET ALL BY CABINET ID
- `GET /measurement/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"
#### Response
- Vrne seznam vseh meritev ene omarice
```JSON
{
  "date": {LocalDate},
  "usage": {double},
  "register": {String},
  "filledWithZeros": {boolean},
  "modifiedWithEvenDatesStrategy": {boolean},
  "invalidFlag": {boolean},
  "onlyMeasuredValue": {boolean},
  "measuredValue": {double},
  "highUsage": {double},
  "lowUsage": {double},
}
``` 

#### Request - GET ALL BY CABINET ID FOR ONE MONTH
- `GET /measurement/month/{cabinet_id}/{month}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za mesec januar leta 2022

#### Response
- Vrne seznam vseh dnevnih meritev določene omarice za določen mesec v nekem letu
```JSON
{
  "date": {LocalDate},
  "usage": {double},
  "register": {String},
  "filledWithZeros": {boolean},
  "modifiedWithEvenDatesStrategy": {boolean},
  "invalidFlag": {boolean},
  "onlyMeasuredValue": {boolean},
  "measuredValue": {double},
  "highUsage": {double},
  "lowUsage": {double},
}
``` 

#### Request - GET ALL BY CABINET ID FOR ONE YEAR
- `GET /measurement/year/{cabinet_id}/{year}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za leta 2022

#### Response
- Vrne seznam vseh dnevnih meritev določene omarice za določeno leto
```JSON
{
  "date": {LocalDate},
  "usage": {double},
  "register": {String},
  "filledWithZeros": {boolean},
  "modifiedWithEvenDatesStrategy": {boolean},
  "invalidFlag": {boolean},
  "onlyMeasuredValue": {boolean},
  "measuredValue": {double},
  "highUsage": {double},
  "lowUsage": {double},
}
``` 

#### Request - GET USAGE FOR YEAR
- `GET /measurement/usage/{cabinet_id}/{date}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za leta 2022

#### Response
- Vrne število porabljene energije za eno merilno omarico za določeno leto
```JSON
{
  "usage": {Double}
}
```
### 15 MIN INTERVALI
Pridobivanje podatkov povezanih z 15 min intervali
#### Request - GET FOR ONE DAY
- `GET /interval/day/{cabine_id}/{day}`
- Primer {cabinet_id} je npr. "5-001"
- Primer {day} je npr. "2022-01-01" za dan 1. januar 2022

#### Response
- Vrne podatke za 15 min intervale za en dan v `JSON` obliki
```JSON
{
  "timeStamp": {Timestamp},
  "hourlyUsage": {double},
  "typeOfDay": {int},
  "timeBlock": {int},
  "season": {int},
}
``` 

###$ Request - GET FOR ONE YEAR
- `GET /interval/year/{cabinet_id}/{year}`
-  Primer {cabinet_id} je npr. "5-001"
-  Primer {year} je npr. "2022-01-01" za leto 2022

#### Response
- Vrne podatke za 15 min intervale za eno leto v `JSON` obliki
```JSON
{
  "timeStamp": {Timestamp},
  "hourlyUsage": {double},
  "typeOfDay": {int},
  "timeBlock": {int},
  "season": {int},
}
``` 

## Namestitev programa
Celotna aplikacija je razdeljena na `backend`, ki vsebuje vse potebno za obdelavo podatkov, ter tudi API vmesnik. Drugi del aplikacije se nahaja v `frontend` mapi, kjer je React aplikacija za prikaz podatkov. Tako Springboot `backend`, kot tudi Postgres `podatkovna baza` sta nameščena, pri ponudniku gostovanja [Railway](https://railway.app). Aplikacija gostoju na platformi [Firebase in je na voljo na tej povezavi](https://informatika-97440.web.app). Dostop do spletne aplikacije je omejen z uporabniškim imenom in geslom.

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mihaprah/informatika_PR2) ![GitHub repo file count](https://img.shields.io/github/directory-file-count/mihaprah/informatika_PR2) ![GitHub repo size](https://img.shields.io/github/repo-size/mihaprah/informatika_PR2)

## Način nadaljnega razvoja
Aplikacija bi lahko dobila mobilno aplikacijo za končnega uporabnika. Ta bi vnesel številko domačega merilnega mesta in bi imel dostop do podatkov meritev. Prav tako bi lahko z uporabo strojnega učenja razvili funkcionalnost, ki bi uporabnika obvestila, kdaj bi bilo najbolj ugodno porabljati velike količine električne energije.

## Avtorji
- [Miha Prah](https://github.com/mihaprah)
- [Matija Krsnik](https://github.com/Matija334)
- [Anže Golob](https://github.com/anzo26)

