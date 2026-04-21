<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { num } from '@/core/NumberManager';

const gameStore = useGameStore();

const teDisplay = computed(() => {
  return num.format(gameStore.temporalEnergy, 1);
});

const tePerSecond = computed(() => {
  return num.format(gameStore.temporalEnergy, 1);
});
</script>

<template>
  <div class="resource-bar">
    <div class="resource main-resource">
      <span class="resource-label">Temporale Energie</span>
      <span class="resource-value">{{ teDisplay }}</span>
      <span class="resource-rate">+{{ tePerSecond }}/s</span>
    </div>
  </div>
</template>

<style scoped>
.resource-bar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
}

.resource {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.main-resource {
  flex: 1;
}

.resource-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.resource-value {
  font-size: 1.5rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-accent);
}

.resource-rate {
  font-size: 0.875rem;
  color: var(--color-success);
}
</style>