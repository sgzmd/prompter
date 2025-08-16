<template>
  <div class="import-section">
    <h3>Import Existing Prompt</h3>
    <div class="form-group">
      <label for="import-textarea">Paste your XML prompt here:</label>
      <textarea
        id="import-textarea"
        v-model="importText"
        placeholder="Paste your XML prompt here..."
        rows="6"
      ></textarea>
    </div>

    <div class="button-group">
      <button
        @click="parsePromptHandler"
        :disabled="!importText.trim() || isParsing"
        class="btn-primary"
      >
        {{ isParsing ? "Parsing..." : "Parse Prompt" }}
      </button>
      <button @click="clearImport" class="btn-secondary">Clear</button>
    </div>

    <div v-if="parseError" class="error-message">
      {{ parseError }}
    </div>

    <div v-if="parseSuccess" class="success-message">
      Prompt parsed successfully! Form has been populated.
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { usePromptParser } from "../utils/promptParser";

const emit = defineEmits(["import-success"]);

const { parsePrompt } = usePromptParser();

const importText = ref("");
const isParsing = ref(false);
const parseError = ref("");
const parseSuccess = ref(false);

const parsePromptHandler = async () => {
  if (!importText.value.trim()) return;

  isParsing.value = true;
  parseError.value = "";
  parseSuccess.value = false;

  try {
    const result = await parsePrompt(importText.value);

    if (result.success) {
      emit("import-success", result.components);
      parseSuccess.value = true;
      setTimeout(() => {
        parseSuccess.value = false;
      }, 3000);
    } else {
      parseError.value = result.error;
    }
  } catch (error) {
    parseError.value = "Failed to parse prompt: " + error.message;
  } finally {
    isParsing.value = false;
  }
};

const clearImport = () => {
  importText.value = "";
  parseError.value = "";
  parseSuccess.value = false;
};
</script>

<style scoped>
.error-message {
  color: #dc3545;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid #dc3545;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
}

.success-message {
  color: #28a745;
  background: rgba(40, 167, 69, 0.1);
  border: 1px solid #28a745;
  border-radius: 4px;
  padding: 0.75rem;
  margin-top: 1rem;
}

.button-group {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
}
</style>
