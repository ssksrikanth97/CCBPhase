/**
 * EVA Intent Recognition Engine
 * Maps natural language to intents and extracts entities
 * Replace with NLP API (e.g., Dialogflow, Rasa, AWS Lex) for production
 */

export const INTENTS = {
  // Catalogue
  CREATE_PRODUCT: 'catalogue.product.create',
  SEARCH_PRODUCT: 'catalogue.product.search',
  LIST_PRODUCTS: 'catalogue.product.list',
  EDIT_PRODUCT: 'catalogue.product.edit',
  CREATE_BUNDLE: 'catalogue.bundle.create',
  LIST_BUNDLES: 'catalogue.bundle.list',
  CREATE_PROMOTION: 'catalogue.promotion.create',
  LIST_PROMOTIONS: 'catalogue.promotion.list',

  // Customer
  SEARCH_CUSTOMER: 'customer.search',
  VIEW_CUSTOMER: 'customer.view',
  CUSTOMER_BALANCE: 'customer.balance',
  CUSTOMER_SUBSCRIPTIONS: 'customer.subscriptions',
  CUSTOMER_TICKETS: 'customer.tickets',

  // Support
  SEARCH_TICKET: 'support.ticket.search',
  CREATE_TICKET: 'support.ticket.create',
  TICKET_STATUS: 'support.ticket.status',
  ASSIGN_TICKET: 'support.ticket.assign',
  ESCALATE_TICKET: 'support.ticket.escalate',

  // Analytics
  REVENUE_REPORT: 'analytics.revenue',
  CHURN_REPORT: 'analytics.churn',
  SUBSCRIBER_REPORT: 'analytics.subscribers',
  GROWTH_REPORT: 'analytics.growth',
  COMPARE_REPORT: 'analytics.compare',

  // Navigation
  NAV_DASHBOARD: 'navigate.dashboard',
  NAV_PRODUCTS: 'navigate.products',
  NAV_BUNDLES: 'navigate.bundles',
  NAV_PROMOTIONS: 'navigate.promotions',
  NAV_CUSTOMERS: 'navigate.customers',
  NAV_TICKETS: 'navigate.tickets',
  NAV_CONFIGURATION: 'navigate.configuration',
  NAV_EXPLORE: 'navigate.explore',
  NAV_EMAIL: 'navigate.email',
  NAV_CHAT: 'navigate.chat',
  NAV_STORE: 'navigate.store',

  // Contextual follow-ups
  CONFIRM_YES: 'context.confirm.yes',
  CONFIRM_NO: 'context.confirm.no',
  SHOW_MORE: 'context.show_more',
  GO_BACK: 'context.go_back',

  // Skills management
  ENABLE_SKILL: 'general.skill.enable',
  DISABLE_SKILL: 'general.skill.disable',
  LIST_SKILLS: 'general.skill.list',

  // Product details
  VIEW_PRODUCT: 'catalogue.product.view',

  // General
  GREETING: 'general.greeting',
  HELP: 'general.help',
  STATUS: 'general.status',
  UNKNOWN: 'general.unknown',
};

// Intent patterns — keyword-based matching (replace with ML model in production)
const intentPatterns = [
  // Catalogue - Products
  { intent: INTENTS.CREATE_PRODUCT, patterns: ['create product', 'new product', 'add product', 'make a product', 'build product', 'add a new product'] },
  { intent: INTENTS.SEARCH_PRODUCT, patterns: ['find product', 'search product', 'look up product', 'which product', 'product named'] },
  { intent: INTENTS.LIST_PRODUCTS, patterns: ['list products', 'all products', 'show products', 'product catalogue', 'product catalog', 'how many products'] },
  { intent: INTENTS.EDIT_PRODUCT, patterns: ['edit product', 'update product', 'modify product', 'change product'] },

  // Catalogue - Bundles
  { intent: INTENTS.CREATE_BUNDLE, patterns: ['create bundle', 'new bundle', 'add bundle', 'make bundle', 'build a bundle'] },
  { intent: INTENTS.LIST_BUNDLES, patterns: ['list bundles', 'show bundles', 'all bundles', 'bundle catalogue'] },

  // Catalogue - Promotions
  { intent: INTENTS.CREATE_PROMOTION, patterns: ['create promotion', 'new promo', 'add promotion', 'create promo', 'new promotion', 'launch campaign'] },
  { intent: INTENTS.LIST_PROMOTIONS, patterns: ['list promotions', 'show promotions', 'all promotions', 'active promos'] },

  // Customer
  { intent: INTENTS.SEARCH_CUSTOMER, patterns: ['find customer', 'search customer', 'look up customer', 'customer named', 'who is customer'] },
  { intent: INTENTS.VIEW_CUSTOMER, patterns: ['view customer', 'open customer', 'customer details', 'customer 360', 'show customer profile'] },
  { intent: INTENTS.CUSTOMER_BALANCE, patterns: ['customer balance', 'how much does', 'outstanding balance', 'payment due', 'amount owed'] },
  { intent: INTENTS.CUSTOMER_SUBSCRIPTIONS, patterns: ['customer subscription', 'what plan', 'active plan', 'subscribed to', 'customer plan'] },
  { intent: INTENTS.CUSTOMER_TICKETS, patterns: ['customer ticket', 'customer issue', 'customer complaint', 'their tickets'] },

  // Support
  { intent: INTENTS.SEARCH_TICKET, patterns: ['find ticket', 'search ticket', 'look up ticket', 'ticket number', 'ticket id', 'ticket rvt'] },
  { intent: INTENTS.CREATE_TICKET, patterns: ['create ticket', 'new ticket', 'raise ticket', 'open ticket', 'log ticket', 'report issue'] },
  { intent: INTENTS.TICKET_STATUS, patterns: ['ticket status', 'how many tickets', 'open tickets', 'pending tickets', 'ticket count', 'ticket summary'] },
  { intent: INTENTS.ASSIGN_TICKET, patterns: ['assign ticket', 'reassign ticket', 'transfer ticket', 'give ticket to'] },
  { intent: INTENTS.ESCALATE_TICKET, patterns: ['escalate ticket', 'escalate issue', 'priority upgrade', 'make urgent', 'mark critical'] },

  // Analytics
  { intent: INTENTS.REVENUE_REPORT, patterns: ['revenue', 'earnings', 'income', 'how much money', 'total revenue', 'mrr', 'monthly revenue'] },
  { intent: INTENTS.CHURN_REPORT, patterns: ['churn', 'churn rate', 'customer loss', 'attrition', 'losing customers'] },
  { intent: INTENTS.SUBSCRIBER_REPORT, patterns: ['subscribers', 'how many users', 'total users', 'customer count', 'user base', 'subscriber count'] },
  { intent: INTENTS.GROWTH_REPORT, patterns: ['growth', 'growing', 'trend', 'forecast', 'prediction', 'next quarter'] },
  { intent: INTENTS.COMPARE_REPORT, patterns: ['compare', 'versus', 'vs', 'difference between', 'month over month'] },

  // Navigation - specific pages
  { intent: INTENTS.NAV_DASHBOARD, patterns: ['go to dashboard', 'open dashboard', 'show dashboard', 'take me to dashboard', 'switch to dashboard'] },
  { intent: INTENTS.NAV_PRODUCTS, patterns: ['go to products', 'open products', 'open catalogue', 'show catalogue', 'take me to products', 'product page'] },
  { intent: INTENTS.NAV_BUNDLES, patterns: ['go to bundles', 'open bundles', 'show bundles page', 'take me to bundles', 'bundle page'] },
  { intent: INTENTS.NAV_PROMOTIONS, patterns: ['go to promotions', 'open promotions', 'show promos', 'take me to promotions', 'promo page'] },
  { intent: INTENTS.NAV_CUSTOMERS, patterns: ['go to customers', 'open customers', 'show customers', 'take me to customers', 'customer page', 'customer list'] },
  { intent: INTENTS.NAV_TICKETS, patterns: ['go to tickets', 'open tickets', 'show tickets', 'take me to tickets', 'ticket page', 'support page'] },
  { intent: INTENTS.NAV_CONFIGURATION, patterns: ['go to configuration', 'open settings', 'show settings', 'take me to config', 'configuration page', 'theme settings'] },
  { intent: INTENTS.NAV_EXPLORE, patterns: ['go to explore', 'back to explore', 'go home', 'main page'] },
  { intent: INTENTS.NAV_EMAIL, patterns: ['go to email', 'open email', 'email inbox', 'show emails', 'check email'] },
  { intent: INTENTS.NAV_CHAT, patterns: ['go to chat', 'open chat', 'support chat', 'live chat'] },
  { intent: INTENTS.NAV_STORE, patterns: ['go to store', 'open store', 'online store', 'store page'] },

  // Contextual
  { intent: INTENTS.CONFIRM_YES, patterns: ['yes', 'yeah', 'sure', 'okay', 'ok', 'do it', 'go ahead', 'confirm', 'please', 'yep'] },
  { intent: INTENTS.CONFIRM_NO, patterns: ['no', 'nope', 'cancel', 'never mind', 'forget it', 'stop', 'don\'t'] },
  { intent: INTENTS.SHOW_MORE, patterns: ['show more', 'more details', 'tell me more', 'elaborate', 'expand', 'what else'] },
  { intent: INTENTS.GO_BACK, patterns: ['go back', 'previous', 'back', 'return', 'undo'] },

  // Skills management
  { intent: INTENTS.ENABLE_SKILL, patterns: ['enable skill', 'enable module', 'connect skill', 'activate skill', 'turn on skill', 'enable catalogue', 'enable customers', 'enable support', 'enable analytics', 'enable store', 'connect catalogue', 'connect customers', 'connect support', 'connect analytics'] },
  { intent: INTENTS.DISABLE_SKILL, patterns: ['disable skill', 'disable module', 'disconnect skill', 'deactivate skill', 'turn off skill', 'disable catalogue', 'disable customers', 'disable support', 'disable analytics', 'disable store', 'disconnect catalogue', 'disconnect customers', 'disconnect support'] },
  { intent: INTENTS.LIST_SKILLS, patterns: ['list skills', 'show skills', 'which skills', 'what skills', 'connected skills', 'active skills', 'my skills'] },

  // Product details
  { intent: INTENTS.VIEW_PRODUCT, patterns: ['view product', 'product details', 'show product details', 'open product', 'product info', 'details of product', 'tell me about product'] },

  // General
  { intent: INTENTS.GREETING, patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'howdy'] },
  { intent: INTENTS.HELP, patterns: ['help', 'what can you do', 'capabilities', 'commands', 'options', 'how do i'] },
  { intent: INTENTS.STATUS, patterns: ['system status', 'how is everything', 'overview', 'summary', 'what\'s happening', 'brief me'] },
];

/**
 * Recognize intent from natural language input
 * Uses conversation context for follow-up handling
 * @param {string} text - User's spoken/typed text
 * @param {object} context - Conversation context summary
 * @returns {{ intent: string, entities: object, confidence: number }}
 */
export const recognizeIntent = (text, context = {}) => {
  const normalized = text.toLowerCase().trim();

  // Handle contextual follow-ups first
  if (context.pending) {
    if (normalized.match(/^(yes|yeah|sure|okay|ok|do it|go ahead|confirm|please|yep)$/)) {
      return { intent: INTENTS.CONFIRM_YES, entities: {}, confidence: 0.95 };
    }
    if (normalized.match(/^(no|nope|cancel|never mind|forget it|stop|don't)$/)) {
      return { intent: INTENTS.CONFIRM_NO, entities: {}, confidence: 0.95 };
    }
  }

  // Context-aware: "show more" about last topic
  if (normalized.match(/^(show more|more details|tell me more|elaborate|what else)$/) && context.lastIntent) {
    return { intent: INTENTS.SHOW_MORE, entities: { previousIntent: context.lastIntent }, confidence: 0.9 };
  }

  // Standard pattern matching — fuzzy: check if any words from pattern appear in text
  for (const { intent, patterns } of intentPatterns) {
    for (const pattern of patterns) {
      if (normalized.includes(pattern)) {
        return {
          intent,
          entities: extractEntities(normalized, intent),
          confidence: 0.9,
        };
      }
    }
  }

  // Fuzzy fallback — check individual key words
  if (normalized.match(/product|catalog|catalogue/)) return { intent: INTENTS.SEARCH_PRODUCT, entities: extractEntities(normalized, INTENTS.SEARCH_PRODUCT), confidence: 0.7 };
  if (normalized.match(/bundle/)) return { intent: INTENTS.LIST_BUNDLES, entities: extractEntities(normalized, INTENTS.LIST_BUNDLES), confidence: 0.7 };
  if (normalized.match(/promo|promotion|campaign/)) return { intent: INTENTS.LIST_PROMOTIONS, entities: extractEntities(normalized, INTENTS.LIST_PROMOTIONS), confidence: 0.7 };
  if (normalized.match(/customer|subscriber|user/)) return { intent: INTENTS.SEARCH_CUSTOMER, entities: extractEntities(normalized, INTENTS.SEARCH_CUSTOMER), confidence: 0.7 };
  if (normalized.match(/ticket|issue|support|complaint/)) return { intent: INTENTS.TICKET_STATUS, entities: extractEntities(normalized, INTENTS.TICKET_STATUS), confidence: 0.7 };
  if (normalized.match(/revenue|money|earning|income/)) return { intent: INTENTS.REVENUE_REPORT, entities: extractEntities(normalized, INTENTS.REVENUE_REPORT), confidence: 0.7 };
  if (normalized.match(/dashboard/)) return { intent: INTENTS.NAV_DASHBOARD, entities: {}, confidence: 0.7 };

  return { intent: INTENTS.UNKNOWN, entities: {}, confidence: 0.3 };
};

/**
 * Extract entities from text based on intent
 */
/**
 * Extract entities from text based on intent (exported for NLP engine)
 */
export const extractEntitiesFromText = (text, intent) => extractEntities(text.toLowerCase(), intent);

const extractEntities = (text, intent) => {
  const entities = {};

  // Extract names (after "named", "called", "for")
  const nameMatch = text.match(/(?:named|called|for|about)\s+([a-z]+(?:\s+[a-z]+)?)/i);
  if (nameMatch) entities.name = nameMatch[1];

  // Extract IDs (patterns like #XXX, RVT123, CUS-001)
  const idMatch = text.match(/(#?\w{2,4}[-]?\d{2,6})/i);
  if (idMatch) entities.id = idMatch[1];

  // Extract amounts
  const amountMatch = text.match(/\$?([\d,]+(?:\.\d{2})?)/);
  if (amountMatch) entities.amount = amountMatch[1];

  // Navigation targets
  if (intent.startsWith('navigate.')) {
    // Target is encoded in the intent itself
    entities.target = intent;
  }

  return entities;
};
