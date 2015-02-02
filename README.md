Digipost Chrome plugin for ende-til-ende-kryptering
---------------------------------------------------

Digipost Chrome plugin for ende-til-ende-kryptering er en plugin til Chrome som en del av ende-til-ende-kryptering i Digipost. Bruker oppretter (eller har opprettet) et par krypteringsnøkler. Den offentlige nøkkelen lastes opp til Digipost og benyttes for kryptering fra avsender. Den private beholder bruker selv, og kan benytte denne plugin for å dekryptere dokumenter i nettleseren. Privatnøkkelen vil med denne plugin kun forbli på brukers maskin og vil aldri bli utvekslet med Digipost eller andre.

Det er valgfritt å benytte denne plugin, dersom man ønsker å benytte ende-til-ende-kryptering i Digipost.

Filer
-----
* **background.js** - Sørger for at plugin trigger.
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
