<script setup lang="ts">
import { computed } from 'vue';
import { num } from '@/core/NumberManager';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const canPrestige = computed(() => {
  return gameStore.isDimensionShiftAvailable;
});

const costDisplay = computed(() => {
  return num.format(1e6, 0);
});

const rewardDisplay = computed(() => {
  const te = gameStore.temporalEnergy;
  if (te.lt(1e12)) return '0';
  const logTE = te.log10().toNumber() - 10;
  return num.format(5 * Math.pow(logTE, 1.5), 0);
});

async function prestige(): Promise<void> {
  if (!canPrestige.value) return;
  await gameStore.doDimensionShift();
}
</script>

<template>
  <button
    class="prestige-button"
    :class="{ active: canPrestige }"
    :disabled="!canPrestige"
    @click="prestige"
  >
    <span class="prestige-title">Dimension Shift</span>
    <span class="prestige-desc">
      Zurücksetzen für
      <span class="reward">{{ rewardDisplay }}</span>
      Echo-Scherben
    </span>
    <span class="prestige-cost">Kostet: {{ costDisplay }} TE</span>
  </button>
</template>

<style scoped>
.prestige-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(139, 92, 246, 0.2) 100%);
  border: 2px solid var(--color-warning);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.prestige-button:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4);
}

.prestige-button.active {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.5) 100%);
  animation: pulse 2s infinite;
}

.prestige-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--color-border);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(139, 92, 246, 0);
  }
}

.prestige-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-warning);
}

.prestige-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.reward {
  color: var(--color-success);
  font-weight: 600;
  font-family: var(--font-mono);
}

.prestige-cost {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}
</style>