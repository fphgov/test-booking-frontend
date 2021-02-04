## Test booking frontend

A Főváros Önkormányzata által létrehozott, koronavírus gyorstesztelés menedzseléséhez használt frontend alkalmazás telepítési útmutatója.

#### Telepítés
Az `.env.example` fájlt le kell másolni és az új fájlnak a neve `.env` legyen. Ebbe lehet definiálni a környezeti változókat.

A telepítéshez és a használathoz, használható Docker, de nem követelmény. Abban az esetben, ha nem Docker segítségével tesztelné a webalkalmazást, a webpack.config.js fájlban a host: '0.0.0.0' -> host: 'localhost'-ra cserélendő. Amennyiben a helyi gépre telepítve van a Node.js 14-es verzió, úgy egyszerűen az `npm install` parancssal, feltelepülnek a függőségek. Az `npm start` paranccsal elindul a webpack által inditított szerver, alapból a `8080`-as porton. Amennyiben már éles környzetbe kell a kód, úgy `npm run build` parancsot kell kiadni és a `public` mappában lesznek találhatóak a statikus fájlok, amik a megjelenésért felelnek.

#### Docker telepítés

A Docker konténer létrehozása
```
docker build --tag testing_booking_frontend:latest .
```

Docker image futtatása konzollal (Windows alatt)
```
docker run -it --name testing_booking_frontend --rm -v ${pwd}:/app -p 8080:8080 testing_booking_frontend:latest sh
```

Docker image futtatása konzollal (Linux/MacOS alatt)
```
docker run -it --name testing_booking_frontend --rm -v $(pwd):/app -p 8080:8080 testing_booking_frontend:latest sh
```

Miután a Docker image fut, rendelkezésre fog állni egy shell hozzáférés, ami egyből a `app/` könyvtárat mountolja fel. Itt pedig kiadhatók a következő parancsok `npm install` `npm start` vagy `npm run build` parancsot.

#### Licence
A szoftver az [MIT License](/LICENSE)-et használja.
