<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const canAscend = computed(() => gameStore.nexusFragments >= 1e6);
const rewardDisplay = computed(() => {
  const nf = gameStore.nexusFragments;
  if (nf < 1e6) return '0';
  const logNF = Math.log10(nf) - 4;
  return Math.floor(1 * Math.pow(logNF, 1.5));
});
const ascensionsCount = computed(() => 0);

async function ascend(): Promise<void> {
  if (!canAscend.value) return;
  await gameStore.doCelestialAscend();
}
</script>

<template>
  <button class="celestial-button" :class="{ active: canAscend }" :disabled="!canAscend" @click="ascend">
    <div class="celestial-header">
      <span class="celestial-icon">🌟</span>
      <span class="celestial-title">Celestial Ascension</span>
      <span class="celestial-count">{{ ascensionsCount }}x</span>
    </div>
    <p class="celestial-desc">Erhalte <span class="reward">{{ rewardDisplay }}</span> Himmlische Orbs</p>
    <p class="celestial-requirement">Benötigt: {{ num.format(1e6, 0) }} NF</p>
  </button>
</template>

<style scoped>
.celestial-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(251, 191, 36, 0.15) 100%);
  border: 2px solid #fbbf24;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}
.celestial-button:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 5px 20px rgba(251, 191, 36, 0.4); }
.celestial-button.active { background: linear-gradient(135deg, rgba(251, 191, 36, 0.25) 0%, rgba(251, 191, 36, 0.45) 100%); animation: pulse 2s infinite; }
.celestial-button:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--color-border); }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(251, 191, 36, 0); } }
.celestial-header { display: flex; align-items: center; gap: 0.5rem; }
.celestial-icon { font-size: 1.5rem; }
.celestial-title { font-size: 1.25rem; font-weight: 700; color: #fbbf24; }
.celestial-count { font-size: 0.875rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
.celestial-desc { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; }
.reward { color: var(--color-success); font-weight: 600; font-family: var(--font-mono); }
.celestial-requirement { font-size: 0.75rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
</style>