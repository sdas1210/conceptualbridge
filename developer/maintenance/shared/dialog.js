/**
 * Conceptual Bridge - Modal Dialog Framework
 * Custom modal interface for system confirmations.
 */

export function showConfirmDialog({ title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) {
  return new Promise((resolve) => {
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'modal-overlay glassmorphism';

    modalOverlay.innerHTML = `
      <div class="modal-box">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="modal-actions">
          <button id="modalBtnCancel" class="btn btn-secondary">${cancelText}</button>
          <button id="modalBtnConfirm" class="btn btn-danger">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(modalOverlay);

    const btnCancel = modalOverlay.querySelector('#modalBtnCancel');
    const btnConfirm = modalOverlay.querySelector('#modalBtnConfirm');

    btnCancel.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
      resolve(false);
    });

    btnConfirm.addEventListener('click', () => {
      document.body.removeChild(modalOverlay);
      resolve(true);
    });
  });
}
