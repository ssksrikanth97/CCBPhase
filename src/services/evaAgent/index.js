/**
 * EVA Agent — Main entry point
 * Orchestrates NLP understanding, module processing, and speech I/O
 */

export { recognizeIntent, INTENTS } from './intents';
export { processIntent } from './modules';
export { speak, stopSpeaking, startListening } from './speechService';
export { conversationContext } from './context';
export { skillsManager, SKILLS } from './skills';
export { understand } from './nlpEngine';

/**
 * Full pipeline: text → NLP (AI + fallback) → skill check → module → response
 * @param {string} text - User's natural language input
 * @returns {Promise<{ speech: string, action: string, target?: string, data?: any, intent: string }>}
 */
export const processQuery = async (text) => {
  const { understand } = await import('./nlpEngine');
  const { processIntent } = await import('./modules');
  const { skillsManager } = await import('./skills');

  // Use AI-powered NLP to understand the text
  const { intent, entities } = await understand(text);

  // Check if the skill is enabled
  if (!skillsManager.canHandle(intent)) {
    const module = intent.split('.')[0];
    const { conversationContext } = await import('./context');
    const response = { speech: `The ${module} skill is not enabled. Please enable it from the skills panel to use this feature.`, action: 'none' };
    conversationContext.addTurn(text, intent, entities, response);
    return { ...response, intent };
  }

  const response = await processIntent(intent, entities, text);
  return { ...response, intent };
};
