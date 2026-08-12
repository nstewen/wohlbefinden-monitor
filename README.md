# Wohlbefinden-Monitor

Ein täglicher Fragebogen zum eigenen Befinden — und die Auswertung, welche
Gewohnheiten damit zusammenhängen. Läuft vollständig im Browser, ohne Server,
ohne Konto, ohne Netzverbindung.

## Was die App tut

- **Fragebogen.** Fragen sind entweder Ja/Nein oder eine Skala von 1,0 bis 5,0.
  Eine Frage kann an einer anderen hängen: „Wie viel Sport?“ wird nur gestellt,
  wenn „Sport gemacht?“ mit Ja beantwortet wurde.
- **Korrelationen.** Pearson zwischen der Grundfrage nach dem Befinden und jeder
  anderen Frage — am selben Tag, am Folgetag, im Mittel über die nächsten drei,
  sieben oder acht bis vierzehn Tage. Unter fünf gemeinsamen Tagen wird der
  Balken ausgegraut, statt eine Scheingenauigkeit zu behaupten.
- **Mehrere Profile** mit je eigenem Fragebogen.
- **Gelöschte Fragen** verschwinden aus dem Fragebogen, ihre alten Antworten
  bleiben auswertbar.
- **Erinnerung** zu einer festen Uhrzeit, solange die App geöffnet ist.

## Wo die Daten liegen

Im Gerät, und nur dort. Es gibt keinen Server, an den etwas gehen könnte.

Die Ablage ist mit AES-256-GCM verschlüsselt; der Schlüssel liegt als nicht
auslesbarer `CryptoKey` in der IndexedDB des Browsers und verlässt das Gerät
nie. Beim Start meldet die App den Speicher als dauerhaft an, damit das System
ihn bei Platzmangel nicht wegräumt.

Was das nicht überlebt: bewusstes Löschen der Browserdaten, das Entfernen des
Symbols vom Home-Bildschirm, ein verlorenes Telefon. Dagegen hilft die
Sicherung — eine `.wbm`-Datei, verschlüsselt mit einem selbst gewählten
Passwort (PBKDF2-SHA-256, 250.000 Runden). Ist die letzte Sicherung über eine
Woche her, sagt die App das deutlich und fragt nach dem Ausfüllen nach.

Das Sicherungspasswort ist nicht zurücksetzbar.

## Installieren

In Safari oder Chrome öffnen, dann „Zum Home-Bildschirm“ bzw. „Zum
Startbildschirm hinzufügen“. Ab dem zweiten Start läuft alles offline; ein
Service Worker hält sämtliche Dateien lokal.

## Eigene Fragebögen (`.wbt`)

Mitgeliefert werden nur zwei allgemeine Vorlagen. Ein eigener Fragebogen kommt
als Datei vom Gerät und steht bewusst nicht in diesem Repository — er wäre
sonst öffentlich.

Eine `.wbt`-Datei ist Text: erste Zeile `WBT1`, danach JSON mit den Fragen.
Nie Antworten.

```
WBT1
{"v":1,"name":"Alltag","questions":[
 {"name":"Sport","text":"Hast du Sport gemacht?","kind":"Verhalten",
  "type":"bool","isCategory":true,"category":null,"locked":false}
]}
```

Einlesen beim Anlegen eines Profils, herausschreiben über „Fragebogen anpassen“
→ „Als Vorlage sichern“.

## Kein medizinisches Werkzeug

Das hier ist ein Tagebuch mit einer Korrelationsrechnung. Korrelation ist keine
Ursache, und nichts davon ersetzt eine ärztliche Einschätzung.

## Aufbau

| Datei | Zweck |
| --- | --- |
| `index.html` | Seitengerüst, Design-System, Einstiegspunkt |
| `WellbeingApp.dc.html` | die App selbst |
| `support.js` | Laufzeit, die die Komponente einhängt |
| `react*.js` | React 18, lokale Kopien statt CDN |
| `ds-bundle.js`, `_ds/` | Design-System |
| `fonts/` | Schriften, damit nichts nachgeladen wird |
| `sw.js` | Service Worker, macht die App offlinefähig |
| `manifest.webmanifest`, `icon-*.png` | Name und Symbol auf dem Home-Bildschirm |

Dieselbe App gibt es auch als einzelne HTML-Datei, die ganz ohne Adresse und
ohne Konto auskommt.

## Lizenzen

Der Code steht unter der MIT-Lizenz, siehe [LICENSE](LICENSE).

Mitgeliefert:

- **React 18.3.1** — MIT, © Meta Platforms, Inc. und Mitwirkende
- **Caprasimo** — SIL Open Font License 1.1, © 2023 The Caprasimo Project
  Authors, siehe [`fonts/OFL-Caprasimo.txt`](fonts/OFL-Caprasimo.txt)
- **Figtree** — SIL Open Font License 1.1, © 2022 The Figtree Project Authors,
  siehe [`fonts/OFL-Figtree.txt`](fonts/OFL-Figtree.txt)

---

**In English:** a daily wellbeing questionnaire with correlation analysis.
Runs entirely in the browser — no server, no account, no network after the
first load. Answers stay on the device, AES-256-GCM encrypted, with
password-protected backup files. Personal questionnaires are loaded from local
`.wbt` files and are deliberately not part of this repository.
