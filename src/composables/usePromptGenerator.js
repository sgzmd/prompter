import { ref, computed, watch } from "vue";
import { useXmlFormatter } from "./useXmlFormatter";

// Create a singleton instance
let instance = null;

export function usePromptGenerator() {
  // Return existing instance if it exists
  if (instance) {
    return instance;
  }

  const { buildXml, formatXml } = useXmlFormatter();

  // Form data
  const role = ref("");
  const goal = ref("");
  const constraints = ref("");
  const outputFormat = ref("JSON");
  const examples = ref([]);

  // Generated prompt
  const generatedPrompt = ref("");
  const isGenerating = ref(false);

  // Output format options
  const outputFormats = ["JSON", "XML", "HTML", "Markdown", "Custom"];

  // Common role suggestions
  const roleSuggestions = [
    "Expert Software Engineer",
    "Data Scientist",
    "Content Writer",
    "Marketing Specialist",
    "UX Designer",
    "Project Manager",
    "Technical Writer",
    "Business Analyst",
  ];

  // Common constraint suggestions
  const constraintSuggestions = [
    "Use only plain English",
    "Assume reader is moderately literate",
    "Output in JSON format",
    "Keep response under 500 words",
    "Include code examples",
    "Use bullet points for clarity",
    "Provide step-by-step instructions",
  ];

  // Add example
  const addExample = () => {
    examples.value.push({
      id: Date.now(),
      content: "",
    });
  };

  // Remove example
  const removeExample = (id) => {
    const index = examples.value.findIndex((ex) => ex.id === id);
    if (index > -1) {
      examples.value.splice(index, 1);
    }
  };

  // Update example content
  const updateExample = (id, content) => {
    const example = examples.value.find((ex) => ex.id === id);
    if (example) {
      example.content = content;
    }
  };

  // Generate XML prompt
  const generatePrompt = async () => {
    isGenerating.value = true;

    try {
      const promptData = {
        role: role.value,
        goal: goal.value,
        constraints: constraints.value,
        outputFormat: outputFormat.value,
        examples: {
          example: examples.value
            .filter((ex) => ex.content.trim())
            .map((ex) => ex.content),
        },
      };

      const xmlString = buildXml(promptData);
      const formatted = await formatXml(xmlString);
      generatedPrompt.value = formatted;
    } catch (error) {
      generatedPrompt.value = "Error generating prompt";
    } finally {
      isGenerating.value = false;
    }
  };

  // Auto-generate on form changes
  watch(
    [role, goal, constraints, outputFormat, examples],
    () => {
      if (role.value || goal.value) {
        generatePrompt();
      }
    },
    { deep: true },
  );

  // Download prompt
  const downloadPrompt = () => {
    if (!generatedPrompt.value) return;

    const blob = new Blob([generatedPrompt.value], { type: "application/xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "prompt.xml";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Clear form
  const clearForm = () => {
    role.value = "";
    goal.value = "";
    constraints.value = "";
    outputFormat.value = "JSON";
    examples.value = [];
    generatedPrompt.value = "";
  };

  // Reset instance (for testing)
  const resetInstance = () => {
    instance = null;
  };

  // Create the instance object
  instance = {
    // Form data
    role,
    goal,
    constraints,
    outputFormat,
    examples,

    // Generated content
    generatedPrompt: computed(() => generatedPrompt.value),
    isGenerating: computed(() => isGenerating.value),

    // Options
    outputFormats,
    roleSuggestions,
    constraintSuggestions,

    // Methods
    addExample,
    removeExample,
    updateExample,
    generatePrompt,
    downloadPrompt,
    clearForm,
    resetInstance,
  };

  return instance;
}
