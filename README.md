# Temporal Echoes

> Ein tiefgründiges Idle-/Incremental-Spiel mit 5 Prestige-Ebenen

![Version](https://img.shields.io/badge/version-1.0.0-6366f1?style=for-the-badge)
![Vue](https://img.shields.io/badge/Vue-3.4-42b883?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178c6?style=for-the-badge&logo=typescript&logoColor=white)

## Über das Spiel

**Temporal Echoes** ist ein Idle-/Incremental-Spiel, in dem du Zeit manipulierst und "Echos" vergangener Aktionen nutzt, um exponentiell wachsende Produktion zu erreichen.

### Kernfeatures

- **6 Währungen:** TE → ES → ZK → RS → NF → HO
- **5 Prestige-Ebenen:** Chronal Shift, Epochal Transcendence, Reality Weave, Nexus, Celestial Ascension
- **16 Generatoren:** EC1-EC8 (Echo-Sammler) + TD1-TD8 (Temporale Dimensionen)
- **100+ Upgrades**
- **20+ Herausforderungen**

### Ressourcen-System

```
Temporale Energie (TE)
       ↓
  Echo-Scherben (ES) → Upgrades, Autobuyer
       ↓
  Zeitkristalle (ZK) → Temporale Dimensionen
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
│   │   └── NumberManager.ts
│   │
│   ├── game/          # Game Content
│   │   ├── currencies/   # Währungen
│   │   ├── generators/    # Generatoren
│   │   └── upgrades/     # Upgrades
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
| 1 | Fundament (Vue Setup, Game Loop, EC1-4) | ✅ Abgeschlossen |
| 2 | Erweiterung (EC5-8, Upgrades, TDT) | 📋 Geplant |
| 3 | Chronaler Shift (Erste Prestige-Ebene) | 📋 Geplant |
| 4 | Epochale Transzendenz | 📋 Geplant |
| 5 | Automatisierung (Sequencer) | 📋 Geplant |
| 6-8 | Erweiterungen (RS, NF, HO) | 📋 Geplant |

## Spielmechaniken

### Generatoren

Jeder Echo-Sammler (EC1-EC8) sammelt die vorherige Ressource und produziert die aktuelle. Die Kosten wachsen exponentiell, während die Produktion linear steigt.

### Prestige-System

Beim "Chronalen Shift" werden alle Generatoren zurückgesetzt, aber du erhältst Echo-Scherben, die permanente Upgrades freischalten.

## Inspiration

- [Antimatter Dimensions](https://github.com/IvarK/IvarK.github.io)
- [Revolution Idle](https://revolutionidle.com/)
- [Generic Idle Game Template](https://github.com/CookieMonster101/IvyFramework)

## Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

---

*Hergestellt mit ❤️ und vielen Stunden Zeitmanipulation*