import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

// Generate a session ID that persists during the user's session
function generateSessionId(): string {
  const sessionId = sessionStorage.getItem('analytics_session_id');
  if (sessionId) {
    return sessionId;
  }
  
  const newSessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  sessionStorage.setItem('analytics_session_id', newSessionId);
  return newSessionId;
}

// Get geolocation using browser API
async function getGeolocation(): Promise<{ country?: string; city?: string }> {
  return new Promise((resolve) => {
    try {
      // Try to get location from free IP geolocation service with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        resolve({}); // Resolve with empty object on timeout
      }, 3000); // 3 second timeout
      
      fetch('https://ipapi.co/json/', {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      })
      .then(async (response) => {
        clearTimeout(timeoutId);
        if (response.ok) {
          const data = await response.json();
          resolve({
            country: data.country_name || 'Unknown',
            city: data.city || 'Unknown'
          });
        } else {
          resolve({});
        }
      })
      .catch(() => {
        clearTimeout(timeoutId);
        resolve({}); // Always resolve, never reject
      });
    } catch (error) {
      resolve({}); // Always resolve, never reject
    }
  });
}

export function useAnalytics() {
  const [location] = useLocation();
  const [sessionId] = useState(() => generateSessionId());

  // Track page views - only with GDPR consent
  useEffect(() => {
    const trackPageView = async () => {
      // Check GDPR consent
      const consent = localStorage.getItem('cookie-consent');
      let canTrack = false;
      
      if (consent) {
        try {
          const settings = JSON.parse(consent);
          canTrack = settings.analytics === true;
        } catch (error) {
          // Invalid consent data
          return;
        }
      }

      if (!canTrack) {
        return; // Don't track without consent
      }

      try {
        const geo = await getGeolocation();
        
        await fetch('/api/analytics/page-view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            pageName: location,
            sessionId,
            ...geo
          })
        });
      } catch (error) {
        // Page view tracking failed silently - optional feature
      }
    };

    trackPageView();
  }, [location, sessionId]);

  // Track click events - only with GDPR consent
  const trackClick = async (element: string, elementText?: string, targetUrl?: string) => {
    // Check GDPR consent
    const consent = localStorage.getItem('cookie-consent');
    let canTrack = false;
    
    if (consent) {
      try {
        const settings = JSON.parse(consent);
        canTrack = settings.analytics === true;
      } catch (error) {
        // Invalid consent data for click tracking
        return;
      }
    }

    if (!canTrack) {
      return; // Don't track without consent
    }

    try {
      await fetch('/api/analytics/click', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          element,
          pageName: location,
          elementText,
          targetUrl,
          sessionId
        })
      });
    } catch (error) {
      // Click tracking failed silently - optional feature
    }
  };

  // Track vehicle selections - only with GDPR consent
  const trackVehicleSelection = async (
    vehicleType: string,
    brand: string,
    model?: string,
    generation?: string,
    engine?: string,
    variant?: string
  ) => {
    // Check GDPR consent
    const consent = localStorage.getItem('cookie-consent');
    let canTrack = false;
    
    if (consent) {
      try {
        const settings = JSON.parse(consent);
        canTrack = settings.analytics === true;
      } catch (error) {
        // Invalid consent data for vehicle selection tracking
        return;
      }
    }

    if (!canTrack) {
      return; // Don't track without consent
    }

    try {
      const geo = await getGeolocation();
      
      await fetch('/api/analytics/vehicle-selection', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          vehicleType,
          brand,
          model,
          generation,
          engine,
          variant,
          sessionId,
          ...geo
        })
      });
    } catch (error) {
      // Vehicle selection tracking failed silently - optional feature
    }
  };

  return {
    trackClick,
    trackVehicleSelection
  };
}