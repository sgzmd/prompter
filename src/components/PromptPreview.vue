<template>
  <div class="preview-section">
    <h2>Generated Prompt</h2>

    <div v-if="isGenerating" class="loading">Generating prompt...</div>

    <div v-else-if="!generatedPrompt" class="empty-state">
      <p>Start filling out the form to see your generated prompt here.</p>
    </div>

    <div v-else class="preview-content">
      <div class="preview-header">
        <span class="format-badge">XML</span>
        <button
          @click="copyToClipboard"
          class="copy-btn"
          :title="copySuccess ? 'Copied!' : 'Copy to clipboard'"
        >
          {{ copySuccess ? "✓" : "📋" }}
        </button>
      </div>
      <pre>{{ generatedPrompt }}</pre>
    </div>

    <div v-if="formatError" class="error-message">
      {{ formatError }}
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  generatedPrompt: {
    type: String,
    default: "",
  },
  isGenerating: {
    type: Boolean,
    default: false,
  },
  formatError: {
    type: String,
    default: "",
  },
});

const copySuccess = ref(false);

const copyToClipboard = async () => {
  if (!props.generatedPrompt) return;

  try {
    await navigator.clipboard.writeText(props.generatedPrompt);
    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = props.generatedPrompt;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    copySuccess.value = true;
    setTimeout(() => {
      copySuccess.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
.loading {
  text-align: center;
  padding: 2rem;
  color: #888;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #888;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #444;
}

.format-badge {
  background: #646cff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
}

.copy-btn {
  background: #333;
  border: 1px solid #555;
  border-radius: 4px;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s;
}

.copy-btn:hover {
  background: #444;
}

.copy-btn:active {
  transform: scale(0.95);
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: "Courier New", monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.error-message {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
}
</style>
