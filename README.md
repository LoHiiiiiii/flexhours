# Doggotime - Fleksituntien seuraamisjärjestelmä

[Heroku](https://fs-project-flextime.herokuapp.com/calendar) - suljetaan 28.11. kun herokun ilmainen tier päättyy

[Tuntikirjanpito](kirjanpito/tuntikirjanpito.md)

Wunderdogilla on käytössä liukuvat työajat. Doggotime on työkalu, jolla Harvestista saatuja tuntimerkintöjä verrataan siihen, kuinka paljon töitä tulisi olla tehty. Poikkeamista työntekijä voi päätellä, kuinka paljon fleksivapaata tai fleksiylitöitä hänen pitää tehdä. Kalenterista myös näkee pyhät, sekä erikoispäiville syyt poissaoloille.

Tein projektin itsenäisesti. Se annettiin minulle kunnossa, joka löytyy branchista startstate. Tila jossa se oli ns. valmis, jota myöhempiä muokkauksia en ottanut huomioon tuntiarvioinnissa, löytyy branchista endstate. 


Tämä on versio työkalusta, jossa toimintaa voi katsastaa ilman Harvest käyttäjää. Dummydata toimii seuraavalla tavalla:

ensimmäinen rivi on muotoa:
```
<Nimi> | <"nykyinen" päivämäärä> | <Kuinka monta tuntia merkkaamattomana arkipäivänä tulisi töitä tehdä>
```

Muut rivit ovat tehdyille työpäiville, ja ovat muotoa:
```
<Päivämäärä> | <tehdyt tunnit> | <tähdätyt tunnit> | <erikoispäivän tunnus (ignore | dayoff | overtime | timing)(voi jättää tyhjäksi)> | <kuvaus (voi jättää tyhjäksi)>
```
