<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  tabs: { id: string; label: string }[];
}>();

const emit = defineEmits<{
  'tab-change': [tabId: string];
}>();

const activeTab = ref(props.tabs[0]?.id || '');

function selectTab(tabId: string): void {
  activeTab.value = tabId;
  emit('tab-change', tabId);
}
</script>

<template>
  <div class="tab-navigation">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      class="tab-button"
      :class="{ active: activeTab === tab.id }"
      @click="selectTab(tab.id)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
.tab-navigation {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  background: var(--color-bg-secondary);
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
}

.tab-button {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  background: transparent;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.tab-button:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.tab-button.active {
  background: var(--color-accent);
  color: white;
}
</style>