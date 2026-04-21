<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue';
import { Game } from '@/core/Game';
import { useGameStore } from '../stores/gameStore';
import ResourceBar from '../components/ResourceBar.vue';
import GeneratorCard from '../components/GeneratorCard.vue';

const gameStore = useGameStore();
const game = Game.getInstance();

const generators = computed(() => {
  return game.getAllGenerators().filter(g => g.isUnlocked);
});

function handleClick(): void {
  game.click();
  gameStore.totalTEClicked++;
}

function handleBuy(generatorId: string): void {
  game.buyGenerator(generatorId, gameStore.temporalEnergy);
}

onMounted(() => {
  game.start();
  gameStore.startGame();
});

onUnmounted(() => {
  game.stop();
});
</script>

<template>
  <div class="main-view">
    <header class="header">
      <h1 class="title">Temporal Echoes</h1>
      <p class="subtitle">Ein Spiel der Zeitmanipulation</p>
    </header>

    <ResourceBar />

    <main class="content">
      <div class="click-section">
        <button class="click-button" @click="handleClick">
          <span class="click-icon">+</span>
          <span class="click-text">Temporale Energie sammeln</span>
        </button>
      </div>

      <section class="generators-section">
        <h2 class="section-title">Echo-Sammler</h2>
        <div class="generators-grid">
          <GeneratorCard
            v-for="generator in generators"
            :key="generator.id"
            :generator="generator"
            @click="handleBuy(generator.id)"
          />
        </div>
      </section>
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
  gap: 2rem;
}

.click-section {
  display: flex;
  justify-content: center;
  padding: 1rem;
}

.click-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 3rem;
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
  font-size: 3rem;
  font-weight: 300;
}

.click-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.generators-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  border-bottom: 2px solid var(--color-accent);
  padding-bottom: 0.5rem;
}

.generators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.footer {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: var(--color-bg-secondary);
  border-top: 1px solid var(--color-border);
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}