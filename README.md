# Informatika
<p align="center">
  <img src="https://github.com/mihaprah/informatika_PR2/assets/116807398/ea5ef793-75f8-4632-9ce4-307f6c11d588" alt="INFORMATIKA-2">
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
TODO posnetni zaslona

## Zunanje odvisnosti
### Recharts
- Program uporablja za izris vseh grafov zunanjo knjižnico za `React` pod imenom `Recharts`. Uporablja stolpične in tortne diagrame, ki so bili narejeni s pomočjo dokumentacije ki je na voljo na [tej povezavi](https://recharts.org/en-US).

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
  "cabinetId": "{String}",
  "cabinetNumber": "{String}",
  "energyCompany": "{int}",
  "connectionPower": "{int}",
  "numberOfPhases": "{int}",
  "consumerGroup": "{int}"
}
```
#### Request - POST
- `POST /cabinet/`
- V request body gre naslednji `JSON`
```json
{
  "cabinetId": "{String}",
  "cabinetNumber": "{String}",
  "energyCompany": "{int}",
  "connectionPower": "{int}",
  "numberOfPhases": "{int}",
  "consumerGroup": "{int}"
}
```
- Ne vrača ničesar

#### Request - PUT
- `PUT /cabinet/`
- Request body ima naslednjo obliko `JSON`
```json
{
  "cabinetId": "{String}",
  "cabinetNumber": "{String}",
  "energyCompany": "{int}",
  "connectionPower": "{int}",
  "numberOfPhases": "{int}",
  "consumerGroup": "{int}"
}
```
- Ne vrača ničesar

#### Request - DELETE
- `DELETE /cabinet/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"
- Ne vrača ničesar

### MERILNI PODATKI
Pridobivanje podatkov o dnevnih meritvah za vse omarice.
#### Request - GET ALL
- `GET /measurement/`
#### Response
- Vrne seznam vseh dnevnih meritev za vse omarice

#### Request - GET ONE
- `GET /measurement/day/{date}/{cabinet_id}/`
- Primer {date} je npr. "2022-01-01"
- Primer {cabinet_id} je npr. "5-001"
#### Response
- Vrne seznam dnevnih meritev za določen datum in meritve prejšnjih 10ih dni

#### Request - GET ALL BY CABINET ID
- `GET /measurement/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"
#### Response
- Vrne seznam vseh meritev ene omarice

#### Request - GET ALL BY CABINET ID FOR ONE MONTH
- `GET /measurement/month/{cabinet_id}/{month}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za mesec januar leta 2022

#### Response
- Vrne seznam vseh dnevnih meritev določene omarice za določen mesec v nekem letu

#### Request - GET ALL BY CABINET ID FOR ONE YEAR
- `GET /measurement/year/{cabinet_id}/{year}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za leta 2022

#### Response
- Vrne seznam vseh dnevnih meritev določene omarice za določeno leto

#### Request - GET USAGE FOR YEAR
- `GET /measurement/usage/{cabinet_id}/{date}/`
- Primer {cabinet_id} je npr. "5-001"
- Primer {month} je npr. "2022-01-01" za leta 2022

#### Response
- Vrne število porabljene energije za eno merilno omarico za določeno leto
```
usage {Double}
```

#### Request - POST
- `POST /measurement/`
- V request body gre naslednji `JSON`
```json
{
  "id": "{Long}",
  "date": "{Date}",
  "filledWithZeros": "{boolean}",
  "invalidFlag": "{boolean}",
  "modifiedWithEvenDatesStrategy": "{boolean}",
  "measuredValue": "{double}",
  "register": "{String}",
  "cabinetId": "{String}",
  "highUsage": "{double}",
  "lowUsage": "{double}"
}
```
- Ne vrača ničesar

#### Request - PUT
`PUT /measurement/`
- V request body gre naslednji `JSON`
```json
{
  "id": "{Long}",
  "date": "{Date}",
  "filledWithZeros": "{boolean}",
  "invalidFlag": "{boolean}",
  "modifiedWithEvenDatesStrategy": "{boolean}",
  "measuredValue": "{double}",
  "register": "{String}",
  "cabinetId": "{String}",
  "highUsage": "{double}",
  "lowUsage": "{double}"
}
```
- Ne vrača ničesar

#### Request - DELETE
- `DELETE /measurement/{measurement_id}/`
- Primer {measurement_id} je npr. "1"
- Ne vrača ničesar

## Namestitev programa
Celotna aplikacija je razdeljena na `backend`, ki vsebuje vse potebno za obdelavo podatkov, ter tudi API vmesnik. Drugi del aplikacije se nahaja v `frontend` mapi, kjer je React aplikacija za prikaz podatkov.

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mihaprah/informatika_PR2) ![GitHub repo file count](https://img.shields.io/github/directory-file-count/mihaprah/informatika_PR2) ![GitHub repo size](https://img.shields.io/github/repo-size/mihaprah/informatika_PR2)

## Način nadaljnega razvoja
Aplikacija bi lahko dobila mobilno aplikacijo za končnega uporabnika. Ta bi vnesel številko domačega merilnega mesta in bi imel dostop do podatkov meritev. Prav tako bi lahko z uporabo strojnega učenja razvili funkcionalnost, ki bi uporabnika obvestila, kdaj bi bilo najbolj ugodno porabljati velike količine električne energije.

## Avtorji
- [Miha Prah](https://github.com/mihaprah)
- [Matija Krsnik](https://github.com/Matija334)
- [Anže Golob](https://github.com/anzo26)

