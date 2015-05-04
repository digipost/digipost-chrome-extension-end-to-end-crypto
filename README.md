Digipost Chrome Extension for ende-til-ende-kryptering
---------------------------------------------------

Digipost Chrome extension for ende-til-ende-kryptering er en utvidelse til Chrome som en del av ende-til-ende-kryptering i Digipost. Sluttbruker må først opprette et nøkkelpar lokalt på sin maskin. Den offentlige nøkkelen lastes opp til Digipost og benyttes for kryptering fra avsender. Brukeren beholder den private nøkkelen selv, og kan legge den inn i utvidelsen for å automatisk få dekryptert sine dokumenter i nettleseren. Utvidelsen vil aldri sende den private nøkkelen ut av nettleseren – hverken til Digipost eller andre. 

Utvidelsen er open source, og teknisk kyndige brukere oppfordres til å lese gjennom kildekoden for å forsikre seg at privatnøkkelen håndteres riktig. Dersom en bruker av en eller annen grunn ikke ønsker å bruke utvidelsen, er det fullt mulig å laste ned de krypterte dokumentene og dekryptere lokalt.

Siden utvidelser til Google Chrome ikke har tilgang på sikker lagring vil den private nøkkelen lagres i minnet, og forsvinne dersom nettleseren lukkes.


Installasjon
------------
Utvidelsen kan enten installeres fra Chrome Web Store eller direkte fra kildekoden. Å installere fra Web Store gjøres med to enkle klikk, og du vil i  tillegg automatisk få nye versjoner når vi gjør forbedringer i utvidelsen. Hvis du installerer direkte fra kildekoden har du full kontroll over koden som kjører i utvidelsen. Ulempen er at du selv må hente ned nye versjoner. Det kan bety at utvidelsen slutter å virke hvis vi gjør endringer som ikke er bakoverkompatible.

#### Fra Chrome Web Store

Utvidelsen er publisert i [Chrome Web Store](https://chrome.google.com/webstore/detail/digipost-ende-til-ende-kr/faffhbmmemiihphlofdhaolhamjllieg).
 
#### Fra kildekode

Å installere fra kildekoden krever litt mer forkunnskaper enn å installere fra Chrome Web Store. Det er likevel ikke vanskelig hvis du har litt erfaring med Git og Github.

1. Sjekk ut eller last ned kildekoden fra dette repositoriet
2. Skriv inn `chrome://extensions` i adressefeltet i Chrome
3. Kryss av for "Developer mode" opp til høyre
4. Trykk "Load unpacked extension…"-knappen oppe til venstre
5. Velg `extension`-mappa i kildekoden du lastet ned

Hvis installasjonen lyktes skal du nå se et lite Digipost-ikon i adressefeltet hvis du går til [digipost.no](https://www.digipost.no). 

Filer
-----
* **background.js** - Tar i mot meldinger for operasjoner som skal kjøres i bakgrunnen, typisk dekryptering.
* **private_key.js** - Holder på brukerens private nøkkel og gjør dekryptering av dokumenter.
* **content_script.js** - Kjøres når det lastes sider på digipost.no. Injiserer `override.js`. Delegerer dekryptering `background.js`.
* **override.js** - Overskriver JavaScript-metoder i Digipost for å vise krypterte dokumenter. Delegerer nedlasting og dekryptering til `content_script.js`.
* **popup.js** - Logikk for dialogboksen som tar i mot brukerens private nøkkel.

Biblioteker
-----------
* [node-forge](https://github.com/digitalbazaar/forge) patchet med https://github.com/digitalbazaar/forge/pull/201 og bygget med npm run minify. Brukes til kryptooperasjoner.
* [DOMPurify](https://github.com/cure53/DOMPurify) brukes til å vaske krypterte HTML-brev for farlig innhold før visning

Publisering
-----------
Utvidelsen bruker [Gulp](http://gulpjs.com/) til bygging. Kommandoen `gulp` viser hvilke operasjoner som er tilgjengelige. `gulp package` bygger et zip-arkiv som legges i mappen `dist`. De nye versjonene publiseres i [WebStore Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard).

Lisens
------

Kildekoden til Digipost Chrome Plugin for ende-til-ende-kryptering er tilgjengelig som fri programvare under lisensen *Apache License, Version 2.0*, som beskrevet i [lisensfilen](https://github.com/digipost/digipost-ende-til-ende/blob/master/LICENSE "LICENSE").

Bilder og logoer for Posten og Digipost er (C) Posten Norge AS og er ikke lisensiert under *Apache Licence, Versjon 2.0*.
