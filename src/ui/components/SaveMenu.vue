<script setup lang="ts">
import { ref } from 'vue';
import { SaveManager } from '@/core/SaveManager';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();
const saveManager = SaveManager.getInstance();

const exportString = ref('');
const importString = ref('');
const showImport = ref(false);

async function handleSave(): Promise<void> {
  await gameStore.saveGame();
  alert('Spiel gespeichert!');
}

async function handleLoad(): Promise<void> {
  await gameStore.loadGame();
  alert('Spiel geladen!');
}

function handleExport(): void {
  exportString.value = saveManager.exportToLocalStorage();
}

function handleImport(): void {
  if (!importString.value) return;
  const success = saveManager.importFromLocalStorage(importString.value);
  if (success) {
    alert('Import erfolgreich!');
    importString.value = '';
    showImport.value = false;
  } else {
    alert('Import fehlgeschlagen!');
  }
}

function copyExport(): void {
  navigator.clipboard.writeText(exportString.value);
  alert('In Zwischenablage kopiert!');
}
</script>

<template>
  <div class="save-menu">
    <h3 class="menu-title">Speicher</h3>

    <div class="menu-buttons">
      <button class="menu-button save" @click="handleSave">
        Speichern
      </button>

      <button class="menu-button load" @click="handleLoad">
        Laden
      </button>

      <button class="menu-button export" @click="handleExport">
        Export
      </button>

      <button class="menu-button import" @click="showImport = !showImport">
        Import
      </button>
    </div>

    <div v-if="exportString" class="export-area">
      <textarea
        v-model="exportString"
        readonly
        class="export-textarea"
        rows="3"
      ></textarea>
      <button class="copy-button" @click="copyExport">
        Kopieren
      </button>
    </div>

    <div v-if="showImport" class="import-area">
      <textarea
        v-model="importString"
        placeholder="Import-String einfügen..."
        class="import-textarea"
        rows="3"
      ></textarea>
      <button class="import-button" @click="handleImport">
        Importieren
      </button>
    </div>
  </div>
</template>

<style scoped>
.save-menu {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.menu-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.menu-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

.menu-button {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.menu-button.save {
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid var(--color-success);
  color: var(--color-success);
}

.menu-button.save:hover {
  background: var(--color-success);
  color: var(--color-bg);
}

.menu-button.load {
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid var(--color-accent);
  color: var(--color-accent);
}

.menu-button.load:hover {
  background: var(--color-accent);
  color: white;
}

.menu-button.export {
  background: rgba(245, 158, 11, 0.2);
  border: 1px solid var(--color-warning);
  color: var(--color-warning);
}

.menu-button.export:hover {
  background: var(--color-warning);
  color: var(--color-bg);
}

.menu-button.import {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid var(--color-danger);
  color: var(--color-danger);
}

.menu-button.import:hover {
  background: var(--color-danger);
  color: white;
}

.export-area,
.import-area {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.export-textarea,
.import-textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg-secondary);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.7rem;
  resize: none;
}

.copy-button,
.import-button {
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  background: var(--color-accent);
  color: white;
  font-weight: 500;
}

.import-button {
  background: var(--color-success);
}
</style>