import pako from 'pako';

// Utility for generating and parsing shortlinks
export class ShortlinkGenerator {
  // Generate a shortlink from XML content
  static async generateShortlink(xmlContent) {
    try {
      // Compress the XML content
      const compressed = await this.compressData(xmlContent);
      
      // Base64 encode the compressed data
      const encoded = btoa(String.fromCharCode(...compressed));
      
      // Create the shortlink URL
      const baseUrl = window.location.origin + window.location.pathname;
      const shortlink = `${baseUrl}#prompt=${encoded}`;
      
      return shortlink;
    } catch (error) {
      console.error('Error generating shortlink:', error);
      throw new Error('Failed to generate shortlink');
    }
  }

  // Parse a shortlink and extract XML content
  static async parseShortlink(shortlink) {
    try {
      // Extract the encoded data from the URL
      const url = new URL(shortlink);
      const encodedData = url.hash.replace('#prompt=', '');
      
      if (!encodedData) {
        throw new Error('No prompt data found in URL');
      }

      // Base64 decode the data
      const compressed = new Uint8Array(
        atob(encodedData).split('').map(char => char.charCodeAt(0))
      );
      
      // Decompress the data
      const xmlContent = await this.decompressData(compressed);
      
      return xmlContent;
    } catch (error) {
      console.error('Error parsing shortlink:', error);
      throw new Error('Failed to parse shortlink');
    }
  }

  // Compress data with fallback to pako
  static async compressData(data) {
    try {
      // Try Compression Streams API first (modern browsers)
      if (typeof CompressionStream !== 'undefined') {
        return await this.compressWithStreams(data);
      } else {
        // Fallback to pako
        return this.compressWithPako(data);
      }
    } catch (error) {
      // Fallback to pako if streams fail
      return this.compressWithPako(data);
    }
  }

  // Decompress data with fallback to pako
  static async decompressData(compressedData) {
    try {
      // Try Decompression Streams API first (modern browsers)
      if (typeof DecompressionStream !== 'undefined') {
        return await this.decompressWithStreams(compressedData);
      } else {
        // Fallback to pako
        return this.decompressWithPako(compressedData);
      }
    } catch (error) {
      // Fallback to pako if streams fail
      return this.decompressWithPako(compressedData);
    }
  }

  // Compress using Compression Streams API
  static async compressWithStreams(data) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    
    const cs = new CompressionStream('gzip');
    const writer = cs.writable.getWriter();
    const reader = cs.readable.getReader();
    
    writer.write(encoded);
    writer.close();
    
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Combine all chunks
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    return result;
  }

  // Decompress using Decompression Streams API
  static async decompressWithStreams(compressedData) {
    const ds = new DecompressionStream('gzip');
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    
    writer.write(compressedData);
    writer.close();
    
    const chunks = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    // Combine all chunks and decode
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const result = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      result.set(chunk, offset);
      offset += chunk.length;
    }
    
    const decoder = new TextDecoder();
    return decoder.decode(result);
  }

  // Compress using pako
  static compressWithPako(data) {
    const encoder = new TextEncoder();
    const encoded = encoder.encode(data);
    return pako.gzip(encoded);
  }

  // Decompress using pako
  static decompressWithPako(compressedData) {
    const decompressed = pako.ungzip(compressedData);
    const decoder = new TextDecoder();
    return decoder.decode(decompressed);
  }

  // Check if the current URL contains a shortlink
  static hasShortlink() {
    return window.location.hash.includes('prompt=');
  }

  // Extract shortlink from current URL
  static getCurrentShortlink() {
    if (this.hasShortlink()) {
      return window.location.href;
    }
    return null;
  }

  // Copy shortlink to clipboard
  static async copyToClipboard(shortlink) {
    try {
      await navigator.clipboard.writeText(shortlink);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shortlink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  }

  // Security warning message
  static getSecurityWarning() {
    return "⚠️ Security Notice: This shortlink contains your prompt data encoded in the URL. While convenient for sharing, be aware that:\n\n" +
           "• The data is visible in the URL\n" +
           "• It may be logged by browsers, servers, and proxies\n" +
           "• Don't share sensitive information via shortlinks\n" +
           "• Consider using the download feature for private prompts";
  }
} 