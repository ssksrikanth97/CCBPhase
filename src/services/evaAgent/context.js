/**
 * EVA Context Manager
 * Maintains conversation context, remembers previous intents,
 * and enables multi-turn conversations
 */

const MAX_HISTORY = 10;

class ConversationContext {
  constructor() {
    this.history = [];
    this.currentIntent = null;
    this.currentEntities = {};
    this.pendingAction = null;
    this.lastModule = null;
    this.userPreferences = {};
    this.sessionData = {};
  }

  /**
   * Add a turn to conversation history
   */
  addTurn(userText, intent, entities, response) {
    this.history.push({
      timestamp: Date.now(),
      userText,
      intent,
      entities,
      response: response.speech,
      action: response.action,
    });
    if (this.history.length > MAX_HISTORY) {
      this.history.shift();
    }
    this.currentIntent = intent;
    this.currentEntities = { ...this.currentEntities, ...entities };
    this.lastModule = intent.split('.')[0];
  }

  /**
   * Get the last intent for context-aware follow-ups
   */
  getLastIntent() {
    return this.currentIntent;
  }

  /**
   * Get accumulated entities from conversation
   */
  getEntities() {
    return this.currentEntities;
  }

  /**
   * Get last module context (catalogue, customer, support, analytics)
   */
  getLastModule() {
    return this.lastModule;
  }

  /**
   * Check if user is in a multi-turn flow
   */
  hasPendingAction() {
    return this.pendingAction !== null;
  }

  /**
   * Set a pending action (e.g., waiting for confirmation)
   */
  setPendingAction(action) {
    this.pendingAction = action;
  }

  /**
   * Clear pending action
   */
  clearPendingAction() {
    this.pendingAction = null;
  }

  /**
   * Get pending action
   */
  getPendingAction() {
    return this.pendingAction;
  }

  /**
   * Store session data (e.g., last searched customer, last viewed product)
   */
  setSessionData(key, value) {
    this.sessionData[key] = value;
  }

  /**
   * Get session data
   */
  getSessionData(key) {
    return this.sessionData[key];
  }

  /**
   * Get conversation summary for context
   */
  getSummary() {
    return {
      turns: this.history.length,
      lastIntent: this.currentIntent,
      lastModule: this.lastModule,
      entities: this.currentEntities,
      pending: this.pendingAction,
    };
  }

  /**
   * Reset context
   */
  reset() {
    this.history = [];
    this.currentIntent = null;
    this.currentEntities = {};
    this.pendingAction = null;
    this.lastModule = null;
    this.sessionData = {};
  }
}

// Singleton instance
export const conversationContext = new ConversationContext();
