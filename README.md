Digipost Chrome Extension for ende-til-ende-kryptering
---------------------------------------------------

Digipost Chrome extension for ende-til-ende-kryptering er en utvidelse til Chrome som en del av ende-til-ende-kryptering i Digipost. Sluttbruker må først opprette et nøkkelpar lokalt på sin maskin. Den offentlige nøkkelen lastes opp til Digipost og benyttes for kryptering fra avsender. Brukeren beholder den private nøkkelen selv, og kan legge den inn i utvidelsen for å automatisk få dekryptert sine dokumenter i nettleseren. Utvidelsen vil aldri sende den private nøkkelen ut av nettleseren – hverken til Digipost eller andre. 

Utvidelsen er open source, og teknisk kyndige brukere oppfordres til å lese gjennom kildekoden for å forsikre seg at privatnøkkelen håndteres riktig. Dersom en bruker av en eller annen grunn ikke ønsker å bruke utvidelsen, er det fullt mulig å laste ned de krypterte dokumentene og dekryptere lokalt.

Siden utvidelser til Google Chrome ikke har tilgang på sikker lagring vil den private nøkkelen lagres i minnet, og forsvinne dersom nettleseren lukkes.

Filer
-----
* **background.js** - Sørger for at extension trigger.
* **content_script.js** - kjøres når siden lastes. Gjør dekryptering og unzipping.
* **override.js** - overrider metoder i Digipost for å vise dokumenter (sender til content_script.js for dekryptering først).

Biblioteker
-----------
* **gzip.js** - node modul - Kjørt gjennom browserify og endret for å legge til gzip på window.
* **forge.bundle.js** - node-forge patchet med https://github.com/digitalbazaar/forge/pull/201 og bygget med npm run minify.

Lisens
------

Kildekoden til Digipost Chrome Plugin for ende-til-ende-kryptering er tilgjengelig som fri programvare under lisensen *Apache License, Version 2.0*, som beskrevet i [lisensfilen](https://github.com/digipost/digipost-ende-til-ende/blob/master/LICENSE "LICENSE").

Bilder og logoer for Posten og Digipost er (C) Posten Norge AS og er ikke lisensiert under *Apache Licence, Versjon 2.0*.
