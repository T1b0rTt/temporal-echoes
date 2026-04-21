<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue';
import { Game } from '@/core/Game';
import { useGameStore } from '../stores/gameStore';
import { GAME_TPS } from '@/core/GameLoop';
import ResourceBar from '../components/ResourceBar.vue';
import GeneratorCard from '../components/GeneratorCard.vue';
import DimensionCard from '../components/DimensionCard.vue';
import UpgradeButton from '../components/UpgradeButton.vue';
import PrestigeButton from '../components/PrestigeButton.vue';
import ChronalerShiftButton from '../components/ChronalerShiftButton.vue';
import EpochalTranscendenceButton from '../components/EpochalTranscendenceButton.vue';
import RealityWeaveButton from '../components/RealityWeaveButton.vue';
import NexusButton from '../components/NexusButton.vue';
import CelestialButton from '../components/CelestialButton.vue';
import SaveMenu from '../components/SaveMenu.vue';
import SequencerEditor from '../components/SequencerEditor.vue';
import TabNavigation from '../components/TabNavigation.vue';
import { UpgradeManager } from '@/game/upgrades/UpgradeManager';

const gameStore = useGameStore();
const game = Game.getInstance();
const upgradeManager = UpgradeManager.getInstance();
let tickInterval: ReturnType<typeof setInterval> | null = null;

const activeTab = ref('generators');

const tabs = [
  { id: 'generators', label: 'Generatoren' },
  { id: 'upgrades', label: 'Upgrades' },
  { id: 'dimensions', label: 'Dimensionen' },
  { id: 'prestige', label: 'Prestige' },
  { id: 'sequencer', label: 'Sequencer' },
  { id: 'settings', label: 'Einstellungen' },
];

const generators = computed(() => {
  return game.getUnlockedGenerators();
});

const dimensions = computed(() => {
  return game.getUnlockedDimensions();
});

const upgrades = computed(() => {
  return upgradeManager.getAllUpgrades().filter(u => !u.isMaxed);
});

function handleClick(): void {
  game.click();
  gameStore.temporalEnergy = game.temporalEnergy.amount;
  gameStore.totalTEClicked++;
}

function handleBuyGenerator(generatorId: string): void {
  game.buyGenerator(generatorId, gameStore.temporalEnergy);
}

function handleBuyDimension(dimensionId: string): void {
  game.buyDimension(dimensionId);
}

function handleTabChange(tabId: string): void {
  activeTab.value = tabId;
}

onMounted(() => {
  game.start();
  gameStore.startGame();
  tickInterval = setInterval(() => {
    gameStore.tick(1000 / GAME_TPS / 1000);
  }, 1000 / GAME_TPS);
});

onUnmounted(() => {
  game.stop();
  if (tickInterval) {
    clearInterval(tickInterval);
    tickInterval = null;
  }
});
</script>

<template>
  <div class="main-view">
    <header class="header">
      <h1 class="title">Temporal Echoes</h1>
      <p class="subtitle">Ein Spiel der Zeitmanipulation</p>
    </header>

    <ResourceBar />

    <TabNavigation :tabs="tabs" @tab-change="handleTabChange" />

    <main class="content">
      <div class="click-section">
        <button class="click-button" @click="handleClick">
          <span class="click-icon">+</span>
          <span class="click-text">Temporale Energie sammeln</span>
        </button>
      </div>

      <section class="prestige-section">
        <PrestigeButton />
      </section>

      <div v-if="activeTab === 'generators'" class="tab-content">
        <section class="generators-section">
          <h2 class="section-title">Echo-Sammler</h2>
          <div class="generators-grid">
            <GeneratorCard
              v-for="generator in generators"
              :key="generator.id"
              :generator="generator"
              @click="handleBuyGenerator(generator.id)"
            />
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'upgrades'" class="tab-content">
        <section class="upgrades-section">
          <h2 class="section-title">Upgrades</h2>
          <p class="section-subtitle">Echo-Scherben: {{ gameStore.formattedES }}</p>
          <div class="upgrades-grid">
            <UpgradeButton
              v-for="upgrade in upgrades"
              :key="upgrade.id"
              :upgrade="upgrade"
            />
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'dimensions'" class="tab-content">
        <section class="dimensions-section">
          <h2 class="section-title">Temporale Dimensionen</h2>
          <p class="section-subtitle">TDT Multiplikator: {{ gameStore.formattedTDT }}x</p>
          <div class="dimensions-grid">
            <DimensionCard
              v-for="dimension in dimensions"
              :key="dimension.id"
              :dimension="dimension"
              @click="handleBuyDimension(dimension.id)"
            />
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'settings'" class="tab-content">
        <section class="settings-section">
          <h2 class="section-title">Einstellungen</h2>
          <SaveMenu />
        </section>
      </div>

      <div v-if="activeTab === 'prestige'" class="tab-content">
        <section class="prestige-section">
          <h2 class="section-title">Prestige</h2>
          <p class="section-subtitle">Echo-Scherben: {{ gameStore.formattedES }}</p>

          <div class="prestige-buttons">
            <PrestigeButton />
            <ChronalerShiftButton />
          </div>

          <h3 class="subsection-title">Epochale Transzendenz</h3>
          <p class="section-subtitle">Zeitkristalle: {{ gameStore.formattedZK }}</p>

          <div class="prestige-buttons">
            <EpochalTranscendenceButton />
          </div>

          <h3 class="subsection-title">Reality Weave</h3>
          <p class="section-subtitle">Realitätsstränge: {{ gameStore.formattedRS }}</p>

          <div class="prestige-buttons">
            <RealityWeaveButton />
          </div>

          <h3 class="subsection-title">Nexus</h3>
          <p class="section-subtitle">Nexus-Fragmente: {{ gameStore.formattedNF }}</p>

          <div class="prestige-buttons">
            <NexusButton />
          </div>

          <h3 class="subsection-title">Celestial Ascension</h3>
          <p class="section-subtitle">Himmlische Orbs: {{ gameStore.formattedHO }}</p>

          <div class="prestige-buttons">
            <CelestialButton />
          </div>
        </section>
      </div>

      <div v-if="activeTab === 'sequencer'" class="tab-content">
        <section class="sequencer-section">
          <h2 class="section-title">Sequencer</h2>
          <SequencerEditor />
        </section>
      </div>
    </main>

    <footer class="footer">
      <p>Zeit gespielt: {{ Math.floor(gameStore.totalPlayTime / 60) }}min</p>
      <p>Klicks: {{ gameStore.totalTEClicked }}</p>
    </footer>
  </div>
</template>

<style scoped>
.main-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, var(--color-bg-secondary) 0%, var(--color-surface) 100%);
}

.title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.content {
  flex: 1;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.click-section {
  display: flex;
  justify-content: center;
  padding: 0.5rem;
}

.click-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 2.5rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, #8b5cf6 100%);
  border-radius: var(--radius-lg);
  color: white;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-lg);
}

.click-button:hover {
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(99, 102, 241, 0.4);
}

.click-button:active {
  transform: scale(0.98);
}

.click-icon {
  font-size: 2.5rem;
  font-weight: 300;
}

.click-text {
  font-size: 0.8rem;
  font-weight: 500;
}

.prestige-section {
  padding: 0 0.5rem;
}

.tab-content {
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.generators-section,
.upgrades-section,
.dimensions-section,
.settings-section,
.sequencer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.subsection-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

.generators-grid,
.upgrades-grid,
.dimensions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  font-size: 0.7rem;
  color: var(--color-text-secondary);
}
</style>