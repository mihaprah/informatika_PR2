# PRAKTIKUM 2 - Informatika
<p align="center">
  <img src="https://github.com/mihaprah/informatika_PR2/assets/116807398/ea5ef793-75f8-4632-9ce4-307f6c11d588" alt="INFORMATIKA-2">
</p>

Program za pregled, prikaz in obdelavo podatkov povezanih z porabo eletrične energije, ki temelji na 15 minutnih meritvah.

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
  - Star način obračunavanja proti novemu načinu

## Namestitev programa
Celotna aplikacija je razdeljena na `backend`, ki vsebuje vse potebno za obdelavo podatkov, ter tudi API vmesnik. Drugi del aplikacije se nahaja v `frontend` mapi, kjer je React aplikacija za prikaz podatkov.

![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/mihaprah/informatika_PR2) ![GitHub repo file count](https://img.shields.io/github/directory-file-count/mihaprah/informatika_PR2) ![GitHub repo size](https://img.shields.io/github/repo-size/mihaprah/informatika_PR2)

## Uporabljene tehnologije
- Frontend
  - `React` (`Typescript`)
- Backend
  - `Java` (Springboot)
  - `PostgreSQL` 

![GitHub language count](https://img.shields.io/github/languages/count/mihaprah/informatika_PR2) ![GitHub top language](https://img.shields.io/github/languages/top/mihaprah/informatika_PR2)

## Razlaga programa
Program obdela prejete podatke, jih primerja z drugimi prejetimi podatki in na podlagi zbranih podatkov vodi analizo nad podatki. Ta analiza je nato vidna s pomočjo spletne aplikacije, ki prikaže zbrane podatke z pomočjo merilskih lestvic in različnih grafov. Gre za podatke dnevnih meritev posameznih merilnih mest, ki so rezultat odbelave prejetih podatkov in medsebojne primerjave.

## REST API - opis
Spodaj je predstavljen opis API-ja za merilne mesta oziroma omarice (cabinet) in merilne podatke (measurement data).
### Merilne omarice
Pridobivanje podatkov o merilnih omaricah.
#### Request GET ALL
`GET /cabinet/`
#### Response
- Vrne seznam vseh omaric

#### Request GET ONE
`GET /cabinet/{cabinet_id}/`
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
#### Request POST
`POST /cabinet/`
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
#### Response
- Ne vrača ničesar

#### Request PUT
`PUT /cabinet/`
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
#### Response
- Ne vrača ničesar

#### Request DELETE
`DELETE /cabinet/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"

#### Response
- Ne vrača ničesar

### Merilni podatki
Pridobivanje podatkov o dnevnih meritvah za vse omarice.
#### Request GET ALL
`GET /measurement/`
#### Response
- Vrne seznam vseh dnevnih meritev za vse omarice

#### Request GET ONE
`GET /measurement/{/date}/{cabinet_id}/`
- Primer {date} je npr. "2022-01-01"
- Primer {cabinet_id} je npr. "5-001"
#### Response
- `JSON` objekt naslednje oblike
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
#### Request GET ALL BY CABINET ID
`GET /measurement/{cabinet_id}/`
- Primer {cabinet_id} je npr. "5-001"
#### Response
- Vrne seznam vseh meritev ene omarice

#### Request POST
`POST /measurement/`
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
#### Response
- Ne vrača ničesar

#### Request PUT
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
#### Response
- Ne vrača ničesar

#### Request DELETE
`DELETE /measurement/{measurement_id}/`
- Primer {measurement_id} je npr. "1"

#### Response
- Ne vrača ničesar
