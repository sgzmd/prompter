import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ShortlinkGenerator } from '../src/utils/shortlinkGenerator.js'

// Mock pako
vi.mock('pako', () => ({
  default: {
    gzip: vi.fn((data) => new Uint8Array([1, 2, 3, 4])), // Mock compressed data
    ungzip: vi.fn((data) => new Uint8Array([116, 101, 115, 116])) // Mock decompressed "test"
  }
}))

// Mock browser APIs
global.btoa = vi.fn((str) => 'base64encoded');
global.atob = vi.fn((str) => 'decoded');
global.window = {
  location: {
    origin: 'https://example.com',
    pathname: '/',
    href: 'https://example.com/#prompt=test'
  }
};

global.URL = class URL {
  constructor(url) {
    this.href = url;
  }
  
  get hash() {
    return '#prompt=test';
  }
};

describe('ShortlinkGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should generate a shortlink from XML content', async () => {
    const xmlContent = '<xml><role>Test</role></xml>';
    const shortlink = await ShortlinkGenerator.generateShortlink(xmlContent);
    
    expect(shortlink).toContain('https://example.com/#prompt=');
    expect(btoa).toHaveBeenCalled();
  });

  it('should parse a shortlink and extract XML content', async () => {
    const shortlink = 'https://example.com/#prompt=test';
    const xmlContent = await ShortlinkGenerator.parseShortlink(shortlink);
    
    expect(xmlContent).toBeDefined();
    expect(atob).toHaveBeenCalled();
  });

  it('should detect if URL contains a shortlink', () => {
    const hasShortlink = ShortlinkGenerator.hasShortlink();
    expect(hasShortlink).toBe(true);
  });

  it('should get current shortlink from URL', () => {
    const currentShortlink = ShortlinkGenerator.getCurrentShortlink();
    expect(currentShortlink).toBe('https://example.com/#prompt=test');
  });

  it('should provide security warning', () => {
    const warning = ShortlinkGenerator.getSecurityWarning();
    expect(warning).toContain('Security Notice');
    expect(warning).toContain('data is visible in the URL');
  });

  it('should handle missing prompt data in URL', async () => {
    global.URL = class URL {
      constructor(url) {
        this.href = url;
      }
      
      get hash() {
        return '#other=test';
      }
    };

    await expect(ShortlinkGenerator.parseShortlink('https://example.com/#other=test'))
      .rejects.toThrow('No prompt data found in URL');
  });

  it('should compress data with pako fallback', async () => {
    const data = 'test data';
    const compressed = await ShortlinkGenerator.compressData(data);
    
    expect(compressed).toBeInstanceOf(Uint8Array);
  });

  it('should decompress data with pako fallback', async () => {
    const compressedData = new Uint8Array([1, 2, 3, 4]);
    const decompressed = await ShortlinkGenerator.decompressData(compressedData);
    
    expect(decompressed).toBeDefined();
  });
}) 