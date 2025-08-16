import { useXmlFormatter } from "../composables/useXmlFormatter";

// Create a singleton instance
let instance = null;

export function usePromptParser() {
  // Return existing instance if it exists
  if (instance) {
    return instance;
  }

  const { parseXml } = useXmlFormatter();

  const parsePrompt = async (xmlString) => {
    try {
      const parsed = await parseXml(xmlString);

      // Extract components from parsed XML
      const components = {
        role: parsed.xml?.role?.[0] || "",
        goal: parsed.xml?.goal?.[0] || "",
        constraints: parsed.xml?.constraints?.[0] || "",
        outputFormat: parsed.xml?.outputFormat?.[0] || "JSON",
        examples: parsed.xml?.examples?.[0]?.example || [],
      };

      return {
        success: true,
        components,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        components: null,
      };
    }
  };

  // Create the instance object
  instance = {
    parsePrompt,
  };

  return instance;
}
