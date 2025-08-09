import { useState, useEffect } from 'react';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

interface GDPRState {
  showBanner: boolean;
  preferences: CookiePreferences | null;
  consentDate: string | null;
}

export function useGDPR() {
  const [state, setState] = useState<GDPRState>({
    showBanner: false,
    preferences: null,
    consentDate: null,
  });

  useEffect(() => {
    // Check for existing consent
    const consent = localStorage.getItem('cookie-consent');
    const consentDate = localStorage.getItem('cookie-consent-date');
    
    if (consent && consentDate) {
      try {
        const preferences = JSON.parse(consent);
        setState({
          showBanner: false,
          preferences,
          consentDate,
        });
      } catch (error) {
        // Invalid stored consent data, using default
        setState(prev => ({ ...prev, showBanner: true }));
      }
    } else {
      // Show banner if no consent found
      setState(prev => ({ ...prev, showBanner: true }));
    }
  }, []);

  const updateConsent = (preferences: CookiePreferences) => {
    const consentDate = new Date().toISOString();
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', consentDate);
    
    setState({
      showBanner: false,
      preferences,
      consentDate,
    });

    // Set functional cookies if allowed
    if (preferences.functional) {
      // Store language preference and other functional settings
      const currentLang = localStorage.getItem('preferred-language');
      if (currentLang) {
        document.cookie = `language_preference=${currentLang}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
      }
    }
  };

  const withdrawConsent = () => {
    const preferences: CookiePreferences = {
      necessary: true, // Always required
      analytics: false,
      marketing: false,
      functional: false,
    };
    
    const consentDate = new Date().toISOString();
    
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', consentDate);
    
    setState({
      showBanner: false,
      preferences,
      consentDate,
    });

    // Clear non-essential cookies
    clearNonEssentialCookies();
  };

  const clearNonEssentialCookies = () => {
    // Clear analytics cookies
    const analyticsKeys = ['analytics_session_id', 'geolocation-tracked'];
    analyticsKeys.forEach(key => {
      sessionStorage.removeItem(key);
    });

    // Clear functional cookies from document.cookie
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const [name] = cookie.trim().split('=');
      if (name && !['necessary_cookie_name'].includes(name)) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT; SameSite=Lax`;
      }
    });
  };

  const canUseAnalytics = (): boolean => {
    return state.preferences?.analytics === true;
  };

  const canUseMarketing = (): boolean => {
    return state.preferences?.marketing === true;
  };

  const canUseFunctional = (): boolean => {
    return state.preferences?.functional === true;
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    localStorage.removeItem('cookie-consent-date');
    setState({
      showBanner: true,
      preferences: null,
      consentDate: null,
    });
  };

  return {
    showBanner: state.showBanner,
    preferences: state.preferences,
    consentDate: state.consentDate,
    updateConsent,
    withdrawConsent,
    canUseAnalytics,
    canUseMarketing,
    canUseFunctional,
    resetConsent,
  };
}