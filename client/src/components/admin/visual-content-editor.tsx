import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save, Eye, EyeOff, Edit3 } from "lucide-react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface ContentItem {
  id: string;
  pageName: string;
  title: string;
  subtitle?: string;
  content: any;
  isActive: boolean;
  updatedAt: string;
}

interface VisualContentEditorProps {
  token: string;
}

export default function VisualContentEditor({ token }: VisualContentEditorProps) {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const quillModules = {
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, 
       { 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/page-content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContent(data);
        if (data.length > 0 && !selectedContent) {
          setSelectedContent(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  const handleSave = async (updatedContent: ContentItem) => {
    setIsSaving(true);
    try {
      const url = `/api/admin/page-content/${updatedContent.id}`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedContent),
      });

      if (response.ok) {
        toast({
          title: "Saved Successfully",
          description: "Your changes are now live on the website",
        });
        await fetchContent();
        setIsEditing(null);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save your changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updateContentField = (field: string, value: any) => {
    if (!selectedContent) return;
    const updated = { ...selectedContent, [field]: value };
    setSelectedContent(updated);
  };

  const updateNestedContent = (path: string, value: any) => {
    if (!selectedContent) return;
    const updated = { ...selectedContent };
    
    // Initialize content as empty object if it's a string or null
    if (typeof updated.content === 'string' || !updated.content) {
      updated.content = {};
    }
    
    const pathParts = path.split('.');
    let current = updated.content;
    
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]] || typeof current[pathParts[i]] === 'string') {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }
    
    current[pathParts[pathParts.length - 1]] = value;
    setSelectedContent(updated);
  };

  const renderContentEditor = () => {
    if (!selectedContent) return null;

    const contentData = selectedContent.content || {};

    return (
      <div className="space-y-6">
        {/* Hero Section Editor */}
        {selectedContent.pageName === 'home' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <i className="fas fa-star text-yellow-400"></i>
                Hero Section (Top of Homepage)
              </CardTitle>
              <p className="text-gray-400 text-sm">This appears at the very top of your website - make it compelling!</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Main Headline
                  </label>
                  <Input
                    value={contentData.hero?.title || ''}
                    onChange={(e) => updateNestedContent('hero.title', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Professional Chiptuning Services"
                  />
                  <p className="text-xs text-gray-500 mt-1">The big text visitors see first</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Subtitle
                  </label>
                  <Input
                    value={contentData.hero?.subtitle || ''}
                    onChange={(e) => updateNestedContent('hero.subtitle', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Unlock your vehicle's true potential"
                  />
                  <p className="text-xs text-gray-500 mt-1">Supporting text under the headline</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description Text
                </label>
                <ReactQuill
                  theme="snow"
                  value={contentData.hero?.description || ''}
                  onChange={(value) => updateNestedContent('hero.description', value)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-gray-700 text-white [&_.ql-editor]:bg-gray-700 [&_.ql-editor]:text-white [&_.ql-toolbar]:bg-gray-600 [&_.ql-toolbar]:border-gray-500"
                  placeholder="Describe your services and what makes you special..."
                />
                <p className="text-xs text-gray-500 mt-1">Main description that explains your services</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Primary Button Text
                  </label>
                  <Input
                    value={contentData.hero?.primaryButton?.text || ''}
                    onChange={(e) => updateNestedContent('hero.primaryButton.text', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Get Quote Now"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Secondary Button Text
                  </label>
                  <Input
                    value={contentData.hero?.secondaryButton?.text || ''}
                    onChange={(e) => updateNestedContent('hero.secondaryButton.text', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Learn More"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* About Section Editor */}
        {selectedContent.pageName === 'home' && (
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <i className="fas fa-info-circle text-blue-400"></i>
                About Section
              </CardTitle>
              <p className="text-gray-400 text-sm">Tell visitors about your business and expertise</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  About Title
                </label>
                <Input
                  value={contentData.about?.title || ''}
                  onChange={(e) => updateNestedContent('about.title', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="About Our Services"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  About Content
                </label>
                <ReactQuill
                  theme="snow"
                  value={contentData.about?.content || ''}
                  onChange={(value) => updateNestedContent('about.content', value)}
                  modules={quillModules}
                  formats={quillFormats}
                  className="bg-gray-700 text-white [&_.ql-editor]:bg-gray-700 [&_.ql-editor]:text-white [&_.ql-toolbar]:bg-gray-600 [&_.ql-toolbar]:border-gray-500"
                  placeholder="Write about your experience, qualifications, and what makes you the best choice..."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Preview */}
        {isPreview && (
          <Card className="bg-white border border-gray-300 shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                Live Preview - {selectedContent?.title || 'Content'}
              </CardTitle>
              <p className="text-gray-600 text-sm">This is how your content will appear on the website</p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="min-h-[400px]">
                {/* Preview content based on section type */}
                {selectedContent?.section === 'hero' && (
                  <div className="relative min-h-[400px] bg-gradient-to-r from-gray-900 to-gray-700 text-white p-8">
                    <div className="max-w-4xl">
                      <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.title || 'Hero Title' }} />
                      </h1>
                      <div className="text-xl mb-8 text-gray-200">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.content || 'Hero description content' }} />
                      </div>
                      <div className="flex gap-4">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold">
                          Check Power
                        </button>
                        <button className="border border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-lg font-semibold">
                          Our Services  
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedContent?.section === 'zbox' && (
                  <div className="p-8 bg-gray-800 text-white">
                    <div className="max-w-4xl">
                      <h2 className="text-3xl font-bold mb-6">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.title || 'ZBox Title' }} />
                      </h2>
                      <div className="text-lg mb-8 text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.content || 'ZBox description content' }} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-semibold mb-4">Key Features:</h4>
                          <ul className="space-y-2">
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Easy installation</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Mobile app control</li>
                            <li className="flex items-center"><span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>Multiple power maps</li>
                          </ul>
                        </div>
                        <div className="flex items-center">
                          <div className="text-center">
                            <div className="text-3xl font-bold text-blue-400">From €599</div>
                            <div className="text-gray-400">Including installation</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {selectedContent?.section === 'why-choose-us' && (
                  <div className="p-8 bg-gray-900 text-white">
                    <div className="max-w-4xl text-center">
                      <h2 className="text-3xl font-bold mb-4">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.title || 'Why Choose Us Title' }} />
                      </h2>
                      <div className="text-lg mb-8 text-gray-300">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent.content || 'Why choose us description' }} />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-award text-white"></i>
                          </div>
                          <h4 className="font-semibold mb-2">15+ Years</h4>
                          <p className="text-sm text-gray-400">Experience</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-shield-alt text-white"></i>
                          </div>
                          <h4 className="font-semibold mb-2">Quality</h4>
                          <p className="text-sm text-gray-400">Guarantee</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-tachometer-alt text-white"></i>
                          </div>
                          <h4 className="font-semibold mb-2">Dyno</h4>
                          <p className="text-sm text-gray-400">Testing</p>
                        </div>
                        <div className="text-center">
                          <div className="bg-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fas fa-user-cog text-white"></i>
                          </div>
                          <h4 className="font-semibold mb-2">Custom</h4>
                          <p className="text-sm text-gray-400">Solutions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Generic content preview for other sections */}
                {(!selectedContent?.section || !['hero', 'zbox', 'why-choose-us'].includes(selectedContent.section)) && (
                  <div className="p-8 bg-white text-gray-900">
                    <div className="max-w-4xl">
                      <h2 className="text-3xl font-bold mb-6 text-gray-800">
                        {selectedContent?.title || 'Content Title'}
                      </h2>
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedContent?.content || 'Content will appear here...' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Content Selection and Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedContent?.id || ''}
            onChange={(e) => {
              const selected = content.find(c => c.id === e.target.value);
              setSelectedContent(selected || null);
            }}
            className="bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
          >
            <option value="">Select content to edit</option>
            {content.map((item) => (
              <option key={item.id} value={item.id}>
                {item.pageName} - {item.title}
              </option>
            ))}
          </select>
          
          <Button
            onClick={() => setIsPreview(!isPreview)}
            variant="outline"
            className="border-gray-600 text-gray-300"
          >
            {isPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {isPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => selectedContent && handleSave(selectedContent)}
            disabled={!selectedContent || isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Help Section */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-lightbulb text-blue-400"></i>
            <span className="font-medium text-blue-300">Visual Editor Tips</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Changes appear exactly as they will on your website</p>
            <p>• Use the preview button to see how it looks to visitors</p>
            <p>• Save frequently to keep your work safe</p>
            <p>• The rich text editor works like a word processor</p>
          </div>
        </CardContent>
      </Card>

      {/* Content Editor */}
      {selectedContent ? renderContentEditor() : (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Edit3 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Select Content to Edit</h3>
            <p className="text-gray-500">Choose a page section from the dropdown above to start editing</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}