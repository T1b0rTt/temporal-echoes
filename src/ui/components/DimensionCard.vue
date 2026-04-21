<script setup lang="ts">
import { computed } from 'vue';
import { Generator } from '@/game/generators/Generator';
import { num } from '@/core/NumberManager';
import { useGameStore } from '../stores/gameStore';

const props = defineProps<{
  dimension: Generator;
}>();

const gameStore = useGameStore();

const canBuy = computed(() => {
  return gameStore.temporalEnergy.gte(props.dimension.cost);
});

const costDisplay = computed(() => {
  return num.format(props.dimension.cost, 0);
});

const productionDisplay = computed(() => {
  return num.format(props.dimension.production, 2);
});

function buy(): void {
  if (!canBuy.value) return;
  gameStore.spendTE(props.dimension.cost);
  props.dimension.buy();
}
</script>

<template>
  <div
    class="dimension-card"
    :class="{ locked: !dimension.isUnlocked }"
    @click="buy"
  >
    <div class="dimension-header">
      <span class="dimension-id">{{ dimension.id }}</span>
      <span class="dimension-count">{{ dimension.formatCount() }}</span>
    </div>

    <div class="dimension-info">
      <h3 class="dimension-name">{{ dimension.name }}</h3>
      <p class="dimension-desc">{{ dimension.description }}</p>
    </div>

    <div class="dimension-stats">
      <div class="stat">
        <span class="stat-label">Produziert</span>
        <span class="stat-value">{{ productionDisplay }}/s</span>
      </div>
    </div>

    <button class="buy-button" :class="{ active: canBuy }" :disabled="!canBuy || !dimension.isUnlocked">
      <span class="cost">{{ costDisplay }} TE</span>
      <span class="action">Kaufen</span>
    </button>
  </div>
</template>

<style scoped>
.dimension-card {
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(99, 102, 241, 0.1) 100%);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.dimension-card:hover:not(.locked) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
}

.dimension-card.locked {
  opacity: 0.4;
  pointer-events: none;
  border-color: var(--color-border);
}

.dimension-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dimension-id {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-accent);
  background: rgba(99, 102, 241, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
}

.dimension-count {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-accent);
}

.dimension-info {
  flex: 1;
}

.dimension-name {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
  color: var(--color-accent);
}

.dimension-desc {
  font-size: 0.8rem;
  color: var(--color-text-secondary);
}

.dimension-stats {
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
  color: var(--color-success);
}

.buy-button {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 0.875rem;
  transition: all 0.15s ease;
}

.buy-button.active {
  background: var(--color-accent);
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