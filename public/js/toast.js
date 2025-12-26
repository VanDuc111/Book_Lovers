/**
 * Premium Toast Notification Handler
 * @param {string} message - The text to display
 * @param {string} type - success, warning, danger, info
 */
window.showToast = function(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    
    // Choose icon based on type
    let icon = 'fa-info-circle';
    if(type === 'success') icon = 'fa-check-circle';
    if(type === 'warning') icon = 'fa-exclamation-triangle';
    if(type === 'danger') icon = 'fa-times-circle';

    toast.innerHTML = `
        <i class="fas ${icon}"></i>
        <div class="toast-text">${message}</div>
    `;

    container.appendChild(toast);

    // Trigger slide in
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);

    // Auto remove
    const timer = setTimeout(() => {
        removeToast(toast);
    }, 4000);

    // Click to dismiss
    toast.addEventListener('click', () => {
        clearTimeout(timer);
        removeToast(toast);
    });
};

function removeToast(toast) {
    toast.classList.remove('show');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 400);
}
