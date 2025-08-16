import { ref, computed } from "vue";

// Create a singleton instance
let instance = null;

export function useXmlFormatter() {
  // Return existing instance if it exists
  if (instance) {
    return instance;
  }

  const isFormatting = ref(false);
  const formatError = ref(null);

  // Browser-compatible XML parser using DOMParser
  const parseXml = async (xmlString) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      
      // Check for parsing errors
      const parseError = xmlDoc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("XML parsing failed");
      }

      // Convert DOM to object structure
      const result = {};
      const xmlElement = xmlDoc.documentElement;
      
      for (const child of xmlElement.children) {
        const tagName = child.tagName;
        if (child.children.length === 0) {
          // Simple text content
          result[tagName] = [child.textContent];
        } else {
          // Complex content with children
          const children = [];
          for (const grandChild of child.children) {
            children.push(grandChild.textContent);
          }
          result[tagName] = children;
        }
      }

      return { xml: result };
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  };

  // Browser-compatible XML builder
  const buildXml = (object) => {
    try {
      const xmlDoc = document.implementation.createDocument(null, "xml", null);
      const root = xmlDoc.documentElement;

      for (const [key, value] of Object.entries(object)) {
        if (Array.isArray(value)) {
          if (key === 'examples' && value.length > 0) {
            // Handle examples array specially
            const examplesElement = xmlDoc.createElement('examples');
            value.forEach(example => {
              const exampleElement = xmlDoc.createElement('example');
              exampleElement.textContent = example;
              examplesElement.appendChild(exampleElement);
            });
            root.appendChild(examplesElement);
          } else {
            // Handle other arrays
            value.forEach(item => {
              const element = xmlDoc.createElement(key);
              element.textContent = item;
              root.appendChild(element);
            });
          }
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects (like examples with example property)
          const element = xmlDoc.createElement(key);
          for (const [subKey, subValue] of Object.entries(value)) {
            if (Array.isArray(subValue)) {
              subValue.forEach(item => {
                const subElement = xmlDoc.createElement(subKey);
                subElement.textContent = item;
                element.appendChild(subElement);
              });
            }
          }
          root.appendChild(element);
        } else {
          // Handle simple values
          const element = xmlDoc.createElement(key);
          element.textContent = value;
          root.appendChild(element);
        }
      }

      // Convert to string with formatting
      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(xmlDoc);
      
      // Format the XML with proper indentation
      return formatXmlString(xmlString);
    } catch (error) {
      throw new Error(`Failed to build XML: ${error.message}`);
    }
  };

  // Simple XML formatting function
  const formatXmlString = (xmlString) => {
    let formatted = '';
    let indent = '';
    const tab = '  ';
    
    xmlString.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) {
        // Closing tag
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) {
        // Opening tag
        indent += tab;
      }
    });
    
    return formatted.substring(1, formatted.length - 3);
  };

  const formatXml = async (xmlString) => {
    isFormatting.value = true;
    formatError.value = null;

    try {
      // Parse and rebuild to ensure valid XML
      const parsed = await parseXml(xmlString);
      const rebuilt = buildXml(parsed.xml);
      return rebuilt;
    } catch (error) {
      formatError.value = error.message;
      return xmlString; // Return original if formatting fails
    } finally {
      isFormatting.value = false;
    }
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
