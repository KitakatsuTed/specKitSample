import { UIController } from '@/lib/UIController';
import './styles.css';

// Initialize the application
function initializeApp(): void {
  const controller = new UIController('app');

  try {
    controller.init();
    console.log('✅ ToDo App initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize ToDo App:', error);

    // Show basic error message to user
    const appElement = document.getElementById('app');
    if (appElement) {
      appElement.innerHTML = `
        <div style="padding: 20px; text-align: center; color: #d32f2f;">
          <h1>⚠️ Application Error</h1>
          <p>Failed to initialize the ToDo application.</p>
          <p>Please refresh the page to try again.</p>
          <pre style="background: #f5f5f5; padding: 10px; margin: 10px 0; text-align: left;">
            ${error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      `;
    }
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for testing
export { initializeApp };
