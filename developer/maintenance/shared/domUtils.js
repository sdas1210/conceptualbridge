/**
 * Conceptual Bridge - DOM Utilities
 * Reusable UI controls for visibility, locking state, scrolling, and focus.
 */

export function show(element) {
  if (element) element.classList.remove('hidden');
}

export function hide(element) {
  if (element) element.classList.add('hidden');
}

export function enable(element) {
  if (element) element.disabled = false;
}

export function disable(element) {
  if (element) element.disabled = true;
}

export function lockStepCard(stepElement) {
  if (!stepElement) return;
  stepElement.classList.remove('active', 'completed');
  stepElement.classList.add('locked');
  stepElement.querySelectorAll('.form-control, .btn-save').forEach((i) => (i.disabled = true));
  const editBtn = stepElement.querySelector('.btn-edit');
  const saveBtn = stepElement.querySelector('.btn-save');
  if (editBtn) hide(editBtn);
  if (saveBtn) show(saveBtn);
}

export function unlockStepCard(stepElement) {
  if (!stepElement) return;
  stepElement.classList.remove('locked', 'completed');
  stepElement.classList.add('active');
  stepElement.querySelectorAll('.form-control, .btn-save').forEach((i) => (i.disabled = false));
  const editBtn = stepElement.querySelector('.btn-edit');
  const saveBtn = stepElement.querySelector('.btn-save');
  if (editBtn) hide(editBtn);
  if (saveBtn) show(saveBtn);
  scrollToElement(stepElement);
}

export function completeStepCard(stepElement) {
  if (!stepElement) return;
  stepElement.classList.remove('active', 'locked');
  stepElement.classList.add('completed');
  stepElement.querySelectorAll('.form-control, .btn-save').forEach((i) => (i.disabled = true));
  const editBtn = stepElement.querySelector('.btn-edit');
  const saveBtn = stepElement.querySelector('.btn-save');
  if (saveBtn) hide(saveBtn);
  if (editBtn) show(editBtn);
}

export function scrollToElement(element) {
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}
