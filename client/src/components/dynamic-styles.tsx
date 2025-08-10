import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface SiteIdentity {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function DynamicStyles() {
  const { data: siteIdentity = {} } = useQuery({
    queryKey: ['/api/site-identity'],
  });

  useEffect(() => {
    const identity = siteIdentity as SiteIdentity;
    
    if (identity.primaryColor || identity.accentColor || identity.backgroundColor) {
      const root = document.documentElement;
      
      if (identity.primaryColor) {
        // Convert hex to HSL for better CSS variable integration
        const hslPrimary = hexToHsl(identity.primaryColor);
        root.style.setProperty('--primary', hslPrimary);
        
        // Update accent colors for consistency
        const hslAccent = identity.accentColor ? hexToHsl(identity.accentColor) : hslPrimary;
        root.style.setProperty('--accent-500', identity.accentColor || identity.primaryColor);
        root.style.setProperty('--accent-600', darkenColor(identity.accentColor || identity.primaryColor, 10));
      }
      
      if (identity.accentColor) {
        root.style.setProperty('--accent-500', identity.accentColor);
        root.style.setProperty('--accent-600', darkenColor(identity.accentColor, 10));
        root.style.setProperty('--accent-400', lightenColor(identity.accentColor, 10));
      }
      
      if (identity.backgroundColor) {
        const hslBg = hexToHsl(identity.backgroundColor);
        root.style.setProperty('--background', hslBg);
        root.style.setProperty('--card', hslBg);
      }
    }
  }, [siteIdentity]);

  return null; // This component only applies styles
}

// Helper functions for color manipulation
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
      default: h = 0;
    }
    h /= 6;
  }
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

function darkenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}