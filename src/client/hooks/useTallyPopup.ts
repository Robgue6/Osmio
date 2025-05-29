import { useEffect } from 'react';

// Define Tally types - using a module augmentation pattern
declare global {
  interface Window {
    Tally?: TallyType;
  }
}

// Define the Tally interface separately to avoid conflicts
interface TallyType {
  openPopup: (
    formId: string, 
    options?: {
      layout?: 'default' | 'modal';
      width?: number;
      emoji?: {
        text: string;
        animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
      };
      hiddenFields?: Record<string, any>;
      autoClose?: number;
      showOnce?: boolean;
      doNotShowAfterSubmit?: boolean;
      onOpen?: () => void;
      onSubmit?: (payload: any) => void;
      onClose?: () => void;
      onPageView?: (page: number) => void;
    }
  ) => void;
  closePopup: (formId: string) => void;
}

interface UseTallyPopupOptions {
  formId: string;
  userId: string;
  storageKey?: string;
  width?: number;
  emoji?: {
    text: string;
    animation: 'none' | 'wave' | 'tada' | 'heart-beat' | 'spin' | 'flash' | 'bounce' | 'rubber-band' | 'head-shake';
  };
  delay?: number;
  maxWaitTime?: number;
}

/**
 * Hook to show a Tally form popup once per user
 */
export const useTallyPopup = ({
  formId,
  userId,
  storageKey = 'hasSeenOnboarding',
  width = 700,
  emoji = { text: '👋', animation: 'wave' },
  delay = 1000,
  maxWaitTime = 5000
}: UseTallyPopupOptions) => {
  // Add Tally script to head
  useEffect(() => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src="https://tally.so/widgets/embed.js"]');
    
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://tally.so/widgets/embed.js';
      script.async = true;
      document.head.appendChild(script);
      
      return () => {
        if (document.head.contains(script)) {
          document.head.removeChild(script);
        }
      };
    }
  }, []);
  
  // Show the Tally popup for new users
  useEffect(() => {
    // Check if user has seen the onboarding popup before
    const storageId = `${storageKey}-${userId}`;
    const hasSeenOnboarding = localStorage.getItem(storageId);
    
    // Create a function to show the popup once Tally is loaded
    const showTallyPopup = () => {
      if (window.Tally) {
        window.Tally.openPopup(formId, {
          layout: 'modal',
          width,
          emoji,
          onSubmit: () => {
            // Mark user as having seen the onboarding
            localStorage.setItem(storageId, 'true');
          },
          onClose: () => {
            // Even if they close without submitting, don't show again
            localStorage.setItem(storageId, 'true');
          }
        });
      }
    };
    
    if (!hasSeenOnboarding) {
      // Wait a bit before showing the popup to ensure the page is loaded
      const timer = setTimeout(() => {
        if (typeof window.Tally !== 'undefined') {
          showTallyPopup();
        } else {
          // If Tally isn't loaded yet, wait for it
          const checkTallyInterval = setInterval(() => {
            if (typeof window.Tally !== 'undefined') {
              showTallyPopup();
              clearInterval(checkTallyInterval);
            }
          }, 300);
          
          // Don't wait forever
          setTimeout(() => clearInterval(checkTallyInterval), maxWaitTime);
        }
      }, delay);
      
      return () => clearTimeout(timer);
    }
  }, [formId, userId, storageKey, width, emoji, delay, maxWaitTime]);
  
  // Provide a function to manually trigger the popup if needed
  const showPopup = (options?: any) => {
    if (window.Tally) {
      window.Tally.openPopup(formId, options);
    } else {
      console.error('Tally is not loaded yet');
    }
  };
  
  return { showPopup };
}; 