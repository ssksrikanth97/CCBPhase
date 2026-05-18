/**
 * EVA NLP Engine
 * Connects to open-source AI for natural language understanding
 * 
 * Primary: Hugging Face Inference API (free, no key for public models)
 * Fallback: Local keyword-based intent matching
 * 
 * To use a different AI provider, replace the `classifyWithAI` function:
 * - OpenAI: POST https://api.openai.com/v1/chat/completions
 * - Ollama (local): POST http://localhost:11434/api/generate
 * - LM Studio: POST http://localhost:1234/v1/chat/completions
 */

// Configuration — update these to switch AI providers
const AI_CONFIG = {
  // Hugging Face zero-shot classification (free, no API key needed)
  provider: 'huggingface',
  endpoint: 'https://api-inference.huggingface.co/models/facebook/bart-large-mnli',
  // Set your API key here if you have one (optional for public models)
  apiKey: '',
  // Fallback to local if AI is unavailable
  useFallback: true,
  // Timeout for API calls
  timeout: 5000,
};

// Intent labels for zero-shot classification
const INTENT_LABELS = [
  'create a product',
  'search for a product',
  'list all products',
  'create a bundle',
  'create a promotion',
  'search for a customer',
  'view customer details',
  'check customer balance',
  'search for a ticket',
  'create a support ticket',
  'check ticket status',
  'show revenue report',
  'show churn rate',
  'show subscriber count',
  'show growth forecast',
  'navigate to a page',
  'greeting',
  'ask for help',
  'system status overview',
];

// Map AI labels back to our intent IDs
const LABEL_TO_INTENT = {
  'create a product': 'catalogue.product.create',
  'search for a product': 'catalogue.product.search',
  'list all products': 'catalogue.product.list',
  'create a bundle': 'catalogue.bundle.create',
  'create a promotion': 'catalogue.promotion.create',
  'search for a customer': 'customer.search',
  'view customer details': 'customer.view',
  'check customer balance': 'customer.balance',
  'search for a ticket': 'support.ticket.search',
  'create a support ticket': 'support.ticket.create',
  'check ticket status': 'support.ticket.status',
  'show revenue report': 'analytics.revenue',
  'show churn rate': 'analytics.churn',
  'show subscriber count': 'analytics.subscribers',
  'show growth forecast': 'analytics.growth',
  'navigate to a page': 'navigate.dashboard',
  'greeting': 'general.greeting',
  'ask for help': 'general.help',
  'system status overview': 'general.status',
};

/**
 * Classify text using Hugging Face zero-shot classification
 * @param {string} text - User input
 * @returns {Promise<{label: string, score: number}|null>}
 */
const classifyWithAI = async (text) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.timeout);

    const headers = { 'Content-Type': 'application/json' };
    if (AI_CONFIG.apiKey) headers['Authorization'] = `Bearer ${AI_CONFIG.apiKey}`;

    const response = await fetch(AI_CONFIG.endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        inputs: text,
        parameters: { candidate_labels: INTENT_LABELS },
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) return null;

    const data = await response.json();

    // Hugging Face returns { labels: [...], scores: [...] }
    if (data.labels && data.scores && data.scores[0] > 0.3) {
      return { label: data.labels[0], score: data.scores[0] };
    }
    return null;
  } catch (e) {
    // API unavailable — will use fallback
    return null;
  }
};

/**
 * Enhanced local NLP with better fuzzy matching
 * Uses word similarity and partial matching
 */
const classifyLocally = async (text) => {
  const { recognizeIntent } = await import('./intents');
  const { conversationContext } = await import('./context');
  const contextSummary = conversationContext.getSummary();
  return recognizeIntent(text, contextSummary);
};

/**
 * Main NLP function — tries AI first, falls back to local
 * @param {string} text - User's natural language input
 * @returns {Promise<{intent: string, entities: object, confidence: number, source: string}>}
 */
export const understand = async (text) => {
  // Try AI classification first
  const aiResult = await classifyWithAI(text);

  if (aiResult && aiResult.score > 0.4) {
    const intent = LABEL_TO_INTENT[aiResult.label] || 'general.unknown';

    // Extract entities using local logic
    const { extractEntitiesFromText } = await import('./intents');
    const entities = extractEntitiesFromText ? extractEntitiesFromText(text, intent) : {};

    // Refine navigation intent based on text content
    let finalIntent = intent;
    if (intent === 'navigate.dashboard') {
      const nav = text.toLowerCase();
      if (nav.includes('product') || nav.includes('catalogue')) finalIntent = 'navigate.products';
      else if (nav.includes('bundle')) finalIntent = 'navigate.bundles';
      else if (nav.includes('promotion') || nav.includes('promo')) finalIntent = 'navigate.promotions';
      else if (nav.includes('customer')) finalIntent = 'navigate.customers';
      else if (nav.includes('ticket') || nav.includes('support')) finalIntent = 'navigate.tickets';
      else if (nav.includes('config') || nav.includes('setting')) finalIntent = 'navigate.configuration';
      else if (nav.includes('email')) finalIntent = 'navigate.email';
      else if (nav.includes('chat')) finalIntent = 'navigate.chat';
      else if (nav.includes('store')) finalIntent = 'navigate.store';
    }

    return { intent: finalIntent, entities, confidence: aiResult.score, source: 'ai' };
  }

  // Fallback to local matching
  const localResult = await classifyLocally(text);
  return { ...localResult, source: 'local' };
};
