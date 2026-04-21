<script setup lang="ts">
import { computed } from 'vue';
import { Generator } from '@/game/generators/Generator';
import { num } from '@/core/NumberManager';
import { useGameStore } from '../stores/gameStore';

const props = defineProps<{
  generator: Generator;
}>();

const gameStore = useGameStore();

const canBuy = computed(() => {
  return gameStore.temporalEnergy.gte(props.generator.cost);
});

const costDisplay = computed(() => {
  return num.format(props.generator.cost, 0);
});

const productionDisplay = computed(() => {
  return num.format(props.generator.production, 2);
});

function buy(): void {
  if (!canBuy.value) return;
  gameStore.spendTE(props.generator.cost);
  props.generator.buy();
}
</script>

<template>
  <div class="generator-card" :class="{ disabled: !generator.isUnlocked }">
    <div class="generator-header">
      <span class="generator-id">{{ generator.id }}</span>
      <span class="generator-count">{{ generator.formatCount() }}</span>
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