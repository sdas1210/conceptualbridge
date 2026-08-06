/**
 * Conceptual Bridge - Toast Notification Framework
 * Reusable overlay alerts.
 */

import { ANIMATION_TIMINGS } from './constants.js';

class ToastManager {
  constructor() {
    this.container = null;
    this._init();
  }

  _init() {
    let el = document.getElementById('toastContainer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toastContainer';
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, ANIMATION_TIMINGS.TOAST_DURATION);
  }

  success(message) { this.show(message, 'success'); }
  warning(message) { this.show(message, 'warning'); }
  error(message) { this.show(message, 'error'); }
  info(message) { this.show(message, 'info'); }
}

export const toast = new ToastManager();
