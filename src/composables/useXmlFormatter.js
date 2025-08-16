import { ref, computed } from "vue";
import xml2js from "xml2js";
import prettier from "prettier";

// Create a singleton instance
let instance = null;

export function useXmlFormatter() {
  // Return existing instance if it exists
  if (instance) {
    return instance;
  }

  const isFormatting = ref(false);
  const formatError = ref(null);

  const formatXml = async (xmlString) => {
    isFormatting.value = true;
    formatError.value = null;

    try {
      // First parse and rebuild to ensure valid XML
      const parser = new xml2js.Parser();
      const builder = new xml2js.Builder({
        rootName: "xml",
        headless: true,
        renderOpts: { pretty: true, indent: "  " },
      });

      const parsed = await parser.parseStringPromise(xmlString);
      const rebuilt = builder.buildObject(parsed);

      // Then format with prettier for consistent styling
      const formatted = await prettier.format(rebuilt, {
        parser: "xml",
        printWidth: 80,
        tabWidth: 2,
        useTabs: false,
      });

      return formatted;
    } catch (error) {
      formatError.value = error.message;
      return xmlString; // Return original if formatting fails
    } finally {
      isFormatting.value = false;
    }
  };

  const parseXml = async (xmlString) => {
    try {
      const parser = new xml2js.Parser();
      return await parser.parseStringPromise(xmlString);
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  };

  const buildXml = (object) => {
    const builder = new xml2js.Builder({
      rootName: "xml",
      headless: true,
      renderOpts: { pretty: true, indent: "  " },
    });
    return builder.buildObject(object);
  };

  // Create the instance object
  instance = {
    formatXml,
    parseXml,
    buildXml,
    isFormatting: computed(() => isFormatting.value),
    formatError: computed(() => formatError.value),
  };

  return instance;
}
