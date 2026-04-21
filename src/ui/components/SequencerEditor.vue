<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Sequencer } from '@/game/automation/Sequencer';

const sequencer = Sequencer.getInstance();

const script = ref(`# Temporal Echoes Sequencer Script
# Example script - customize as needed!

# Wait for 100 TE, then start buying
waitfor >= 100

# Buy 10 EC1
buy EC1 10
wait 5

# Buy 5 EC2
buy EC2 5
wait 10

# If we have enough, do prestige
dimension
wait 10
`);

const isRunning = ref(false);
const currentLine = ref(0);
const totalLines = ref(0);
const errorMsg = ref('');

const progress = computed(() => {
  if (totalLines.value === 0) return 0;
  return (currentLine.value / totalLines.value) * 100;
});

function loadScript(): void {
  const success = sequencer.loadScript(script.value);
  if (success) {
    errorMsg.value = '';
    totalLines.value = sequencer.getTotalLines();
  } else {
    errorMsg.value = 'Invalid script';
  }
}

function startScript(): void {
  loadScript();
  if (errorMsg.value) return;
  
  sequencer.start();
  isRunning.value = true;
}

function stopScript(): void {
  sequencer.stop();
  isRunning.value = false;
}

function pauseScript(): void {
  sequencer.pause();
  isRunning.value = false;
}

function resumeScript(): void {
  sequencer.resume();
  isRunning.value = true;
}

let intervalId: number | null = null;

onMounted(() => {
  intervalId = window.setInterval(() => {
    if (sequencer.isActive()) {
      sequencer.tick();
      currentLine.value = sequencer.getCurrentLine();
    }
  }, 100);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
  sequencer.stop();
});
</script>

<template>
  <div class="sequencer-editor">
    <div class="editor-header">
      <h3>Sequencer</h3>
      <div class="controls">
        <button class="btn start" @click="startScript" :disabled="isRunning">
          ▶ Start
        </button>
        <button class="btn pause" @click="pauseScript" :disabled="!isRunning">
          ⏸ Pause
        </button>
        <button class="btn resume" @click="resumeScript" :disabled="isRunning">
          ⏹ Resume
        </button>
        <button class="btn stop" @click="stopScript">
          ⏹ Stop
        </button>
      </div>
    </div>

    <div class="status-bar">
      <span class="status" :class="{ running: isRunning }">
        {{ isRunning ? 'Running' : 'Stopped' }}
      </span>
      <span class="line">Line: {{ currentLine }} / {{ totalLines }}</span>
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progress + '%' }"></div>
      </div>
    </div>

    <div v-if="errorMsg" class="error-msg">
      {{ errorMsg }}
    </div>

    <textarea
      v-model="script"
      class="script-input"
      placeholder="Enter your script here..."
      spellcheck="false"
    ></textarea>

    <div class="help-text">
      <h4>Commands:</h4>
      <code>buy ID [amount]</code> - Buy generator
      <code>wait ticks</code> - Wait (30 ticks = 1 sec)
      <code>waitFor &gt;=|&lt;=|&gt;|&lt; value</code> - Wait for condition
      <code>dimension</code> - Do Dimension Shift
      <code>chronal</code> - Do Chronaler Shift
      <code>epochal</code> - Do Epochale Trans.
      <code>stop</code> - Stop execution
    </div>
  </div>
</template>

<style scoped>
.sequencer-editor {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-accent);
}

.controls {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn.start {
  background: var(--color-success);
  color: white;
}

.btn.pause {
  background: var(--color-warning);
  color: white;
}

.btn.resume {
  background: var(--color-accent);
  color: white;
}

.btn.stop {
  background: var(--color-danger);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  background: var(--color-danger);
  color: white;
}

.status.running {
  background: var(--color-success);
}

.line {
  font-family: var(--font-mono);
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-accent);
  transition: width 0.1s ease;
}

.error-msg {
  padding: 0.5rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-sm);
  color: var(--color-danger);
  font-size: 0.8rem;
}

.script-input {
  width: 100%;
  min-height: 200px;
  padding: 0.75rem;
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: 0.8rem;
  line-height: 1.5;
  resize: vertical;
}

.script-input:focus {
  border-color: var(--color-accent);
  outline: none;
}

.help-text {
  padding: 0.75rem;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
}

.help-text h4 {
  margin-bottom: 0.5rem;
  color: var(--color-text-secondary);
}

.help-text code {
  display: block;
  padding: 0.25rem 0;
  font-family: var(--font-mono);
  color: var(--color-accent);
}
</style>