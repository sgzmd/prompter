<template>
  <div class="form-section">
    <h2>Prompt Builder</h2>

    <!-- Role -->
    <div class="form-group">
      <label for="role">Role *</label>
      <input
        id="role"
        v-model="role"
        type="text"
        placeholder="e.g., Expert Software Engineer"
        @input="handleRoleInput"
      />
      <div v-if="showRoleSuggestions" class="suggestions">
        <div
          v-for="suggestion in filteredRoleSuggestions"
          :key="suggestion"
          class="suggestion-item"
          @click="selectRole(suggestion)"
        >
          {{ suggestion }}
        </div>
      </div>
    </div>

    <!-- Goal -->
    <div class="form-group">
      <label for="goal">Goal *</label>
      <textarea
        id="goal"
        v-model="goal"
        placeholder="What is the goal you need to accomplish?"
        rows="3"
      ></textarea>
      <div class="char-counter">{{ goal.length }}/500</div>
    </div>

    <!-- Constraints -->
    <div class="form-group">
      <label for="constraints">Constraints</label>
      <textarea
        id="constraints"
        v-model="constraints"
        placeholder="Any constraints or limitations..."
        rows="3"
      ></textarea>
      <div class="constraint-suggestions">
        <span class="suggestion-label">Quick add:</span>
        <button
          v-for="suggestion in constraintSuggestions"
          :key="suggestion"
          @click="addConstraint(suggestion)"
          class="suggestion-chip"
        >
          {{ suggestion }}
        </button>
      </div>
    </div>

    <!-- Output Format -->
    <div class="form-group">
      <label for="output-format">Output Format</label>
      <select id="output-format" v-model="outputFormat">
        <option v-for="format in outputFormats" :key="format" :value="format">
          {{ format }}
        </option>
      </select>
    </div>

    <!-- Examples -->
    <div class="form-group">
      <label>Examples</label>
      <button @click="addExample" class="btn-secondary">+ Add Example</button>

      <div v-if="examples.length > 0" class="examples-list">
        <div v-for="example in examples" :key="example.id" class="example-item">
          <textarea
            v-model="example.content"
            placeholder="Enter an example of the expected output..."
            rows="3"
          ></textarea>
          <button
            @click="removeExample(example.id)"
            class="remove-example"
            title="Remove example"
          >
            ×
          </button>
        </div>
      </div>
    </div>

        <!-- Actions -->
    <div class="form-actions">
      <button @click="clearForm" class="btn-secondary">Clear Form</button>
      <button 
        @click="downloadPrompt" 
        :disabled="!generatedPrompt"
        class="btn-primary"
      >
        Download XML
      </button>
    </div>

    <!-- Shortlink Section -->
    <ShortlinkButton :generated-prompt="generatedPrompt" />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { usePromptGenerator } from "../composables/usePromptGenerator";
import ShortlinkButton from "./ShortlinkButton.vue";

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["form-updated"]);

const {
  role,
  goal,
  constraints,
  outputFormat,
  examples,
  generatedPrompt,
  outputFormats,
  roleSuggestions,
  constraintSuggestions,
  addExample,
  removeExample,
  downloadPrompt,
  clearForm,
} = usePromptGenerator();

// Role suggestions
const showRoleSuggestions = ref(false);
const filteredRoleSuggestions = computed(() => {
  if (!role.value) return roleSuggestions;
  return roleSuggestions.filter((s) =>
    s.toLowerCase().includes(role.value.toLowerCase()),
  );
});

const handleRoleInput = () => {
  showRoleSuggestions.value = role.value.length > 0;
};

const selectRole = (selectedRole) => {
  role.value = selectedRole;
  showRoleSuggestions.value = false;
};

// Constraint suggestions
const addConstraint = (constraint) => {
  if (constraints.value) {
    constraints.value += "\n" + constraint;
  } else {
    constraints.value = constraint;
  }
};

// Handle initial data from import
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      role.value = newData.role || "";
      goal.value = newData.goal || "";
      constraints.value = newData.constraints || "";
      outputFormat.value = newData.outputFormat || "JSON";

      if (newData.examples && Array.isArray(newData.examples)) {
        examples.value = newData.examples.map((content, index) => ({
          id: Date.now() + index,
          content: content,
        }));
      }
    }
  },
  { immediate: true },
);

// Emit form updates
watch(
  [role, goal, constraints, outputFormat, examples],
  () => {
    emit("form-updated", {
      role: role.value,
      goal: goal.value,
      constraints: constraints.value,
      outputFormat: outputFormat.value,
      examples: examples.value,
    });
  },
  { deep: true },
);
</script>

<style scoped>
.suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.suggestion-item {
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  border-bottom: 1px solid #444;
}

.suggestion-item:hover {
  background: #3a3a3a;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.char-counter {
  text-align: right;
  font-size: 0.8rem;
  color: #888;
  margin-top: 0.25rem;
}

.constraint-suggestions {
  margin-top: 0.5rem;
}

.suggestion-label {
  font-size: 0.9rem;
  color: #888;
  margin-right: 0.5rem;
}

.suggestion-chip {
  background: #333;
  border: 1px solid #555;
  border-radius: 16px;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  margin: 0.25rem;
  cursor: pointer;
}

.suggestion-chip:hover {
  background: #444;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.form-group {
  position: relative;
}
</style>
