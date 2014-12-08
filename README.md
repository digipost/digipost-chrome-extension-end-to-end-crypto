Digipost Chrome Plugin for ende-til-ende-kryptering
---------------------------------------------------


Filer
-----
* **background.js** - Sørger for at plugin trigger
* **content_script.js** - kjøres når siden lastes. Gjør dekryptering og unzipping
* **override.js** - overrider metoder i Digipost for å vist brev (sender til content_script.js for dekryptering først)


Biblioteker
-----------
* **gzip.js** - node modul - Kjørt gjennom browserify og ednre for å legge til gzip på window
* **forge.bundle.js** - node modul - bygget med npm run minify - patchet versjon for å støtte PKCS#7 recipientInfo version 2

