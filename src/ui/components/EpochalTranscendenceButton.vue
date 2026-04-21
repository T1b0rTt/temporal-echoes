<script setup lang="ts">
import { computed } from 'vue';
import { Game } from '@/core/Game';
import { useGameStore } from '../stores/gameStore';
import { num } from '@/core/NumberManager';

const gameStore = useGameStore();
const game = Game.getInstance();

const canTranscend = computed(() => {
  return game.canEpochalTranscendence();
});

const rewardDisplay = computed(() => {
  return num.format(game.getEpochalTranscendenceReward(), 0);
});

const transcensionsCount = computed(() => {
  return game.epochalTranscensions;
});

async function transcend(): Promise<void> {
  if (!canTranscend.value) return;
  await gameStore.doEpochalTranscendence();
}
</script>

<template>
  <button
    class="epochal-transcendence-button"
    :class="{ active: canTranscend }"
    :disabled="!canTranscend"
    @click="transcend"
  >
    <div class="transcend-header">
      <span class="transcend-icon">✨</span>
      <span class="transcend-title">Epochale Transzendenz</span>
      <span class="transcend-count">{{ transcensionsCount }}x</span>
    </div>

    <p class="transcend-desc">
      Setze alles zurück und erhalte
      <span class="reward">{{ rewardDisplay }}</span>
      Zeitkristalle
    </p>

    <p class="transcend-requirement">
      Benötigt: {{ num.format(1e6, 0) }} ZK
    </p>
  </button>
</template>

<style scoped>
.epochal-transcendence-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--color-surface) 0%, rgba(168, 85, 247, 0.15) 100%);
  border: 2px solid #a855f7;
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
}

.epochal-transcendence-button:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 5px 20px rgba(168, 85, 247, 0.4);
}

.epochal-transcendence-button.active {
  background: linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(168, 85, 247, 0.45) 100%);
  animation: pulse 2s infinite;
}

.epochal-transcendence-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: var(--color-border);
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(168, 85, 247, 0.4);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(168, 85, 247, 0);
  }
}

.transcend-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.transcend-icon {
  font-size: 1.5rem;
}

.transcend-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #a855f7;
}

.transcend-count {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.transcend-desc {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  text-align: center;
}

.reward {
  color: var(--color-success);
  font-weight: 600;
  font-family: var(--font-mono);
}

.transcend-requirement {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}
</style>