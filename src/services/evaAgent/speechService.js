/**
 * EVA Speech Service
 * Handles speech recognition (STT) and speech synthesis (TTS)
 * Replace with cloud APIs (Google Cloud Speech, AWS Polly) for production
 */

// Cache the selected voice to maintain consistent tone
let cachedVoice = null;

const getPreferredVoice = () => {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis.getVoices();
  cachedVoice = voices.find(v => v.lang.startsWith('en-US') && (v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Female') || v.name.includes('Zira')))
    || voices.find(v => v.lang.startsWith('en-US') && v.name.includes('Google'))
    || voices.find(v => v.lang.startsWith('en-US'))
    || voices.find(v => v.lang.startsWith('en'))
    || null;
  return cachedVoice;
};

// Pre-load voices
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = null; getPreferredVoice(); };
  getPreferredVoice();
}

/**
 * Speak text using Web Speech Synthesis API
 * Uses cached voice for consistent tone across all responses
 * @param {string} text
 * @param {function} onStart
 * @param {function} onEnd
 */
export const speak = (text, onStart, onEnd) => {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1.1;
  utterance.volume = 1.0;

  const voice = getPreferredVoice();
  if (voice) utterance.voice = voice;

  utterance.onstart = onStart;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop speaking
 */
export const stopSpeaking = () => {
  window.speechSynthesis.cancel();
};

/**
 * Start speech recognition
 * @param {function} onResult - Called with transcript text
 * @param {function} onEnd - Called when recognition ends
 * @param {function} onError - Called on error
 * @returns {object|null} recognition instance (call .stop() to end)
 */
export const startListening = (onResult, onEnd, onError) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onend = onEnd;
  recognition.onerror = (e) => onError(e.error);

  recognition.start();
  return recognition;
};
