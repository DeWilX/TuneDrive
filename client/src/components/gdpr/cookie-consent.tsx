import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { X, Settings, Shield, BarChart3, Target, Zap } from 'lucide-react';
import { useLanguage } from '@/hooks/useLanguage';

interface CookieConsentProps {
  onAccept: (preferences: { necessary: boolean; analytics: boolean; marketing: boolean; functional: boolean }) => void;
  onDecline: () => void;
}

export default function CookieConsent({ onAccept, onDecline }: CookieConsentProps) {
  const [showCustomize, setShowCustomize] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });
  const { t } = useLanguage();

  const handleAcceptAll = () => {
    onAccept({
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true,
    });
  };

  const handleSavePreferences = () => {
    onAccept(preferences);
  };

  const cookieTypes = [
    {
      key: 'necessary',
      title: t.gdpr.necessary,
      description: 'Essential cookies for basic website functionality, security, and navigation.',
      icon: Shield,
      required: true,
    },
    {
      key: 'functional',
      title: t.gdpr.functional,
      description: 'Cookies that remember your preferences like language settings and user interface customizations.',
      icon: Zap,
      required: false,
    },
    {
      key: 'analytics',
      title: t.gdpr.analytics,
      description: 'Cookies that help us understand how you use our website to improve your experience.',
      icon: BarChart3,
      required: false,
    },
    {
      key: 'marketing',
      title: t.gdpr.marketing,
      description: 'Cookies used to deliver personalized advertisements and measure their effectiveness.',
      icon: Target,
      required: false,
    },
  ];

  if (showCustomize) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto bg-gray-900 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-white">{t.gdpr.customize}</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your cookie preferences. You can change these settings at any time.
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCustomize(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {cookieTypes.map((type) => {
              const Icon = type.icon;
              return (
                <div key={type.key} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    <Icon className="w-5 h-5 text-accent-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-white">{type.title}</h4>
                      <div className="flex items-center space-x-2">
                        {type.required && (
                          <span className="text-xs text-accent-400 font-medium">
                            {t.gdpr.alwaysOn}
                          </span>
                        )}
                        <Switch
                          checked={preferences[type.key as keyof typeof preferences]}
                          onCheckedChange={(checked) =>
                            setPreferences((prev) => ({ ...prev, [type.key]: checked }))
                          }
                          disabled={type.required}
                        />
                      </div>
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{type.description}</p>
                  </div>
                </div>
              );
            })}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-700">
              <Button
                onClick={handleSavePreferences}
                className="flex-1 bg-accent-600 hover:bg-accent-700 text-white"
              >
                {t.gdpr.savePreferences}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCustomize(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                {t.common.cancel}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700 p-4 z-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-accent-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {t.gdpr.cookieTitle}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {t.gdpr.cookieDescription}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <Button
              onClick={onDecline}
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              {t.gdpr.declineAll}
            </Button>
            <Button
              onClick={() => setShowCustomize(true)}
              variant="outline"
              className="border-accent-600 text-accent-400 hover:bg-accent-600/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              {t.gdpr.customize}
            </Button>
            <Button
              onClick={handleAcceptAll}
              className="bg-accent-600 hover:bg-accent-700 text-white"
            >
              {t.gdpr.acceptAll}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}