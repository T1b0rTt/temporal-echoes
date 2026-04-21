# Spielmechaniken - Temporal Echoes

## Ressourcen-System

### Liste aller Währungen

| Währung | Symbol | Verwendungszweck | Erste Prduktion |
|--------|--------|-----------------|----------------|
| Temporale Energie | TE | Basis-Ressource | EC1 |
| Echo-Scherben | ES | Permanente Upgrades | Chronaler Shift |
| Zeitkristalle | ZK | TD-Generatoren | TD1 |
| Realitätsstränge | RS | Fähigkeiten | Future |
| Nexus-Fragmente | NF | Glyphen | Future |
| Himmlische Orbs | HO | Meta-Progression | Future |

### Produktions-Formeln

```
EC1 Produktion = EC1.count * TE/s
EC2 Produktion = EC1.production * 0.1 * EC2.count * TE/s
EC3 Produktion = EC2.production * EC3.count * TE/s
...
TD1 Produktion = TD1.count * ZK/s
TD2 Produktion = TD1.production * TD2.count * ZK/s
```

### Kosten-Formel

```
Generator-Kosten = baseCost * (costGrowth ^ count)
```

---

## Prestige-Ebenen

### 1. Dimension Shift
- **Kosten:** 1e6 TE
- **Effekt:** Erhöht TDT um (log10(TE) / 1e6) * 0.01
- **Reset:** Alle Generatoren
- **Behalten:** ES, ZK (falls vorhanden)

### 2. Chronaler Shift
- **Kosten:** 1e12 TE
- **Belohnung:** 5 * (log10(TE) - 10)^1.5 ES
- **Reset:** Alle Generatoren + Dimensionen + TE
- **Behalten:** ES (Echo-Scherben)

### 3. Epochale Transzendenz
- **Kosten:** 1e6 ZK
- **Belohnung:** 4 * (log10(ZK) - 4)^1.5 ZK
- **Reset:** Alle Generatoren + Dimensionen + TE
- **Behalten:** ES, ZK

---

## Generatoren

### Echo-Sammler (EC1-EC8)

| ID | Name | Base Cost | Growth | Produziert |
|----|------|---------|---------|--------|-----------|
| EC1 | Echo-Sammler I | 10 | 1.15 | TE |
| EC2 | Echo-Sammler II | 100 | 1.17 | EC1 |
| EC3 | Echo-Sammler III | 2000 | 1.17 | EC2 |
| EC4 | Echo-Sammler IV | 40000 | 1.18 | EC3 |
| EC5 | Echo-Sammler V | 800000 | 1.19 | EC4 |
| EC6 | Echo-Sammler VI | 1.6e7 | 1.20 | EC5 |
| EC7 | Echo-Sammler VII | 3.2e8 | 1.21 | EC6 |
| EC8 | Echo-Sammler VIII | 6.4e9 | 1.22 | EC7 |

### Temporale Dimensionen (TD1-8)

| ID | Name | Base Cost | Growth | Produziert |
|----|------|---------|---------|--------|-----------|
| TD1 | Temporale Dimension I | 1000 | 1.25 | ZK |
| TD2 | Temporale Dimension II | 5000 | 1.27 | TD1 |
| TD3 | Temporale Dimension III | 25000 | 1.29 | TD2 |
| TD4 | Temporale Dimension IV | 125000 | 1.31 | TD3 |
| TD5 | Temporale Dimension V | 625000 | 1.33 | TD4 |
| TD6 | Temporale Dimension VI | 3.125e6 | 1.35 | TD5 |
| TD7 | Temporale Dimension VII | 15.625e6 | 1.37 | TD6 |
| TD8 | Temporale Dimension VIII | 78.125e6 | 1.40 | TD7 |

---

## Upgrades

### Echo-Scherben Upgrades

| ID | Name | Effekt | Max Stages |
|----|------|-------|--------|--------|
| ES_Auto_EC1 | EC1 Autobuyer | Kauft EC1 automatisch | 1 |
| ES_Global_TE_1 | TE Multiplikator I | +10% TE/Stage | 100 |
| ES_Global_TE_2 | TE Multiplikator II | +25% TE/Stage | 50 |
| ES_EC1_Speed | EC1 Geschwindigkeit | +50% EC1/Stage | 10 |
| ES_Click_Power | Klick-Stärke | +100% Klick/Stage | 20 |
| ES_TDT_Enhancement | TDT Verstärkung | +5% TDT/Stage | 20 |

---

[Back to Wiki](index) | [Gameplay Guide](GAMEPLAY.md) | [Progression](PROGRESSION.md)