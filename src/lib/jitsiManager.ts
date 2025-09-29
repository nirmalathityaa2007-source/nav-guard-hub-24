// Singleton Jitsi Manager to prevent video glitches from component re-renders
class JitsiManager {
  private static instance: JitsiManager;
  private apiInstance: any = null;
  private currentContainer: HTMLDivElement | null = null;
  private isInitializing = false;
  private isScriptLoaded = false;
  private eventListeners: Map<string, Function[]> = new Map();

  private constructor() {}

  static getInstance(): JitsiManager {
    if (!JitsiManager.instance) {
      JitsiManager.instance = new JitsiManager();
    }
    return JitsiManager.instance;
  }

  private loadJitsiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isScriptLoaded || window.JitsiMeetExternalAPI) {
        this.isScriptLoaded = true;
        resolve();
        return;
      }

      const existingScript = document.querySelector('script[src="https://8x8.vc/external_api.js"]');
      if (existingScript) {
        existingScript.addEventListener('load', () => {
          this.isScriptLoaded = true;
          resolve();
        });
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://8x8.vc/external_api.js';
      script.async = true;
      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async initialize(options: any, container: HTMLDivElement): Promise<void> {
    if (this.isInitializing) {
      console.log('Jitsi is already initializing, skipping...');
      return;
    }

    if (this.apiInstance && this.currentContainer === container) {
      console.log('Jitsi already initialized for this container, skipping...');
      return;
    }

    this.isInitializing = true;

    try {
      // Clean up previous instance if container changed
      if (this.apiInstance && this.currentContainer !== container) {
        console.log('Container changed, disposing previous instance');
        this.dispose();
      }

      await this.loadJitsiScript();

      if (!window.JitsiMeetExternalAPI) {
        throw new Error('Jitsi Meet API not loaded');
      }

      // Clear container before initializing
      container.innerHTML = '';
      this.currentContainer = container;

      const jitsiOptions = {
        ...options,
        parentNode: container,
      };

      console.log('Initializing Jitsi with options:', jitsiOptions);
      this.apiInstance = new window.JitsiMeetExternalAPI('8x8.vc', jitsiOptions);

      // Setup event listeners
      this.setupEventListeners();

    } catch (error) {
      console.error('Error initializing Jitsi:', error);
      throw error;
    } finally {
      this.isInitializing = false;
    }
  }

  private setupEventListeners(): void {
    if (!this.apiInstance) return;

    // Clear existing listeners
    this.eventListeners.clear();

    // Set up new listeners
    const eventTypes = ['participantJoined', 'participantLeft', 'videoConferenceLeft', 'videoConferenceJoined'];
    
    eventTypes.forEach(eventType => {
      this.apiInstance.addEventListener(eventType, (...args: any[]) => {
        const listeners = this.eventListeners.get(eventType) || [];
        listeners.forEach(listener => {
          try {
            listener(...args);
          } catch (error) {
            console.error(`Error in ${eventType} listener:`, error);
          }
        });
      });
    });
  }

  addEventListener(eventType: string, listener: Function): void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(listener);
  }

  removeEventListener(eventType: string, listener: Function): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  async getLocalTracks(): Promise<any[]> {
    if (!this.apiInstance) {
      throw new Error('Jitsi not initialized');
    }
    return this.apiInstance.getLocalTracks();
  }

  dispose(): void {
    console.log('Disposing Jitsi instance');
    if (this.apiInstance) {
      try {
        this.apiInstance.dispose();
      } catch (error) {
        console.error('Error disposing Jitsi:', error);
      }
      this.apiInstance = null;
    }
    this.currentContainer = null;
    this.eventListeners.clear();
    this.isInitializing = false;
  }

  isInitialized(): boolean {
    return !!this.apiInstance;
  }

  getCurrentContainer(): HTMLDivElement | null {
    return this.currentContainer;
  }
}

export default JitsiManager;