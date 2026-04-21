<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

const canWeave = computed(() => gameStore.realityStrands >= 1e9);
const rewardDisplay = computed(() => {
  const rs = gameStore.realityStrands;
  if (rs < 1e9) return '0';
  const logRS = Math.log10(rs) - 7;
  return Math.floor(3 * Math.pow(logRS, 1.5));
});
const weavesCount = computed(() => 0);

async function weave(): Promise<void> {
  if (!canWeave.value) return;
  await gameStore.doRealityWeave();
}
</script>

<template>
  <button class="reality-weave-button" :class="{ active: canWeave }" :disabled="!canWeave" @click="weave">
    <div class="weave-header">
      <span class="weave-icon">🔮</span>
      <span class="weave-title">Reality Weave</span>
      <span class="weave-count">{{ weavesCount }}x</span>
    </div>
    <p class="weave-desc">Erhalte <span class="reward">{{ rewardDisplay }}</span> Realitätsstränge</p>
    <p class="weave-requirement">Benötigt: {{ num.format(1e9, 0) }} ZK</p>
  </button>
</template>

<style scoped>
.reality-weave-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 2px solid #8b5cf6;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}
.reality-weave-button:hover:not(:disabled) { transform: scale(1.02); box-shadow: 0 5px 20px rgba(139, 92, 246, 0.4); }
.reality-weave-button.active { background: linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(139, 92, 246, 0.45) 100%); animation: pulse 2s infinite; }
.reality-weave-button:disabled { opacity: 0.5; cursor: not-allowed; border-color: var(--color-border); }
@keyframes pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); } }
.weave-header { display: flex; align-items: center; gap: 0.5rem; }
.weave-icon { font-size: 1.5rem; }
.weave-title { font-size: 1.25rem; font-weight: 700; color: #8b5cf6; }
.weave-count { font-size: 0.875rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
.weave-desc { font-size: 0.875rem; color: var(--color-text-secondary); text-align: center; }
.reward { color: var(--color-success); font-weight: 600; font-family: var(--font-mono); }
.weave-requirement { font-size: 0.75rem; color: var(--color-text-secondary); font-family: var(--font-mono); }
</style>