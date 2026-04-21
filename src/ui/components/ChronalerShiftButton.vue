<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const canPrestige = computed(() => {
  return gameStore.temporalEnergy >= 1e12;
});

const rewardDisplay = computed(() => {
  const te = gameStore.temporalEnergy;
  if (te < 1e12) return '0';
  const logTE = Math.log10(te) - 10;
  return Math.floor(5 * Math.pow(logTE, 1.5));
});

const shiftsCount = computed(() => 0);

async function prestige(): Promise<void> {
  if (!canPrestige.value) return;
  await gameStore.doChronalerShift();
}
</script>

<template>
  <button
    class="chronaler-shift-button"
    :class="{ active: canPrestige }"
    :disabled="!canPrestige"
    @click="prestige"
  >
    <div class="shift-header">
      <span class="shift-icon">⏰</span>
      <span class="shift-title">Chronaler Shift</span>
      <span class="shift-count">{{ shiftsCount }}x</span>
    </div>

    <p class="shift-desc">
      Setze alle Generatoren zurück und erhalte
      <span class="reward">{{ rewardDisplay }}</span>
      Echo-Scherben
    </p>

    <p class="shift-requirement">
      Benötigt: {{ num.format(1e12, 0) }} TE
    </p>
  </button>
</template>

<style scoped>
.chronaler-shift-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(236, 72, 153, 0.15) 100%);
  border: 2px solid var(--color-danger);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.chronaler-shift-button:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(236, 72, 153, 0.4);
}

.chronaler-shift-button.active {
  background: linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(236, 72, 153, 0.45) 100%);
  animation: pulse 2s infinite;
}

.chronaler-shift-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--color-border);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(236, 72, 153, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(236, 72, 153, 0);
  }
}

.shift-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.shift-icon {
  font-size: 1.5rem;
}

.shift-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-danger);
}

.shift-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.shift-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.reward {
  color: var(--color-success);
  font-weight: 600;
  font-family: var(--font-mono);
}

.shift-requirement {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}
</style>