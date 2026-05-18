/**
 * EVA Skills Manager
 * Each skill represents a connected module/capability
 * Skills must be enabled before EVA can use them
 */

export const SKILLS = {
  CATALOGUE: { id: 'catalogue', name: 'Catalogue', desc: 'Products, Bundles, Promotions', icon: '◫' },
  CUSTOMERS: { id: 'customers', name: 'Customers', desc: 'Search, 360 View, Balance', icon: '⊙' },
  SUPPORT: { id: 'support', name: 'Support', desc: 'Tickets, Escalation, Chat', icon: '⊟' },
  ANALYTICS: { id: 'analytics', name: 'Analytics', desc: 'Revenue, Churn, Growth', icon: '◎' },
  STORE: { id: 'store', name: 'Online Store', desc: 'Preferences, Pages, Theme', icon: '◈' },
};

class SkillsManager {
  constructor() {
    const saved = localStorage.getItem('eva_skills');
    if (saved) {
      const parsed = JSON.parse(saved);
      // If saved but empty, re-initialize with all enabled
      if (Object.keys(parsed).length > 0) {
        this.enabled = parsed;
      } else {
        this.enabled = {};
        Object.values(SKILLS).forEach(s => { this.enabled[s.id] = true; });
        this._persist();
      }
    } else {
      // First use — enable all skills by default
      this.enabled = {};
      Object.values(SKILLS).forEach(s => { this.enabled[s.id] = true; });
      this._persist();
    }
  }

  enable(skillId) {
    this.enabled[skillId] = true;
    this._persist();
  }

  disable(skillId) {
    delete this.enabled[skillId];
    this._persist();
  }

  toggle(skillId) {
    if (this.enabled[skillId]) this.disable(skillId);
    else this.enable(skillId);
  }

  isEnabled(skillId) {
    return !!this.enabled[skillId];
  }

  enableAll() {
    Object.values(SKILLS).forEach(s => { this.enabled[s.id] = true; });
    this._persist();
  }

  getEnabled() {
    return Object.values(SKILLS).filter(s => this.enabled[s.id]);
  }

  getAll() {
    return Object.values(SKILLS).map(s => ({ ...s, enabled: !!this.enabled[s.id] }));
  }

  getEnabledCount() {
    return Object.keys(this.enabled).length;
  }

  /**
   * Check if an intent's module is enabled
   * Intent format: "module.action.subaction"
   * Navigation intents are always allowed (EVA can always redirect)
   */
  canHandle(intent) {
    const module = intent.split('.')[0];
    // General, context, and navigation intents always allowed
    if (module === 'general' || module === 'context' || module === 'navigate') return true;
    // Check direct match or plural match
    if (this.enabled[module]) return true;
    if (this.enabled[module + 's']) return true;
    // Check singular of enabled keys
    const enabledKeys = Object.keys(this.enabled);
    for (const key of enabledKeys) {
      if (key.startsWith(module) || module.startsWith(key)) return true;
    }
    return false;
  }

  _persist() {
    localStorage.setItem('eva_skills', JSON.stringify(this.enabled));
  }
}

export const skillsManager = new SkillsManager();
