import type { LlmAdapter } from '@landing-builder/core';
import { samplePages } from './sample-pages';

/**
 * Mock LLM adapter — returns a sample page based on keywords in the prompt.
 * No API key needed for the demo.
 */
export const mockAdapter: LlmAdapter = {
  name: 'mock',
  async complete(messages) {
    const prompt = messages[messages.length - 1]?.content.toLowerCase() ?? '';

    // Simulate thinking delay
    await new Promise((r) => setTimeout(r, 1500));

    // Pick best match based on keywords
    if (prompt.includes('restaurant') || prompt.includes('food') || prompt.includes('menu')) {
      return JSON.stringify(samplePages.restaurant);
    }
    if (prompt.includes('yoga') || prompt.includes('fitness') || prompt.includes('gym') || prompt.includes('studio')) {
      return JSON.stringify(samplePages.yoga);
    }
    if (prompt.includes('portfolio') || prompt.includes('personal') || prompt.includes('designer')) {
      return JSON.stringify(samplePages.portfolio);
    }
    // Default: SaaS
    return JSON.stringify(samplePages.saas);
  },
};
