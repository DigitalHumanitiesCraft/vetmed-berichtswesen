# Workshop-Guide: Promptotyping mit Claude Code

Zurueck zu [[index]]

---

## Ueberblick

Dieser Guide beschreibt den Ablauf eines vierstuendigen Workshops, in dem Sabrina Laboureix (Referentin PPM, Stabsstelle SUES) mit Claude Code selbststaendig eine Loesung fuer die Konsolidierung der Projektstatusberichte erarbeitet. Der Workshop folgt der Promptotyping-Methodik: Sabrina bringt das Domaenenwissen ein, Claude Code uebernimmt die technische Umsetzung. Die Moderationsrolle liegt bei Christopher Pollin, der die bestehende Referenzimplementierung (dieses Repository) kennt, sie aber nicht vorgibt.

Sabrina hat wenig bis sehr wenig Programmiererfahrung. Der Workshop ist entsprechend niederschwellig aufgebaut. Sie muss keinen Code schreiben oder verstehen — sie beschreibt in natuerlicher Sprache, was sie braucht, und prueft die Ergebnisse mit ihrem Fachwissen.

| | |
|---|---|
| Datum | 23.03.2026 |
| Dauer | 4 Stunden (inkl. Pausen) |
| Teilnehmerin | Sabrina Laboureix, Referentin PPM |
| Moderation | Christopher Pollin |
| Voraussetzungen | Claude Code installiert, Python 3.11+, vorbereiteter Quelldaten-Ordner |

---

## Vorbereitung

### Quelldaten-Ordner

Fuer Sabrina wird ein frischer Arbeitsordner vorbereitet, der ausschliesslich die Quelldaten enthaelt — kein Code, keine Wissensdokumente, kein bestehendes Repository. Die Ordnerstruktur:

```
quelldaten/
  psb/            4 PSB-Excel-Dateien (A1.1.1.1, C1.2.2, C7.7.7.8, D3.3.3)
  dashboard/      Portfolio_Dashboard_Beispieldaten.xlsx
  finanzen/       SAP-Auszug (LE-Vorhaben_260215_Beispieldaten.xlsx)
  vorlagen/       PSB-Vorlage (leer)
  berichte/       Portfoliobericht Q4/2025 (PPTX)
```

### Technische Voraussetzungen

Folgende Punkte sollten vor dem Workshop geprueft und gegebenenfalls eingerichtet werden:

- **Claude Code:** `claude --version` im Terminal ausfuehren. Falls nicht installiert, siehe Anthropic-Dokumentation.
- **Python:** `python --version` — mindestens 3.11.
- **Python-Packages:** `pip install openpyxl pandas matplotlib` vorab installieren, damit im Workshop keine Zeit fuer Dependency-Management verloren geht.

### Terminal oder VS Code

Die Wahl der Arbeitsumgebung haengt von Sabrinas Vorerfahrung ab. Claude Code kann sowohl im Terminal als auch ueber die VS Code Extension genutzt werden. Das Terminal ist fokussierter, aber fuer Personen ohne Kommandozeilen-Erfahrung unter Umstaenden einschuechternd. VS Code bietet eine vertrautere Oberflaeche mit sichtbarer Dateistruktur im Seitenbereich. Die Entscheidung sollte zu Beginn des Workshops gemeinsam getroffen werden.

### Fallback

Falls es zu technischen Problemen kommt, die sich nicht innerhalb von 10-15 Minuten loesen lassen, kann der Workshop auf dem Rechner des Moderators per Screen-Share durchgefuehrt werden. In diesem Fall diktiert Sabrina die Prompts, waehrend der Moderator tippt. Das ist nicht ideal, da die haptische Erfahrung fehlt, aber es schuetzt die inhaltliche Substanz des Workshops.

---

## Phase 0: Ankommen und Werkzeug kennenlernen (25 Minuten)

### Ziel

Sabrina hat Claude Code gestartet, versteht das Grundprinzip der Interaktion und kennt das Permission-System.

### Ablauf

Zu Beginn wird die Arbeitsumgebung gemeinsam geoeffnet und Claude Code im vorbereiteten Ordner gestartet. Der Moderator erklaert dabei das Grundprinzip: Claude Code funktioniert wie ein Chat, kann aber zusaetzlich Dateien auf dem lokalen Rechner lesen, bearbeiten und Programme ausfuehren.

Als erster Prompt eignet sich eine offene Frage wie "Wer bist du und was kannst du?". Ziel ist lediglich, dass Sabrina sieht, wie die Interaktion funktioniert — sie tippt eine Frage, Claude Code antwortet.

Beim naechsten Schritt wird Claude Code um Erlaubnis fragen, bevor es eine Aktion ausfuehrt (z.B. eine Datei lesen). Dieses Permission-System sollte der Moderator kurz erklaeren, bevor der entsprechende Dialog erscheint. Claude Code fragt vor jeder Aktion um Zustimmung; die Teilnehmerin kann mit "Allow" oder "Deny" antworten. Fuer den Workshop koennen die Aktionen in der Regel zugelassen werden.

Als Abschluss dieser Phase eignet sich ein Prompt wie "Schau dir die Dateien in diesem Ordner an und beschreib, was du findest." Damit erlebt Sabrina, dass Claude Code ihren lokalen Ordner liest und den Inhalt beschreiben kann. Das ist ein konkretes, nachvollziehbares Ergebnis zu einem fruehen Zeitpunkt.

### Hinweise fuer die Moderation

Geduld ist in dieser Phase besonders wichtig. Falls Sabrina noch nie mit einem Terminal gearbeitet hat, koennen bereits grundlegende Schritte wie das Navigieren in einen Ordner einige Minuten in Anspruch nehmen. Der Moderator sollte nicht vorgreifen, sondern sie in ihrem Tempo ankommen lassen. Die Permission-Dialoge sollten beim ersten Auftreten gemeinsam besprochen werden.

---

## Phase 1: Das Problem in eigenen Worten (30 Minuten)

### Ziel

Sabrina beschreibt ihren quartalsweisen Arbeitsprozess in eigenen Worten. Claude Code strukturiert die Beschreibung und fasst sie zusammen. Am Ende steht ein erstes Wissensdokument als Datei auf ihrem Rechner.

### Ablauf

Der Moderator leitet die Phase mit einer offenen Frage ein: "Erklaer Claude Code mal, was du quartalsweise machst — so wie du es einer neuen Kollegin erklaeren wuerdest."

Sabrina beschreibt frei ihren Prozess. Falls sie nicht weiss, wo sie anfangen soll, kann der Moderator mit Teilfragen helfen: Was fuer Berichte sammelt sie ein? Von wem kommen die? Was macht sie damit? Wer bekommt das Ergebnis?

Claude Code wird die Beschreibung aufnehmen und zusammenfassen. An diesem Punkt beginnt ein iterativer Dialog: Sabrina liest die Zusammenfassung, korrigiert Fehler, ergaenzt fehlende Aspekte, und Claude Code ueberarbeitet. Dieses Wechselspiel zwischen Beschreibung und Korrektur ist der Kern der Promptotyping-Methodik.

Zum Abschluss bittet Sabrina Claude Code, die bereinigte Zusammenfassung in eine Datei zu schreiben, zum Beispiel mit dem Prompt "Schreib das als Zusammenfassung in eine Datei namens 'mein-prozess.md'". Damit entsteht das erste greifbare Artefakt des Workshops.

### Hintergrund

Diese Phase verfolgt mehrere Zwecke gleichzeitig. Sabrina erlebt, dass Claude Code ihr Fachwissen aufnehmen und strukturieren kann. Sie uebt, Domaenenwissen explizit zu formulieren — eine Faehigkeit, die fuer die Arbeit mit KI-Werkzeugen zentral ist. Und es entsteht ein Wissensdokument, das dem Promptotyping-Prinzip entspricht: Dokumente als Source of Truth, Code als Disposable Artifact.

### Referenzwissen fuer den Moderator

Der Ist-Prozess umfasst vier Stufen: Erfassung (PSB-Vorlagen werden von Projektleitungen ausgefuellt), Konsolidierung (PSBs werden manuell in das Master-Excel zusammengefuehrt), Dashboard-Auswertungen (innerhalb des Master-Excel) und Portfoliobericht (Screenshots in PowerPoint). Das Kernproblem ist die Datenintegration, nicht die Visualisierung. Das implizite Domaenenwissen steckt in den Formeln, Zuordnungsregeln und Hilfstabellen des Master-Excel. Der Portfolioumfang betraegt ca. 118 Vorhaben im Rahmen der Leistungsvereinbarung 2025-2027.

Dieses Wissen dient dem Moderator zur Einordnung. Es sollte nicht aktiv eingebracht werden — Sabrina kennt ihren Prozess und wird ihn in ihren eigenen Worten beschreiben.

---

## Phase 2: Die Daten erkunden (40 Minuten)

### Ziel

Claude Code analysiert die Quelldateien. Sabrina validiert die Beschreibungen und korrigiert, wo noetig. Die Datenstrukturen, die bisher nur implizit in den Excel-Dateien stecken, werden explizit beschrieben.

### Ablauf

Die Phase beginnt mit einer einzelnen PSB-Datei. Ein geeigneter Prompt waere: "Oeffne die Datei quelldaten/psb/PSB_A1.1.1.1.xlsx und beschreib mir, was du siehst. Welche Felder gibt es, wie ist die Struktur?"

Claude Code wird die Zellen lesen und die Struktur beschreiben. In vielen Faellen wird die Beschreibung nicht vollstaendig korrekt sein — insbesondere bei Merged Cells oder bei der Zuordnung von Feldbeschriftungen. Das ist beabsichtigt: Sabrina korrigiert ("Das ist die LV-Nummer, nicht die Projektnummer") und bringt dabei ihr Expertenwissen ein. Falls Claude Code auf Schwierigkeiten mit der Excel-Struktur hinweist, kann der Moderator kurz erklaeren, warum Merged Cells fuer automatisierte Verarbeitung eine Herausforderung darstellen.

Anschliessend folgt das Dashboard-Excel. Der Prompt koennte lauten: "Schau dir quelldaten/dashboard/Portfolio_Dashboard_Beispieldaten.xlsx an. Welche Sheets gibt es und was steht drin?" Das Dashboard enthaelt 11 Tabellenblaetter. Der zentrale Moment in diesem Schritt ist, wenn Sabrina erklaert, wie die Daten aus den einzelnen PSBs in das Dashboard fliessen — das ist ihr Wissen, das nirgends dokumentiert ist.

Falls die Teilnehmerin an diesem Punkt den Wunsch aeussert, direkt mit der Automatisierung zu beginnen, sollte dieser Impuls aufgegriffen werden. Der Plan ist ein Geruest, keine strikte Abfolge.

Es folgen die SAP-Finanzdaten ("Schau dir quelldaten/finanzen/ an") und eine abschliessende Zusammenfassung. Der Prompt "Fass zusammen: Welche Datenquellen haben wir, und wie haengen sie zusammen? Schreib das in eine Datei 'datenquellen.md'" erzeugt das zweite Wissensdokument des Workshops.

### Hinweise fuer die Moderation

In dieser Phase ist Zurueckhaltung besonders wichtig. Der Moderator kennt die Datenstrukturen im Detail (43 Zeilen x 12 Spalten, 59 Merged-Cell-Bereiche, LV-Nr-Prefix in B3, Normalisierungsprobleme zwischen PSB und Dashboard). Dieses Wissen sollte nicht aktiv eingebracht werden. Wenn Claude Code etwas falsch beschreibt, sollte nicht der Moderator korrigieren, sondern Sabrina — das staerkt ihre Rolle als Domaenenexpertin.

### Referenzwissen fuer den Moderator

Die PSBs bestehen aus 43 Zeilen x 12 Spalten mit 59 Merged-Cell-Bereichen. Die LV-Nummer in Zelle B3 enthaelt den Prefix "LV25-27 ", der bei der Verarbeitung entfernt werden muss. Das Dashboard hat 48 Spalten im Hauptsheet "Portfolio_Daten". Die SAP-Daten enthalten Negativ-Betraege (Ausgaben werden als negative Werte gefuehrt) und gelegentlich Mehrfach-LV-Nummern, die mit "+" getrennt sind. Bekannte Normalisierungsprobleme betreffen den Ampelstatus ("in Ordnung" vs. "In Ordnung"), die PAG-Bezeichnung ("Rektor:in" vs. "Rektor") und die Projektphase ("Nicht gestartet" vs. "Idee erfasst/noch nicht gestartet").

---

## Pause (15 Minuten)

Die Pause bietet Gelegenheit fuer ein informelles Gespraech ueber die bisherigen Eindruecke.

---

## Phase 3: Die erste Automatisierung (45-75 Minuten)

### Ziel

Claude Code erstellt ein Python-Script, das die vier PSB-Dateien einliest und die wesentlichen Informationen in eine gemeinsame Excel-Tabelle zusammenfuehrt. Sabrina prueft das Ergebnis und steuert die Korrekturen. Diese Phase ist der Kern des Workshops.

### Warum die Zeitangabe flexibel ist

Die Konsolidierung von Excel-Dateien mit Merged Cells ist technisch der anspruchsvollste Teil des gesamten Use Case. Es ist wahrscheinlich, dass das erste generierte Script nicht auf Anhieb das gewuenschte Ergebnis liefert. Das ist kein Fehlschlag, sondern Teil des Prozesses: Die Iteration zwischen Auftrag, Ergebnis und Korrektur ist genau der Arbeitsrhythmus, den Sabrina fuer die eigenstaendige Nutzung von Claude Code verinnerlichen soll. Falls diese Phase laenger dauert als geplant, sollten Phase 4 und 5 entsprechend gekuerzt werden.

### Ablauf

Sabrina formuliert den Auftrag an Claude Code selbst. Der Moderator hilft nur, wenn sie laenger als einige Minuten nicht weiterkommt. Falls noetig, kann er einen Anfang vorschlagen ("Fang an mit: Ich moechte, dass du..."). Ein typischer Prompt koennte lauten: "Ich moechte, dass du ein Python-Script schreibst, das alle 4 PSB-Dateien aus quelldaten/psb/ einliest und die wichtigsten Informationen in eine gemeinsame Excel-Tabelle zusammenfuehrt. Pro Projekt eine Zeile."

Claude Code wird ein Script erstellen und um Erlaubnis bitten, es auszufuehren. An diesem Punkt sollte der Moderator noch einmal auf den Permission-Dialog hinweisen: Sabrina entscheidet, ob das Script laufen darf.

Nach der Ausfuehrung prueft Sabrina das Ergebnis. Der Prompt "Oeffne die erzeugte Datei und zeig mir, was drin steht" macht die Ausgabe sichtbar. Falls Sabrina nicht sicher ist, worauf sie achten soll, kann der Moderator mit Leitfragen helfen: Stimmen die LV-Nummern? Stimmt der Ampelstatus? Sind alle vier Projekte enthalten? Fehlt etwas Wichtiges?

Auf Basis ihrer Pruefung gibt Sabrina Korrekturen. Typische Anweisungen koennten sein: "Die LV-Nummer soll ohne das 'LV25-27' davor sein", "Der Ampelstatus heisst 'In Ordnung' mit grossem I", oder "Da fehlen die Meilensteine". Claude Code ueberarbeitet das Script, fuehrt es erneut aus, und Sabrina prueft wieder. Jede Iteration verstaerkt das zentrale Muster: Sie steuert mit Fachwissen, Claude Code setzt technisch um.

### Hinweise fuer die Moderation

Der Moderator sollte nicht eingreifen, wenn Claude Code einen Fehler produziert — die Teilnehmerin soll den Fehler selbst identifizieren. Hilfe ist angebracht, wenn sie laenger als fuenf Minuten blockiert ist oder sichtbar frustriert wird. Bei rein technischen Problemen (fehlendes Package, falscher Dateipfad) kann der Moderator kurz einspringen, sollte aber erklaeren, was er tut und warum.

Die Versuchung, Hinweise aus dem eigenen Referenzwissen zu geben, ist in dieser Phase besonders gross. Der Moderator weiss, dass Merged Cells das Hauptproblem sind und dass der LV-Nr-Prefix entfernt werden muss. Dieses Wissen sollte nur eingesetzt werden, wenn der Prozess tatsaechlich feststeckt — nicht um ihn zu beschleunigen.

### Referenzwissen fuer den Moderator

Die groessten technischen Huerde sind die Merged Cells, der LV-Nr-Prefix in B3 und gemischte Datumsformate ("Q1 26" neben "TT.MM.JJJJ"). Die Referenzimplementierung in prototype/01_konsolidierung.py und config.py zeigt einen moeglichen Loesungsweg, sollte aber nicht als Vorlage dienen.

---

## Phase 4: Qualitaet und Normalisierung (20 Minuten)

Diese Phase kann gekuerzt werden, falls Phase 3 mehr Zeit in Anspruch genommen hat. Die Kernidee — Sabrina als entscheidende Instanz bei Datenqualitaetsfragen — sollte aber in jedem Fall vermittelt werden, auch wenn nur verkuerzt.

### Ziel

Sabrina entdeckt Datenqualitaetsprobleme zwischen den verschiedenen Quellen und trifft Entscheidungen ueber die korrekte Normalisierung.

### Ablauf

Ein geeigneter Prompt ist: "Vergleich mal die Werte in den PSBs mit den Werten im Dashboard. Gibt es Unterschiede bei der Schreibweise, zum Beispiel beim Ampelstatus oder bei der Projektphase?"

Claude Code wird Inkonsistenzen identifizieren — unterschiedliche Gross-/Kleinschreibung, abweichende Begriffe fuer denselben Sachverhalt. An diesem Punkt trifft Sabrina die Entscheidung, welche Schreibweise die richtige ist. Nicht Claude Code und nicht der Moderator, sondern die Fachverantwortliche bestimmt den Standard.

Als konkretes Ergebnis kann sie eine Normalisierungstabelle erstellen lassen: "Erstell eine Tabelle mit zwei Spalten — links der Wert aus dem PSB, rechts wie er im Dashboard stehen soll."

### Hintergrund

Diese Phase bildet das sogenannte Propose-Validate-Pattern ab: Das System macht Auffaelligkeiten sichtbar, der Mensch bewertet und entscheidet. Das ist die zentrale Rolle der Fachverantwortlichen im automatisierten Prozess.

### Referenzwissen fuer den Moderator

Bekannte Normalisierungsprobleme: PAG "Rektor:in" vs. "Rektor", Ampelstatus "in Ordnung" vs. "In Ordnung", Projektphase "Nicht gestartet" vs. "Idee erfasst/noch nicht gestartet".

---

## Phase 5: Sichtbar machen (20 Minuten)

Diese Phase ist optional und kann entfallen, wenn die Zeit knapp wird. Sie ist inhaltlich nicht zwingend, bietet aber einen guten Abschluss des technischen Teils.

### Ziel

Aus den konsolidierten Daten entsteht eine einfache Visualisierung.

### Ablauf

Ein einfacher Einstieg: "Erstell mir eine Uebersicht — wie viele Projekte sind gruen, gelb, rot?"

Claude Code wird voraussichtlich ein Balkendiagramm oder eine tabellarische Uebersicht erzeugen. Falls das Ergebnis ueberzeugt und noch Zeit vorhanden ist, kann Sabrina weitere Auswertungen anfordern, etwa eine Aufschluesslung nach Auftraggeber oder eine Liste der Projekte mit hohem Risiko.

Die Entscheidung, welche Auswertung interessant ist, liegt bei Sabrina. Der Moderator sollte nicht in Richtung eines vollstaendigen Dashboards draengen — eine einzelne gelungene Darstellung ist fuer den Lerneffekt ausreichend.

---

## Phase 6: Abschluss und Nachhaltigkeit (25 Minuten)

### Ziel

Die Ergebnisse des Workshops werden gesichert, reflektiert und die naechsten Schritte geklaert.

### CLAUDE.md erstellen (10 Minuten)

Der wichtigste Schritt fuer die Nachhaltigkeit ist die Erstellung einer CLAUDE.md-Datei. Diese Datei dient als Briefing: Wenn Claude Code das naechste Mal im selben Ordner gestartet wird, liest es die CLAUDE.md automatisch und kennt sofort den Kontext.

Prompt: "Erstell eine Datei namens CLAUDE.md, die alles zusammenfasst, was du ueber mein Projekt gelernt hast — den Prozess, die Datenquellen, die Normalisierungsregeln. So dass du beim naechsten Mal sofort weisst, worum es geht."

Der Moderator erklaert die Funktion: Die CLAUDE.md ist vergleichbar mit einem Einarbeitungsdokument fuer eine neue Kollegin. Sie stellt sicher, dass das im Workshop erarbeitete Wissen nicht verloren geht, wenn Sabrina spaeter eine neue Sitzung startet.

### Reflexion (10 Minuten)

Die Reflexion greift drei Leitfragen auf:

Erstens: Was ist passiert? Sabrina hat Claude Code ihr Problem erklaert, Claude Code hat Code geschrieben, Sabrina hat die Ergebnisse geprueft und korrigiert. Dieses Wechselspiel aus Beschreibung, Umsetzung und Validierung ist Promptotyping.

Zweitens: Was sind die Artefakte? Ueber den Workshop hinweg sind Wissensdokumente entstanden (mein-prozess.md, datenquellen.md, CLAUDE.md), ein funktionierendes Script und moeglicherweise Visualisierungen. Die zentrale Einsicht ist, dass die Wissensdokumente die eigentlich wertvollen Artefakte sind. Der Code kann jederzeit aus ihnen neu erzeugt werden.

Drittens: Was war ueberraschend? Wo hat Claude Code ueberzeugt, wo war es unzuverlaessig? Und an welchen Stellen war Sabrinas Expertenwissen die entscheidende Instanz?

### Naechste Schritte klaeren (5 Minuten)

Zum Abschluss sollten folgende Punkte geklaert werden:

- **Zugang:** Kann Sabrina Claude Code eigenstaendig weiter nutzen? Ist ein API-Key oder Pro-Abonnement vorhanden?
- **Dateien:** Die im Workshop erstellten Dateien bleiben auf ihrem Rechner. Sie kann jederzeit Claude Code im selben Ordner starten und dort weitermachen, wo sie aufgehoert hat.
- **Weiterfuehrung:** Der naechste Workshop ist fuer den 06.05.2026 geplant. Bis dahin ist eigenstaendiges Experimentieren ausdruecklich erwuenscht, aber kein Muss.

---

## Zeitplan

| Zeit | Phase | Dauer | Flexibilitaet |
|------|-------|-------|---------------|
| 0:00 | Phase 0: Ankommen und Werkzeug | 25 min | fix |
| 0:25 | Phase 1: Problem beschreiben | 30 min | fix |
| 0:55 | Phase 2: Daten erkunden | 40 min | ± 10 min |
| 1:35 | Pause | 15 min | fix |
| 1:50 | Phase 3: Erste Automatisierung | 45-75 min | Kernphase, flexibel |
| ca. 3:00 | Phase 4: Qualitaet und Normalisierung | 20 min | kuerzbar auf 10 min |
| ca. 3:20 | Phase 5: Sichtbar machen | 20 min | kann entfallen |
| 3:35 | Phase 6: Abschluss und CLAUDE.md | 25 min | fix |

Die Phasen 0, 1, 3 und 6 sind nicht verhandelbar. Phase 3 hat Vorrang gegenueber Phase 4 und 5: Wenn die Automatisierung laenger dauert als geplant, werden die beiden nachfolgenden Phasen entsprechend gekuerzt oder uebersprungen.

---

## Umgang mit Abweichungen

### Abweichungen vom geplanten Ablauf

Die Phasen sind inhaltlich aufeinander aufgebaut, aber die Reihenfolge muss nicht strikt eingehalten werden. Wenn Sabrina beispielsweise in Phase 2 den Wunsch aeussert, sofort mit der Automatisierung zu beginnen, sollte der Moderator diesem Impuls folgen und zu Phase 3 wechseln. Die einzige Bedingung ist, dass Phase 6 (CLAUDE.md und Reflexion) am Ende stattfindet.

### Fehlerhafte Ergebnisse von Claude Code

Wenn Claude Code falsche Werte liefert oder die Excel-Struktur nicht korrekt interpretiert, ist das kein Stoerfall, sondern eine Gelegenheit: Es zeigt, warum die Pruefung durch eine Fachperson unverzichtbar ist. Ohne Sabrinas Kontrolle waeren fehlerhafte Werte unbemerkt in den Bericht gelangt. Diese Einsicht ist eines der wichtigsten Lernergebnisse des Workshops.

### Frustration

Falls Sabrina den Eindruck hat, den Code nicht zu verstehen: Sie muss den Code nicht verstehen. Relevant ist ausschliesslich, ob das Ergebnis stimmt. Falls etwas nicht funktioniert: Sie soll Claude Code beschreiben, was falsch ist, in ihren eigenen Worten. Falls ihr der technische Kontext insgesamt zu viel wird: Zurueck zum Grundprinzip — sie beschreibt, Claude Code setzt um.

### Tempo

Falls der Workshop schneller voranschreitet als erwartet, kann Phase 2 (Datenexploration) vertieft oder in Phase 3 mit zusaetzlichen Iterationen gearbeitet werden. Falls der Workshop langsamer voranschreitet, werden Phase 4 und 5 gekuerzt.

---

## Notfall-Strategien

| Situation | Vorgehen |
|-----------|----------|
| Terminal oder Claude Code startet nicht | Screen-Share-Fallback: Moderator tippt, Teilnehmerin diktiert die Prompts |
| Python oder benoetigtes Package fehlt | Moderator fuehrt `pip install openpyxl pandas matplotlib` aus |
| Permission-Dialoge verunsichern | Nochmals erklaeren: Claude Code fragt vor jeder Aktion um Erlaubnis, die Teilnehmerin kann zustimmen oder ablehnen |
| Claude Code liest Excel-Werte falsch | Der Teilnehmerin helfen, den Fehler praezise zu beschreiben, z.B. "In Zelle B3 steht X, aber du liest Y" |
| Teilnehmerin traut sich nicht zu prompten | Einen Anfang vorschlagen: "Fang an mit: Ich moechte, dass du..." |
| Phase 3 dauert deutlich laenger | Phase 4 und 5 kuerzen, Phase 6 beibehalten |

---

## Grundsaetze fuer die Moderation

**Rollenverstaendnis.** Sabrina ist die Fachexpertin, Claude Code ist das Werkzeug. Diese Rollenverteilung sollte sie nicht nur hoeren, sondern im Verlauf des Workshops selbst erleben — insbesondere dann, wenn Claude Code Fehler macht und ihre Korrektur das Ergebnis verbessert.

**Fehler als Lernmoment.** Wenn Claude Code etwas falsch interpretiert oder unvollstaendige Ergebnisse liefert, zeigt das, warum Domaenenwissen nicht durch Automatisierung ersetzbar ist. Fehler sind kein Zeichen dafuer, dass der Ansatz nicht funktioniert, sondern dafuer, dass die menschliche Pruefung notwendig bleibt.

**Dokumente vor Code.** Die Wissensdokumente, die im Workshop entstehen (mein-prozess.md, datenquellen.md, CLAUDE.md), sind die eigentlich stabilen Artefakte. Der Code kann jederzeit aus den Dokumenten neu generiert werden. Diese Einsicht ist ein zentrales Ergebnis des Workshops.

**Iteration ist der Normalfall.** Weder der erste Prompt noch das erste Script werden perfekt sein. Jede Korrektur ist ein produktiver Schritt, kein Rueckschlag.

**Zurueckhaltung.** Der Moderator kennt die Loesung aus der Referenzimplementierung und die bekannten Stolperstellen der Daten. Dieses Wissen sollte nicht proaktiv eingebracht werden. Der Lerneffekt ist groesser, wenn Sabrina Probleme selbst identifiziert — oder sie gemeinsam mit Claude Code findet.

---

Verwandte Dateien: [[projektkontext]] · [[use-case]] · [[anforderungen]] · [[journal]]
