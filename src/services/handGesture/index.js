/**
 * Hand Gesture Navigation Service
 * Uses MediaPipe Hand Landmarker to detect gestures for page navigation
 * 
 * Gestures:
 * - Swipe Left  → Navigate forward (next page)
 * - Swipe Right → Navigate back (previous page)
 * - Pinch       → Select / Confirm
 * - Open Palm   → Stop / Cancel
 * - Point Up    → Scroll up
 * - Point Down  → Scroll down
 * - Fist        → Go to Dashboard (home)
 */

import { HandLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

const NAV_PAGES = [
  '/dashboard',
  '/catalogue/products',
  '/catalogue/bundles',
  '/catalogue/promotions',
  '/customers/view',
  '/support/tickets',
  '/configuration',
];

class HandGestureService {
  constructor() {
    this.handLandmarker = null;
    this.video = null;
    this.isRunning = false;
    this.listeners = [];
    this.onHandPosition = null;
    this.lastGesture = null;
    this.gestureTimeout = null;
    this.prevWristX = null;
    this.swipeThreshold = 0.10;
    this.currentPageIndex = 0;
  }

  async init() {
    try {
      const vision = await FilesetResolver.forVisionTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
      );

      this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task',
          delegate: 'GPU',
        },
        runningMode: 'VIDEO',
        numHands: 1,
        minHandDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });

      // Setup camera
      this.video = document.createElement('video');
      this.video.setAttribute('autoplay', '');
      this.video.setAttribute('playsinline', '');
      this.video.style.cssText = 'position:fixed;bottom:70px;left:12px;width:120px;height:90px;border-radius:10px;opacity:0.4;z-index:30;border:1px solid rgba(0,150,255,0.3);transform:scaleX(-1);';

      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240, facingMode: 'user' } });
      this.video.srcObject = stream;
      document.body.appendChild(this.video);

      await new Promise((resolve) => { this.video.onloadeddata = resolve; });
      this.isRunning = true;
      this._detect();

      return true;
    } catch (e) {
      console.warn('Hand gesture init failed:', e.message);
      return false;
    }
  }

  _detect() {
    if (!this.isRunning || !this.handLandmarker || !this.video) return;

    const results = this.handLandmarker.detectForVideo(this.video, performance.now());

    if (results.landmarks && results.landmarks.length > 0) {
      const landmarks = results.landmarks[0];
      const gesture = this._recognizeGesture(landmarks);

      // Report hand position for parallax
      if (this.onHandPosition) {
        this.onHandPosition({
          x: (landmarks[9].x - 0.5) * -2,
          y: -(landmarks[9].y - 0.5) * 2,
        });
      }

      // Report gesture (debounced)
      if (gesture && gesture !== this.lastGesture) {
        this.lastGesture = gesture;
        this._emitGesture(gesture);
        clearTimeout(this.gestureTimeout);
        this.gestureTimeout = setTimeout(() => { this.lastGesture = null; }, 1000);
      }
    }

    requestAnimationFrame(() => this._detect());
  }

  _recognizeGesture(landmarks) {
    const wrist = landmarks[0];
    const thumbTip = landmarks[4];
    const indexTip = landmarks[8];
    const middleTip = landmarks[12];
    const ringTip = landmarks[16];
    const pinkyTip = landmarks[20];
    const indexMcp = landmarks[5];

    // Pinch: thumb tip close to index tip
    const pinchDist = Math.sqrt(Math.pow(thumbTip.x - indexTip.x, 2) + Math.pow(thumbTip.y - indexTip.y, 2));
    if (pinchDist < 0.05) return 'pinch';

    // Fist: all fingertips below their MCPs (curled)
    const isFist = indexTip.y > indexMcp.y && middleTip.y > landmarks[9].y && ringTip.y > landmarks[13].y && pinkyTip.y > landmarks[17].y;
    if (isFist) return 'fist';

    // Open palm: all fingers extended (tips above MCPs)
    const isOpen = indexTip.y < indexMcp.y && middleTip.y < landmarks[9].y && ringTip.y < landmarks[13].y && pinkyTip.y < landmarks[17].y;
    if (isOpen) {
      // Detect swipe by wrist movement
      if (this.prevWristX !== null) {
        const dx = wrist.x - this.prevWristX;
        if (dx > this.swipeThreshold) { this.prevWristX = wrist.x; return 'swipe_right'; }
        if (dx < -this.swipeThreshold) { this.prevWristX = wrist.x; return 'swipe_left'; }
      }
      this.prevWristX = wrist.x;
      return 'open';
    }

    // Point up: only index finger extended
    const indexUp = indexTip.y < indexMcp.y;
    const othersDown = middleTip.y > landmarks[9].y && ringTip.y > landmarks[13].y && pinkyTip.y > landmarks[17].y;
    if (indexUp && othersDown) return 'point';

    this.prevWristX = wrist.x;
    return null;
  }

  getNavPages() {
    return NAV_PAGES;
  }

  addListener(fn) {
    this.listeners.push(fn);
  }

  removeListener(fn) {
    this.listeners = this.listeners.filter(l => l !== fn);
  }

  _emitGesture(gesture) {
    this.listeners.forEach(fn => fn(gesture));
  }

  getNextPage() {
    this.currentPageIndex = (this.currentPageIndex + 1) % NAV_PAGES.length;
    return NAV_PAGES[this.currentPageIndex];
  }

  getPrevPage() {
    this.currentPageIndex = (this.currentPageIndex - 1 + NAV_PAGES.length) % NAV_PAGES.length;
    return NAV_PAGES[this.currentPageIndex];
  }

  stop() {
    this.isRunning = false;
    if (this.video) {
      this.video.srcObject?.getTracks().forEach(t => t.stop());
      this.video.remove();
      this.video = null;
    }
  }
}

export const handGestureService = new HandGestureService();
