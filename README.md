# Temporal Echoes

> Ein tiefgründiges Idle-/Incremental-Spiel mit 5 Prestige-Ebenen

![Version](https://img.shields.io/badge/version-0.1.7--alpha-6366f1?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue-3.4-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

## Aktuelle Version: v0.1.7-a (Phase 1-7 - Alpha)

## Über das Spiel

**Temporal Echoes** ist ein Idle-/Incremental-Spiel, in dem du Zeit manipulierst und "Echos" vergangener Aktionen nutzt, um exponentiell wachsende Produktion zu erreichen.

### Kernfeatures

- **6 Währungen:** TE → ES → ZK → RS → NF → HO
- **6 Prestige-Ebenen:** Dimension Shift, Chronal Shift, Epochal Transcendence, Reality Weave, Nexus, Celestial Ascension
- **16 Generatoren:** EC1-EC8 (Echo-Sammler) + TD1-TD8 (Temporale Dimensionen)
- **100+ Upgrades**
- **20+ Herausforderungen**

### Ressourcen-System

```
Temporale Energie (TE)
       ↓
  Dimension Shift (1e6 TE) → TDT Multiplikator
       ↓
  Chronaler Shift (1e12 TE) → Echo-Scherben (ES)
       ↓
  Zeitkristalle (ZK) → TD1-8 Temporale Dimensionen
       ↓
  Epochale Transzendenz (1e6 ZK) → Mehr ZK
       ↓
  Reality Weave (1e9 ZK) → Realitätsstränge (RS)
       ↓
  Nexus (NF) → Glyphen
       ↓
  Celestial Ascension (HO) → Finale Prestige
```

## Tech Stack

- **Vue.js 3** mit Composition API
- **TypeScript** für Typsicherheit
- **Pinia** für State-Management
- **Vite** für Build-Tooling
- **break_infinity.js** für große Zahlen (bis 1e9e15)

## Installation

```bash
npm install
npm run dev      # Development Server
npm run build    # Production Build
```

## Projektstruktur

```
temporal-echoes/
├── src/
│   ├── core/           # Game Core (Game.ts, GameLoop.ts, NumberManager.ts, SaveManager.ts)
│   ├── game/           # Game Content
│   │   ├── currencies/   # Währungen (TE, ES, ZK, RS)
│   │   ├── generators/    # Generatoren (EC1-8, TD1-8)
│   │   ├── upgrades/     # Upgrade System
│   │   ├── prestige/     # Prestige Layer (ChronalerShift, EpochalTranscendence, RealityWeave)
│   │   └── automation/    # Sequencer, Autobuyer
│   ├── ui/            # UI Components
│   │   ├── components/   # Vue Komponenten
│   │   ├── views/        # MainView
│   │   └── stores/       # Pinia Stores
│   └── data/          # Game Data
├── docs/             # Wiki Docs
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
| 5 | Automatisierung (Sequencer) | ✅ Abgeschlossen |
| 6 | Reality Weave (RS Währung, Dritte Prestige-Ebene) | ✅ Abgeschlossen |
| 7 | Nexus (NF Glyphen, Vierte Prestige-Ebene) | ✅ Abgeschlossen |
| 8 | Celestial Ascension (HO, Finale Prestige) | 📋 Geplant |

## Changelog

### v0.1.7-a (Phase 7) - Aktuell

- Nexus-Fragments (NF) Währung hinzugefügt
- Nexus Prestige Layer (kostet 1e6 RS)
- NexusButton UI

### v0.1.6-a (Phase 6)

- RealityStrands (RS) Währung hinzugefügt
- RealityWeave Prestige Layer (kostet 1e9 ZK)
- RealityWeaveButton UI Komponente

### v0.1.5-a (Phase 5)

- Sequencer Script Parser (buy, wait, waitFor, dimension, chronal, epochal, stop)
- SequencerEditor mit Play/Pause/Stop Controls
- Autobuyer System

### v0.1.4-a (Phase 4)

- Zeitkristalle (ZK) Währung
- TD1-TD8 Temporale Dimensionen
- EpochalTranscendence Prestige Layer

### v0.1.3-a (Phase 3)

- Echo-Scherben (ES) Währung
- ChronalerShift Prestige Layer

### v0.1.2-a (Phase 2)

- Progressive Unlocks für EC5-8
- Upgrade System
- TDT Mechanik
- SaveManager mit IndexedDB

### v0.1.1-a (Phase 1)

- Vue 3 + Vite + TypeScript Setup
- 30 TPS Game Loop
- EC1-8 Generatoren
- Basis UI

## Spielmechaniken

### Generatoren

- EC1 → produziert TE
- EC2 → sammelt EC1 (10% Produktion)
- EC3-8 → Kette fortsetzen
- TD1 → produziert ZK
- TD2-8 → Kette fortsetzen

### Prestige-Ebenen

1. **Dimension Shift** (ab 1e6 TE) - Setzt Generatoren zurück, erhöht TDT
2. **Chronaler Shift** (ab 1e12 TE) - Setzt alles außer ES zurück, Belohnung: ES
3. **Epochale Transzendenz** (ab 1e6 ZK) - Setzt Generatoren zurück, Belohnung: ZK
4. **Reality Weave** (ab 1e9 ZK) - Setzt alles außer ES/RS zurück, Belohnung: RS

## Geplante Features

- Phase 7: Nexus (NF Glyphen)
- Phase 8: Celestial Ascension (HO Finale Prestige)

## Inspiration

- [Antimatter Dimensions](https://github.com/IvarK/IvarK.github.io)
- [Revolution Idle](https://revolutionidle.com/)

## Links

- [GitHub Repository](https://github.com/T1b0rTt/temporal-echoes)
- [Wiki](https://github.com/T1b0rTt/temporal-echoes/wiki)

---

*Hergestellt mit ❤️ und vielen Stunden Zeitmanipulation*