# Temporal Echoes

> Ein tiefgründiges Idle-/Incremental-Spiel mit 5 Prestige-Ebenen

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue-3.4-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

## Aktuelle Version: v1.0.0 (Phase 1-4)

## Über das Spiel

**Temporal Echoes** ist ein Idle-/Incremental-Spiel, in dem du Zeit manipulierst und "Echos" vergangener Aktionen nutzt, um exponentiell wachsende Produktion zu erreichen.

### Kernfeatures

- **6 Währungen:** TE → ES → ZK → RS → NF → HO
- **5 Prestige-Ebenen:** Dimension Shift, Chronal Shift, Epochal Transcendence, Reality Weave, Nexus, Celestial Ascension
- **16 Generatoren:** EC1-EC8 (Echo-Sammler) + TD1-TD8 (Temporale Dimensionen)
- **100+ Upgrades**
- **20+ Herausforderungen**

### Ressourcen-System

```
Temporale Energie (TE)
       ↓
  Dimension Shift (kostet 1e6 TE) → TDT Multiplikator
       ↓
  Chronaler Shift (kostet 1e12 TE) → Echo-Scherben (ES)
       ↓
  Zeitkristalle (ZK) → TD1-8 Temporale Dimensionen
       ↓
  Epochale Transzendenz (kostet 1e6 ZK) → Mehr ZK
       ↓
  Realitätsstränge (RS) → Fähigkeitsbaum
       ↓
  Nexus-Fragmente (NF) → Glyphen-System
       ↓
  Himmlische Orbs (HO) → Meta-Progression
```

## Tech Stack

- **Vue.js 3** mit Composition API
- **TypeScript** für Typsicherheit
- **Pinia** für State-Management
- **Vite** für Build-Tooling
- **break_infinity.js** für große Zahlen (bis 1e9e15)

## Installation

```bash
# Dependencies installieren
npm install

# Development Server starten
npm run dev

# Production Build
npm run build

# TypeScript prüfen
npm run typecheck
```

## Projektstruktur

```
temporal-echoes/
├── src/
│   ├── core/           # Spiellogik Core
│   │   ├── Game.ts     # Main Game Class
│   │   ├── GameLoop.ts # 30 TPS Delta-time Loop
│   │   ├── NumberManager.ts
│   │   └── SaveManager.ts
│   │
│   ├── game/          # Game Content
│   │   ├── currencies/   # Währungen (TE, ES, ZK)
│   │   ├── generators/    # Generatoren (EC1-8, TD1-8)
│   │   ├── upgrades/     # Upgrade System
│   │   └── prestige/     # Prestige Layer
│   │
│   ├── ui/            # UI Components
│   │   ├── components/   # Vue Komponenten
│   │   ├── views/        # Seiten
│   │   └── stores/       # Pinia Stores
│   │
│   └── data/          # Game Data
│
├── index.html
├── package.json
└── vite.config.ts
```

## Implementierungsphasen

| Phase | Beschreibung | Status |
|-------|--------------|--------|
| 1 | Fundament (Vue Setup, Game Loop, EC1-8, Basis UI) | ✅ Abgeschlossen |
| 2 | Erweiterung (EC5-8 Freischaltung, Upgrade System, TDT, Dimensions, Save) | ✅ Abgeschlossen |
| 3 | Chronaler Shift (ES Währung, Erste Prestige-Ebene) | ✅ Abgeschlossen |
| 4 | Epochale Transzendenz (ZK Währung, TD1-8, Zweite Prestige-Ebene) | ✅ Abgeschlossen |
| 5 | Automatisierung (Sequencer) | 📋 Geplant |
| 6 | Reality Weave (RS Währung, Fähigkeitsbaum) | 📋 Geplant |
| 7 | Nexus (NF Glyphen) | 📋 Geplant |
| 8 | Celestial Ascension (HO, Finale Prestige) | 📋 Geplant |

## Spielmechaniken

### Generatoren

Jeder Echo-Sammler (EC1-EC8) sammelt die vorherige Ressource und produziert die aktuelle:
- EC1 → TE
- EC2 → EC1 ( produzir 10% von EC1 Produktion)
- EC3 → EC2
- usw...

Die Kosten wachsen exponentiell (1.15 - 1.22 Wachstumsfaktor), während die Produktion linear steigt.

### Progressive Freischaltung

- **EC5-8:** Werden freigeschaltet, wenn der vorherige EC 10+ erreicht hat
- **TD2-8:** Werden freigeschaltet, wenn der vorherige TD 5+ erreicht hat

### Prestige-Ebenen

1. **Dimension Shift** (verfügbar ab 1e6 TE)
   - Setzt Generatoren zurück
   - Erhöht TDT Multiplikator dauerhaft
   - Belohnung: ES basierend auf TE

2. **Chronaler Shift** (verfügbar ab 1e12 TE)
   - Setzt alles zurück außer ES
   - Belohnung: Echo-Scherben für permanente Upgrades

3. **Epochale Transzendenz** (verfügbar ab 1e6 ZK)
   - Setzt Generatoren und Dimensionen zurück
   - Belohnung: Zeitkristalle

## Changelog

### v1.0.0 (Phase 1-4) - Aktuell

#### Phase 4 Features (Epochale Transzendenz)
- Zeitkristalle (ZK) Währung hinzugefügt
- TD1-TD8 Temporale Dimensionen implementiert
- EpochalTranscendence Prestige Layer hinzugefügt
- EpochalTranscendenceButton UI Komponente
- TD Unlock Logik (TD2-8 freigeschaltet bei previous TD count >= 5)

#### Phase 3 Features (Chronaler Shift)
- Echo-Scherben (ES) Währung hinzugefügt
- ChronalerShift Prestige Layer implementiert
- ChronalerShiftButton UI Komponente
- ES Reset Mechanik

#### Phase 2 Features (Erweiterung)
- Progressive Unlocks für EC5-8
- Upgrade System mit Upgrade.ts und UpgradeManager.ts
- 10+ ES Upgrades definiert
- TDT (Time Dilation Tick) Mechanik
- SaveManager mit IndexedDB
- Auto-Save alle 30 Sekunden
- Tab Navigation UI
- DimensionCard, UpgradeButton, SaveMenu, PrestigeButton

#### Phase 1 Features (Fundament)
- Vue 3 + Vite + TypeScript Setup
- 30 TPS Game Loop
- EC1-8 Generatoren
- Basis UI mit ResourceBar, GeneratorCard, MainView
- break_infinity.js Integration für große Zahlen
- Pinia State Management

---

## Geplante Features

### Phase 5: Automatisierung
- Sequencer (Script Parser)
- Fortgeschrittene Autobuyer
- Conditional Buys

### Phase 6: Reality Weave
- Realitätsstränge (RS) Währung
- Paradoxien Herausforderungen
- Fähigkeitsbaum

### Phase 7: Nexus
- Nexus-Fragmente (NF)
- RNG Effects
- Glyphen System

### Phase 8: Celestial Ascension
- Himmlische Orbs (HO)
- Meta-Progression
- Finale Prestige-Ebene

---

## Inspiration

- [Antimatter Dimensions](https://github.com/IvarK/IvarK.github.io)
- [Revolution Idle](https://revolutionidle.com/)
- [Generic Idle Game Template](https://github.com/CookieMonster101/IvyFramework)

---

*Hergestellt mit ❤️ und vielen Stunden Zeitmanipulation*