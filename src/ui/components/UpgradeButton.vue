<script setup lang="ts">
import { computed } from 'vue';
import { Upgrade } from '@/game/upgrades/Upgrade';
import { num } from '@/core/NumberManager';
import { useGameStore } from '../stores/gameStore';

const props = defineProps<{
  upgrade: Upgrade;
}>();

const emit = defineEmits<{
  purchase: [id: string];
}>();

const gameStore = useGameStore();

const canBuy = computed(() => {
  return gameStore.echoShards.gte(props.upgrade.cost) && props.upgrade.canPurchase;
});

const costDisplay = computed(() => {
  return num.format(props.upgrade.cost, 0);
});

const stageDisplay = computed(() => {
  if (props.upgrade.maxStages === 1) {
    return props.upgrade.currentStage > 0 ? 'Gekauft' : 'Nicht gekauft';
  }
  return `${props.upgrade.currentStage}/${props.upgrade.maxStages}`;
});

const effectDisplay = computed(() => {
  const eff = props.upgrade.getEffectiveness();
  if (eff > 0) {
    return `+${(eff * 100).toFixed(0)}%`;
  }
  return '';
});

function buy(): void {
  if (!canBuy.value) return;
  gameStore.spendEchoShards(props.upgrade.cost);
  props.upgrade.buy();
  emit('purchase', props.upgrade.id);
}
</script>

<template>
  <div
    class="upgrade-button"
    :class="{
      disabled: !upgrade.canPurchase,
      purchased: upgrade.isMaxed,
    }"
    @click="buy"
  >
    <div class="upgrade-header">
      <span class="upgrade-name">{{ upgrade.name }}</span>
      <span class="upgrade-stage">{{ stageDisplay }}</span>
    </div>

    <p class="upgrade-desc">{{ upgrade.description }}</p>

    <div class="upgrade-footer">
      <span class="upgrade-cost">{{ costDisplay }} ES</span>
      <span class="upgrade-effect" v-if="effectDisplay">{{ effectDisplay }}</span>
    </div>
  </div>
</template>

<style scoped>
.upgrade-button {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upgrade-button:hover:not(.disabled):not(.purchased) {
  border-color: var(--color-accent);
  transform: translateY(-2px);
}

.upgrade-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upgrade-button.purchased {
  border-color: var(--color-success);
  background: rgba(34, 197, 94, 0.1);
}

.upgrade-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upgrade-name {
  font-weight: 600;
  font-size: 0.875rem;
}

.upgrade-stage {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-family: var(--font-mono);
}

.upgrade-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

.upgrade-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.upgrade-cost {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-accent);
}

.upgrade-effect {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--color-success);
}
</style>