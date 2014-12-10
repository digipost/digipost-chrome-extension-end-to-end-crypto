Digipost Chrome Plugin for ende-til-ende-kryptering
---------------------------------------------------


Filer
-----
* **background.js** - Sørger for at plugin trigger
* **content_script.js** - kjøres når siden lastes. Gjør dekryptering og unzipping
* **override.js** - overrider metoder i Digipost for å vist brev (sender til content_script.js for dekryptering først)


Biblioteker
-----------
* **gzip.js** - node modul - Kjørt gjennom browserify og endret for å legge til gzip på window
* **forge.bundle.js** - node-forge patchet med https://github.com/digitalbazaar/forge/pull/201 og bygget med npm run minify

Lisens
------

Kildekoden til Digipost Chrome Plugin for ende-til-ende-kryptering er tilgjengelig som fri programvare under lisensen *Apache License, Version 2.0*, som beskrevet i [lisensfilen](https://github.com/digipost/ios/blob/master/LICENSE "LICENSE").

Bilder og logoer for Posten og Digipost er (C) Posten Norge AS og er ikke lisensiert under *Apache Licence, Versjon 2.0*.
