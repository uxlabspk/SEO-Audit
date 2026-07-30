/**
 * Pluggable LLM provider for AI report generation.
 *
 * Set LLM_PROVIDER in .env to switch backends without touching any other
 * code:
 *   LLM_PROVIDER=lmstudio   (default, for local dev -- talks to LM Studio's
 *                            local OpenAI-compatible server)
 *   LLM_PROVIDER=anthropic  (Claude API, for production)
 *   LLM_PROVIDER=openai     (OpenAI API, for production)
 *
 * Each provider exposes the same streamCompletion() shape so the caller
 * (generateReport) never needs to know which backend is active.
 */

export interface StreamChunk {
  text: string;
}

export interface LlmProvider {
  name: string;
  streamCompletion(
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk>;
}

// ---------------------------------------------------------------------------
// LM Studio (local, OpenAI-compatible /v1/chat/completions endpoint)
// ---------------------------------------------------------------------------
class LmStudioProvider implements LlmProvider {
  name = "lmstudio";
  private baseUrl: string;
  private model: string;

  constructor() {
    this.baseUrl =
      process.env.LM_STUDIO_URL || "http://localhost:1234/v1/chat/completions";
    this.model = process.env.LM_STUDIO_MODEL || "local-model";
  }

  async *streamCompletion(
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk> {
    const resp = await fetch(this.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: -1,
        stream: true,
      }),
    });

    if (!resp.ok || !resp.body) {
      throw new Error(
        `Could not connect to LM Studio at ${this.baseUrl}. Make sure LM Studio's local server is running (Developer tab -> Start Server).`
      );
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;
        const dataStr = line.slice(6).trim();
        if (dataStr === "[DONE]") return;
        try {
          const chunk = JSON.parse(dataStr);
          const delta = chunk?.choices?.[0]?.delta?.content;
          if (delta) yield { text: delta };
        } catch {
          continue;
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Anthropic (Claude API) -- swap in for production
// ---------------------------------------------------------------------------
class AnthropicProvider implements LlmProvider {
  name = "anthropic";
  private apiKey: string;
  private model: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY || "";
    this.model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
    if (!this.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is not set");
    }
  }

  async *streamCompletion(
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk> {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
        stream: true,
      }),
    });

    if (!resp.ok || !resp.body) {
      const text = await resp.text().catch(() => "");
      throw new Error(`Anthropic API error: ${resp.status} ${text}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const dataStr = line.slice(6).trim();
        if (!dataStr) continue;
        try {
          const event = JSON.parse(dataStr);
          if (
            event.type === "content_block_delta" &&
            event.delta?.type === "text_delta"
          ) {
            yield { text: event.delta.text };
          }
        } catch {
          continue;
        }
      }
    }
  }
}

// ---------------------------------------------------------------------------
// OpenAI-compatible base (shared SSE parsing for OpenAI, Mistral, etc.)
// ---------------------------------------------------------------------------
class OpenAiCompatibleProvider implements LlmProvider {
  name: string;
  protected apiKey: string;
  protected model: string;
  protected baseUrl: string;

  constructor(name: string, apiKeyEnv: string, modelEnv: string, defaultModel: string, defaultBaseUrl: string) {
    this.name = name;
    this.apiKey = process.env[apiKeyEnv] || "";
    this.model = process.env[modelEnv] || defaultModel;
    this.baseUrl = process.env[`${name.toUpperCase()}_BASE_URL`] || defaultBaseUrl;
    if (!this.apiKey) {
      throw new Error(`${apiKeyEnv} is not set`);
    }
  }

  async *streamCompletion(
    systemPrompt: string,
    userPrompt: string
  ): AsyncGenerator<StreamChunk> {
    const resp = await fetch(this.baseUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        stream: true,
      }),
    });

    if (!resp.ok || !resp.body) {
      const text = await resp.text().catch(() => "");
      throw new Error(`${this.name} API error: ${resp.status} ${text}`);
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim() || !line.startsWith("data: ")) continue;
        const dataStr = line.slice(6).trim();
        if (dataStr === "[DONE]") return;
        try {
          const chunk = JSON.parse(dataStr);
          const delta = chunk?.choices?.[0]?.delta?.content;
          if (delta) yield { text: delta };
        } catch {
          continue;
        }
      }
    }
  }
}

class OpenAiProvider extends OpenAiCompatibleProvider {
  constructor() {
    super("openai", "OPENAI_API_KEY", "OPENAI_MODEL", "gpt-4o", "https://api.openai.com/v1/chat/completions");
  }
}

class MistralProvider extends OpenAiCompatibleProvider {
  constructor() {
    super("mistral", "MISTRAL_API_KEY", "MISTRAL_MODEL", "mistral-large-latest", "https://api.mistral.ai/v1/chat/completions");
  }
}

export function getLlmProvider(): LlmProvider {
  const providerName = process.env.LLM_PROVIDER || "lmstudio";

  switch (providerName) {
    case "anthropic":
      return new AnthropicProvider();
    case "openai":
      return new OpenAiProvider();
    case "mistral":
      return new MistralProvider();
    case "lmstudio":
    default:
      return new LmStudioProvider();
  }
}
