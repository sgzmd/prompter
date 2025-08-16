<template>
  <div class="shortlink-section">
    <button 
      @click="generateShortlink" 
      :disabled="!generatedPrompt || isGenerating"
      class="btn-primary"
    >
      {{ isGenerating ? 'Generating...' : '🔗 Create Shortlink' }}
    </button>

    <div v-if="shortlink" class="shortlink-result">
      <div class="shortlink-header">
        <h4>Shareable Link:</h4>
        <button @click="copyShortlink" class="copy-btn" :title="copySuccess ? 'Copied!' : 'Copy link'">
          {{ copySuccess ? '✓' : '📋' }}
        </button>
      </div>
      
      <div class="shortlink-url">
        <input 
          :value="shortlink" 
          readonly 
          class="shortlink-input"
          @click="selectAll"
        />
      </div>

      <div class="security-warning">
        <p>{{ securityWarning }}</p>
      </div>
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ShortlinkGenerator } from '../utils/shortlinkGenerator.js'

const props = defineProps({
  generatedPrompt: {
    type: String,
    default: ''
  }
})

const shortlink = ref('')
const isGenerating = ref(false)
const copySuccess = ref(false)
const error = ref('')
const securityWarning = ref('')

const generateShortlink = async () => {
  if (!props.generatedPrompt) return

  isGenerating.value = true
  error.value = ''
  shortlink.value = ''

  try {
    const link = await ShortlinkGenerator.generateShortlink(props.generatedPrompt)
    shortlink.value = link
    securityWarning.value = ShortlinkGenerator.getSecurityWarning()
  } catch (err) {
    error.value = 'Failed to generate shortlink: ' + err.message
  } finally {
    isGenerating.value = false
  }
}

const copyShortlink = async () => {
  if (!shortlink.value) return

  try {
    await ShortlinkGenerator.copyToClipboard(shortlink.value)
    copySuccess.value = true
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  } catch (err) {
    error.value = 'Failed to copy shortlink: ' + err.message
  }
}

const selectAll = (event) => {
  event.target.select()
}
</script>

<style scoped>
.shortlink-section {
  margin-top: 1rem;
  padding: 1rem;
  background: #1a1a1a;
  border-radius: 8px;
  border: 1px solid #333;
}

.shortlink-result {
  margin-top: 1rem;
}

.shortlink-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.shortlink-header h4 {
  margin: 0;
  color: #fff;
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

.shortlink-url {
  margin-bottom: 1rem;
}

.shortlink-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 4px;
  background: #2a2a2a;
  color: #fff;
  font-size: 0.9rem;
  font-family: monospace;
  cursor: text;
}

.shortlink-input:focus {
  outline: none;
  border-color: #646cff;
  box-shadow: 0 0 0 2px rgba(100, 108, 255, 0.2);
}

.security-warning {
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid #ffc107;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
}

.security-warning p {
  margin: 0;
  color: #ffc107;
  font-size: 0.9rem;
  white-space: pre-line;
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