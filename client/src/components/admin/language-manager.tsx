import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Edit, Plus, Globe, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Translation {
  id: string;
  key: string;
  language: string;
  value: string;
  section: string;
  updatedAt: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
}

interface LanguageManagerProps {
  token: string;
}

const LanguageManager: React.FC<LanguageManagerProps> = ({ token }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedSection, setSelectedSection] = useState('general');
  const [isAddTranslationOpen, setIsAddTranslationOpen] = useState(false);
  const [isAddLanguageOpen, setIsAddLanguageOpen] = useState(false);
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [newTranslation, setNewTranslation] = useState<Partial<Translation>>({
    language: 'en',
    section: 'general',
  });
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({
    isActive: true,
    isDefault: false,
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Available languages
  const availableLanguages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', isActive: true, isDefault: true },
    { code: 'lv', name: 'Latvian', nativeName: 'Latviešu', isActive: true, isDefault: false },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', isActive: true, isDefault: false },
    { code: 'de', name: 'German', nativeName: 'Deutsch', isActive: true, isDefault: false },
    { code: 'fi', name: 'Finnish', nativeName: 'Suomi', isActive: true, isDefault: false },
  ];

  // Translation sections
  const sections = [
    { id: 'general', name: 'General' },
    { id: 'navigation', name: 'Navigation' },
    { id: 'hero', name: 'Hero Section' },
    { id: 'services', name: 'Services' },
    { id: 'contact', name: 'Contact' },
    { id: 'footer', name: 'Footer' },
    { id: 'common', name: 'Common Terms' },
  ];

  // Default English translations
  const defaultTranslations: Partial<Translation>[] = [
    // General
    { key: 'site.title', value: 'ChipTuning PRO', section: 'general' },
    { key: 'site.description', value: 'Professional ECU Tuning & Performance Enhancement', section: 'general' },
    
    // Navigation
    { key: 'nav.home', value: 'Home', section: 'navigation' },
    { key: 'nav.services', value: 'Services', section: 'navigation' },
    { key: 'nav.power_checker', value: 'Power Checker', section: 'navigation' },
    { key: 'nav.zbox', value: 'ZBOX Device', section: 'navigation' },
    { key: 'nav.contact', value: 'Contact', section: 'navigation' },
    
    // Hero Section
    { key: 'hero.title', value: 'ChipTuning PRO', section: 'hero' },
    { key: 'hero.subtitle', value: 'Professional ECU Tuning & Performance Enhancement', section: 'hero' },
    { key: 'hero.description', value: 'Unlock your vehicle\'s true potential with our expert chiptuning services. We provide Stage 1 & Stage 2 tuning, DPF/EGR removal, and professional ZBOX devices for maximum performance gains.', section: 'hero' },
    { key: 'hero.check_power', value: 'Check Vehicle Power', section: 'hero' },
    { key: 'hero.our_services', value: 'Our Services', section: 'hero' },
    
    // Services
    { key: 'services.stage1.title', value: 'Stage 1 Chiptuning', section: 'services' },
    { key: 'services.stage1.description', value: 'Optimize your engine performance with ECU remapping. Increase power and torque while maintaining reliability.', section: 'services' },
    { key: 'services.stage1.price', value: 'From €299', section: 'services' },
    { key: 'services.stage2.title', value: 'Stage 2 Chiptuning', section: 'services' },
    { key: 'services.stage2.description', value: 'Maximum performance gains with advanced tuning requiring hardware modifications.', section: 'services' },
    { key: 'services.stage2.price', value: 'From €499', section: 'services' },
    { key: 'services.dpf.title', value: 'DPF/EGR Removal', section: 'services' },
    { key: 'services.dpf.description', value: 'Remove restrictive emissions components for improved performance and reduced maintenance.', section: 'services' },
    { key: 'services.dpf.price', value: 'From €399', section: 'services' },
    { key: 'services.zbox.title', value: 'ZBOX Tuning Device', section: 'services' },
    { key: 'services.zbox.description', value: 'Professional tuning device with smartphone app control and real-time monitoring.', section: 'services' },
    { key: 'services.zbox.price', value: '€899', section: 'services' },
    
    // Contact
    { key: 'contact.title', value: 'Contact Us', section: 'contact' },
    { key: 'contact.phone', value: 'Phone', section: 'contact' },
    { key: 'contact.email', value: 'Email', section: 'contact' },
    { key: 'contact.address', value: 'Address', section: 'contact' },
    { key: 'contact.hours', value: 'Business Hours', section: 'contact' },
    
    // Common
    { key: 'common.power', value: 'Power', section: 'common' },
    { key: 'common.torque', value: 'Torque', section: 'common' },
    { key: 'common.original', value: 'Original', section: 'common' },
    { key: 'common.stage1', value: 'Stage 1', section: 'common' },
    { key: 'common.stage2', value: 'Stage 2', section: 'common' },
    { key: 'common.more_info', value: 'More Info', section: 'common' },
    { key: 'common.contact_us', value: 'Contact Us', section: 'common' },
    { key: 'common.learn_more', value: 'Learn More', section: 'common' },
  ];

  // Fetch translations
  const { data: translations = [], isLoading } = useQuery({
    queryKey: ['/api/admin/translations'],
    queryFn: async () => {
      // For now, return default translations - this would be replaced with actual API call
      return defaultTranslations.map((t, index) => ({
        ...t,
        id: `trans_${index}`,
        language: selectedLanguage,
        updatedAt: new Date().toISOString(),
      })) as Translation[];
    }
  });

  const filteredTranslations = translations.filter(t => 
    t.language === selectedLanguage && 
    (selectedSection === 'all' || t.section === selectedSection)
  );

  const generateTranslation = async (text: string, targetLanguage: string) => {
    // This would integrate with a translation service like Google Translate
    // For now, return sample translations
    const sampleTranslations: Record<string, Record<string, string>> = {
      'lv': {
        'ChipTuning PRO': 'ChipTuning PRO',
        'Professional ECU Tuning & Performance Enhancement': 'Profesionāla ECU virsbūve un veiktspējas uzlabošana',
        'Home': 'Mājas',
        'Services': 'Pakalpojumi',
        'Contact': 'Kontakti',
        'Power Checker': 'Jaudas pārbaude',
        'Stage 1 Chiptuning': '1. posma chiptunings',
        'Stage 2 Chiptuning': '2. posma chiptunings',
        'DPF/EGR Removal': 'DPF/EGR noņemšana',
        'ZBOX Tuning Device': 'ZBOX tuning ierīce',
      },
      'ru': {
        'ChipTuning PRO': 'ChipTuning PRO',
        'Professional ECU Tuning & Performance Enhancement': 'Профессиональная настройка ЭБУ и повышение производительности',
        'Home': 'Главная',
        'Services': 'Услуги',
        'Contact': 'Контакты',
        'Power Checker': 'Проверка мощности',
        'Stage 1 Chiptuning': 'Чип-тюнинг 1-й степени',
        'Stage 2 Chiptuning': 'Чип-тюнинг 2-й степени',
        'DPF/EGR Removal': 'Удаление DPF/EGR',
        'ZBOX Tuning Device': 'Тюнинг устройство ZBOX',
      },
      'de': {
        'ChipTuning PRO': 'ChipTuning PRO',
        'Professional ECU Tuning & Performance Enhancement': 'Professionelles ECU-Tuning & Leistungssteigerung',
        'Home': 'Startseite',
        'Services': 'Dienstleistungen',
        'Contact': 'Kontakt',
        'Power Checker': 'Leistungsprüfer',
        'Stage 1 Chiptuning': 'Stage 1 Chiptuning',
        'Stage 2 Chiptuning': 'Stage 2 Chiptuning',
        'DPF/EGR Removal': 'DPF/EGR Entfernung',
        'ZBOX Tuning Device': 'ZBOX Tuning-Gerät',
      }
    };

    return sampleTranslations[targetLanguage]?.[text] || text;
  };

  const TranslationForm = ({ 
    translation, 
    onChange, 
    title 
  }: { 
    translation: Partial<Translation>, 
    onChange: (translation: Partial<Translation>) => void, 
    title: string 
  }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-100">{title}</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="key" className="text-gray-300">Translation Key</Label>
          <Input
            id="key"
            value={translation.key || ''}
            onChange={(e) => onChange({...translation, key: e.target.value})}
            className="bg-gray-700 border-gray-600 text-gray-100"
            placeholder="e.g., nav.home"
          />
        </div>
        
        <div>
          <Label htmlFor="section" className="text-gray-300">Section</Label>
          <Select value={translation.section} onValueChange={(value) => onChange({...translation, section: value})}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              {sections.map(section => (
                <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="language" className="text-gray-300">Language</Label>
        <Select value={translation.language} onValueChange={(value) => onChange({...translation, language: value})}>
          <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-700 border-gray-600">
            {availableLanguages.map(lang => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.nativeName} ({lang.code.toUpperCase()})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="value" className="text-gray-300">Translation</Label>
        <Textarea
          id="value"
          value={translation.value || ''}
          onChange={(e) => onChange({...translation, value: e.target.value})}
          className="bg-gray-700 border-gray-600 text-gray-100 min-h-20"
          placeholder="Enter translation text..."
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="text-gray-400">Loading translations...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-gray-100 flex items-center justify-between">
          <span className="flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Language & Translation Management
          </span>
          <div className="flex space-x-2">
            <Dialog open={isAddLanguageOpen} onOpenChange={setIsAddLanguageOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-gray-600 text-gray-300">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Language
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">Add Language</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-300">Language Code</Label>
                      <Input 
                        placeholder="e.g., es, fr, it"
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        value={newLanguage.code || ''}
                        onChange={(e) => setNewLanguage({...newLanguage, code: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label className="text-gray-300">Language Name</Label>
                      <Input 
                        placeholder="e.g., Spanish"
                        className="bg-gray-700 border-gray-600 text-gray-100"
                        value={newLanguage.name || ''}
                        onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-6">
                  <Button variant="outline" onClick={() => setIsAddLanguageOpen(false)}>Cancel</Button>
                  <Button>Add Language</Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isAddTranslationOpen} onOpenChange={setIsAddTranslationOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Translation
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-gray-100">Add Translation</DialogTitle>
                </DialogHeader>
                <TranslationForm
                  translation={newTranslation}
                  onChange={setNewTranslation}
                  title=""
                />
                <div className="flex justify-end space-x-2 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsAddTranslationOpen(false)}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Add Translation
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Language & Section Filters */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label className="text-gray-300">Language</Label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {availableLanguages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.nativeName} ({lang.code.toUpperCase()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <Label className="text-gray-300">Section</Label>
              <Select value={selectedSection} onValueChange={setSelectedSection}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="all">All Sections</SelectItem>
                  {sections.map(section => (
                    <SelectItem key={section.id} value={section.id}>{section.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="border-green-600 text-green-400 hover:bg-green-600 hover:text-white"
                onClick={async () => {
                  const baseTranslations = translations.filter(t => t.language === 'en');
                  for (const trans of baseTranslations) {
                    const translated = await generateTranslation(trans.value, selectedLanguage);
                    toast({
                      title: 'Translation Generated',
                      description: `Generated translation for "${trans.key}"`
                    });
                  }
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Auto-Translate from English
              </Button>
            </div>
          </div>

          {/* Translations List */}
          <div className="space-y-2">
            {filteredTranslations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No translations found for {selectedLanguage.toUpperCase()} in {selectedSection === 'all' ? 'all sections' : selectedSection}.
              </div>
            ) : (
              filteredTranslations.map((translation: Translation) => (
                <div key={translation.id} className="bg-gray-700 p-4 rounded-lg border border-gray-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-blue-400 text-sm bg-gray-800 px-2 py-1 rounded">
                          {translation.key}
                        </code>
                        <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                          {translation.section}
                        </span>
                      </div>
                      <p className="text-gray-100 text-sm leading-relaxed">
                        {translation.value}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingTranslation(translation)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-600"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Quick Stats */}
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h3 className="text-gray-100 font-semibold mb-2">Translation Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {availableLanguages.map(lang => (
                <div key={lang.code} className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {translations.filter(t => t.language === lang.code).length}
                  </div>
                  <div className="text-xs text-gray-400">{lang.nativeName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Dialog */}
        <Dialog open={!!editingTranslation} onOpenChange={() => setEditingTranslation(null)}>
          <DialogContent className="bg-gray-800 border-gray-700 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-gray-100">Edit Translation</DialogTitle>
            </DialogHeader>
            {editingTranslation && (
              <TranslationForm
                translation={editingTranslation}
                onChange={setEditingTranslation}
                title=""
              />
            )}
            <div className="flex justify-end space-x-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => setEditingTranslation(null)}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Update Translation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default LanguageManager;