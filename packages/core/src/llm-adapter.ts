/**
 * LLM Adapter interface — bring your own AI provider.
 */

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmAdapter {
  /** Human-readable name (e.g. "openai", "claude", "ollama") */
  name: string;

  /** Send messages and get a string response */
  complete(messages: LlmMessage[]): Promise<string>;
}

/**
 * Built-in adapter for OpenAI-compatible APIs (OpenAI, Together, Groq, local).
 */
export function createOpenAIAdapter(options: {
  apiKey: string;
  baseUrl?: string;
  model?: string;
}): LlmAdapter {
  const { apiKey, baseUrl = 'https://api.openai.com/v1', model = 'gpt-4o-mini' } = options;

  return {
    name: 'openai',
    async complete(messages: LlmMessage[]): Promise<string> {
      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, messages, temperature: 0.7 }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`LLM request failed (${res.status}): ${text}`);
      }

      const data = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      return data.choices[0].message.content;
    },
  };
}
