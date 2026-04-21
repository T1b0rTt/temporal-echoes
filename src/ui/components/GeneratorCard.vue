<script setup lang="ts">
import { computed } from 'vue';
import { Generator } from '@/game/generators/Generator';
import { num } from '@/core/NumberManager';
import { useGameStore } from '../stores/gameStore';
import { Game } from '@/core/Game';

const props = defineProps<{
  generator: Generator;
}>();

const gameStore = useGameStore();
const game = Game.getInstance();

const gameGenerator = computed(() => {
  return game.generators.get(props.generator.id);
});

const canBuy = computed(() => {
  const gen = gameGenerator.value;
  if (!gen) return false;
  return gameStore.temporalEnergy.gte(gen.cost);
});

const costDisplay = computed(() => {
  const gen = gameGenerator.value;
  if (!gen) return '0';
  return num.format(gen.cost, 0);
});

const productionDisplay = computed(() => {
  const gen = gameGenerator.value;
  if (!gen) return '0';
  
  if (gen.id === 'EC1') {
    return num.format(gen.production, 2);
  }
  
  const prevId = 'EC' + (parseInt(gen.id.replace('EC', '')) - 1);
  const prevGen = game.generators.get(prevId);
  if (!prevGen) return num.format(gen.production, 2);
  
  const rate = 0.05 + Math.random() * 0.07;
  const production = prevGen.production.mul(rate).mul(gen.count);
  return num.format(production, 2);
});

const countDisplay = computed(() => {
  const gen = gameGenerator.value;
  if (!gen) return '0';
  return gen.count.toFixed(0);
});

function buy(): void {
  if (!canBuy.value) return;
  const success = game.buyGenerator(props.generator.id, gameStore.temporalEnergy);
  if (success) {
    gameStore.temporalEnergy = game.temporalEnergy.amount;
  }
}
</script>

<template>
  <div class="generator-card" :class="{ disabled: !gameGenerator?.isUnlocked }">
    <div class="generator-header">
      <span class="generator-id">{{ generator.id }}</span>
      <span class="generator-count">{{ countDisplay }}</span>
    </div>

    <div class="generator-info">
      <h3 class="generator-name">{{ generator.name }}</h3>
      <p class="generator-desc">{{ generator.description }}</p>
    </div>

    <div class="generator-stats">
      <div class="stat">
        <span class="stat-label">Produziert</span>
        <span class="stat-value">{{ productionDisplay }}/s {{ generator.produces }}</span>
      </div>
    </div>

    <button
      class="buy-button"
      :class="{ active: canBuy }"
      :disabled="!canBuy"
      @click="buy"
    >
      <span class="cost">{{ costDisplay }} TE</span>
      <span class="action">Kaufen</span>
    </button>
  </div>
</template>

<style scoped>
.generator-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.generator-card:hover {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.generator-card.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.generator-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.generator-id {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent);
  background: rgba(99, 102, 241, 0.15);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.generator-count {
  font-size: 1.25rem;
  font-weight: 700;
  font-family: var(--font-mono);
}

.generator-info {
  flex: 1;
}

.generator-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.generator-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.generator-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
}

.stat-label {
  color: var(--color-text-secondary);
}

.stat-value {
  font-family: var(--font-mono);
}

.buy-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.buy-button:hover:not(:disabled) {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.buy-button.active {
  background: var(--color-accent);
  border-color: var(--color-accent);
}

.buy-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cost {
  font-family: var(--font-mono);
  font-weight: 600;
}

.action {
  font-weight: 500;
}
</style>