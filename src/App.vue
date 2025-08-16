<template>
  <div id="app">
    <header>
      <h1>Prompter</h1>
      <p>Generate structured prompts through a series of questions</p>
    </header>

    <ImportPrompt @import-success="handleImportSuccess" />

    <div class="container">
      <PromptForm
        :initial-data="importedData"
        @form-updated="handleFormUpdate"
      />
      <PromptPreview
        :generated-prompt="generatedPrompt"
        :is-generating="isGenerating"
        :format-error="formatError"
      />
    </div>

    <footer>
      <p>Built with Vue.js and Vite</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ImportPrompt from "./components/ImportPrompt.vue";
import PromptForm from "./components/PromptForm.vue";
import PromptPreview from "./components/PromptPreview.vue";
import { usePromptGenerator } from "./composables/usePromptGenerator";
import { ShortlinkGenerator } from "./utils/shortlinkGenerator.js";

const { generatedPrompt, isGenerating, formatError } = usePromptGenerator();

const importedData = ref({});

const handleImportSuccess = (components) => {
  importedData.value = components;
};

const handleFormUpdate = () => {
  // This is handled by the composable's reactive system
  // Form data is automatically processed by the composable
};

// Handle shortlink on app load
onMounted(async () => {
  if (ShortlinkGenerator.hasShortlink()) {
    try {
      const xmlContent = await ShortlinkGenerator.parseShortlink(window.location.href);
      const { parsePrompt } = await import('./utils/promptParser.js');
      const result = await parsePrompt(xmlContent);
      
      if (result.success) {
        importedData.value = result.components;
        // Show success message
        console.log('✅ Shortlink loaded successfully!');
      } else {
        console.error('❌ Failed to parse shortlink:', result.error);
      }
    } catch (error) {
      console.error('❌ Failed to load shortlink:', error.message);
    }
  }
});
</script>

<style scoped>
header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  margin: 0;
  background: linear-gradient(45deg, #646cff, #535bf2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

header p {
  color: #888;
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
}

footer {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #333;
  color: #888;
}
</style>
