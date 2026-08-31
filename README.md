# Limbik·Atlas — Das limbische System verstehen

Ein illustrierter Lernatlas zum limbischen System auf Prüfungsniveau —
gestaltet wie ein anatomisches Tafelwerk: elf Bildtafeln, ein Merkspruch, ein Testat.

**Live:** <https://limbisches-system.vercel.app>

## Konzept

Wo immer möglich wird bildlich erklärt statt in Textkästen:

| Tafel | Inhalt | Technik |
|-------|--------|---------|
| I | Übersichtstafel aller 7 Strukturen (interaktiv) | SVG, handgezeichneter Look |
| II | „Seepferdchen" — der Namensgeber des Hippocampus | KI-Gravur |
| III | Der Weg einer Erinnerung (KZG → Konsolidierung → LZG) | SVG auf Hirnsilhouette |
| IV a/b | Biskuitrolle ↔ Hippocampus-Querschnitt (Cornu ammonis, Gyrus dentatus) | KI-Gravur + SVG |
| V | Papez-Kreis direkt auf der Anatomie, 6 anklickbare Stationen | SVG mit animierter Schleife |
| VI | H.M.s Gedächtnis als verblassende Bildwand | KI-Gravur |
| VII | Taxonomie des Langzeitgedächtnisses (deklarativ/implizit) | SVG |
| VIII | „Stock oder Schlange?" — der Bedrohungsscanner | KI-Gravur |
| IX | Die Alarmanlage des Körpers (Sympathikus, Nebennieren) | KI-Gravur + nummerierte Overlays |
| X | Orientierung im Gehirnschnitt: Landmarke Seitenventrikel | SVG |
| XI | Die große Tafel: alle drei Verschaltungen in einem Bild | SVG |

Dazu: Merkspruch **„Hipster fordern Mamas antiken Doppel-Gyros"** mit illustriertem
Bestellbild und Sortierspiel, Patientenakte zu H.M., zehn Testat-Fragen mit Erklärungen.

Kein Framework, kein Build-Schritt — reines HTML/CSS/JS. Die anatomischen Schemata sind
eigene SVGs (Beschriftung von Hand gesetzt), die atmosphärischen Gravuren wurden mit
Higgsfield (Seedream 4.5, Nano Banana, FLUX.2) generiert und kuratiert.

## Lokal starten

```bash
python -m http.server 4173
```

Dann <http://localhost:4173> öffnen.

## Quelle & Credits

Inhalt nach dem Video
[„Das Limbische System: Aufbau und Funktion verstehen"](https://www.youtube.com/watch?v=vIXBW-a9BWY)
von **Neurologie mit Dr. Janis** (dort stammt auch der Merkspruch, angelehnt an einen
DocCheck-Klassiker). Weiterführend: Trepel, *Neuroanatomie* (8. Aufl., 2021) ·
[dasGehirn.info](https://www.dasgehirn.info/grundlagen/anatomie/das-limbische-system) ·
Corkin (2002), *Nature Reviews Neuroscience*.

Die Schautafeln sind didaktische Schemata — Proportionen zugunsten der Lesbarkeit
vereinfacht. Kein Ersatz für medizinische Beratung.
