<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const canAscend = computed(() => gameStore.realityStrands >= 1e6);
const rewardDisplay = computed(() => {
  const rs = gameStore.realityStrands;
  if (rs < 1e6) return '0';
  const logRS = Math.log10(rs) - 4;
  return Math.floor(2 * Math.pow(logRS, 1.5));
});
const ascensionsCount = computed(() => 0);

async function ascend(): Promise<void> {
  if (!canAscend.value) return;
  await gameStore.doNexusAscend();
}
</script>

<template>
  <button class="nexus-button" :class="{ active: canAscend }" :disabled="!canAscend" @click="ascend">
    <div class="nexus-header">
      <span class="nexus-icon">💎</span>
      <span class="nexus-title">Nexus</span>
      <span class="nexus-count">{{ ascensionsCount }}x</span>
    </div>
    <p class="nexus-desc">Erhalte <span class="reward">{{ rewardDisplay }}</span> Nexus-Fragmente</p>
    <p class="nexus-requirement">Benötigt: {{ num.format(1e6, 0) }} RS</p>
  </button>
</template>

<style scoped>
.nexus-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(20, 184, 166, 0.15) 100%);
  border: 2px solid #14b8a6;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}
.nexus-button:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 5px 20px rgba(20, 184, 166, 0.4); }
.nexus-button.active { background: linear-gradient(135deg, rgba(20, 184, 166, 0.25) 0%, rgba(20, 184, 166, 0.45) 100%); animation: pulse 2s infinite; }
.nexus-button:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--color-border); }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(20, 184, 166, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(20, 184, 166, 0); } }
.nexus-header { display: flex; align-items: center; gap: 0.5rem; }
.nexus-icon { font-size: 1.5rem; }
.nexus-title { font-size: 1.25rem; font-weight: 700; color: #14b8a6; }
.nexus-count { font-size: 0.875rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
.nexus-desc { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; }
.reward { color: var(--color-success); font-weight: 600; font-family: var(--font-mono); }
.nexus-requirement { font-size: 0.75rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
</style>