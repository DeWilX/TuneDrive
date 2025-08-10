import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface PageContent {
  id: string;
  pageName: string;
  title: string;
  subtitle?: string;
  content: any; // JSONB content structure
  isActive: boolean;
  updatedAt: string;
}

interface PageEditorProps {
  token: string;
}

export default function PageEditor({ token }: PageEditorProps) {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Quill editor configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
      [{size: []}],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, 
       {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/admin/page-content', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setPages(data);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (page: PageContent) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/page-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(page),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Page saved successfully",
        });
        await fetchPages();
        setEditingPage(null);
      } else {
        throw new Error('Failed to save page');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewPage = () => {
    setEditingPage({
      id: '',
      pageName: '',
      title: '',
      subtitle: '',
      content: {
        sections: [],
        htmlContent: '',
      },
      isActive: true,
      updatedAt: '',
    });
  };

  const handleContentChange = (value: string) => {
    if (editingPage) {
      setEditingPage({
        ...editingPage,
        content: {
          ...editingPage.content,
          htmlContent: value,
        }
      });
    }
  };

  const handleInitDefaultContent = async () => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/admin/init-default-content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Default page content initialized successfully",
        });
        await fetchPages();
      } else {
        throw new Error('Failed to initialize default content');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize default content",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const predefinedPages = [
    {
      pageName: 'hero-section',
      title: 'Hero Section',
      description: 'Main homepage hero section with title, subtitle and CTA'
    },
    {
      pageName: 'about-section',
      title: 'About Section', 
      description: 'About us content and company information'
    },
    {
      pageName: 'services-overview',
      title: 'Services Overview',
      description: 'Services section introduction content'
    },
    {
      pageName: 'power-calculator-section',
      title: 'Power Calculator Section',
      description: 'Power calculator introduction and description'
    },
    {
      pageName: 'testimonials-section',
      title: 'Testimonials Section',
      description: 'Customer testimonials and reviews'
    },
    {
      pageName: 'contact-section',
      title: 'Contact Section',
      description: 'Contact form and contact information'
    },
    {
      pageName: 'footer-content',
      title: 'Footer Content',
      description: 'Footer links, legal information and company details'
    }
  ];

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading pages...</div>
    </div>;
  }

  if (editingPage) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">
            {editingPage.id ? 'Edit Page' : 'Create New Page'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page Name (URL slug)
            </label>
            <Input
              value={editingPage.pageName}
              onChange={(e) => setEditingPage({
                ...editingPage,
                pageName: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., about-us, services, contact"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Page Title
            </label>
            <Input
              value={editingPage.title}
              onChange={(e) => setEditingPage({
                ...editingPage,
                title: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Page title for SEO"
            />
          </div>

          <div>
            <Label htmlFor="subtitle" className="text-gray-300">Subtitle</Label>
            <Input
              id="subtitle"
              value={editingPage.subtitle || ''}
              onChange={(e) => setEditingPage({
                ...editingPage,
                subtitle: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Page subtitle"
            />
          </div>

          <div>
            <Label className="text-gray-300 block mb-4">Visual Content Editor</Label>
            <div className="bg-gray-900 rounded-lg p-4 border border-gray-600">
              <ReactQuill
                theme="snow"
                value={editingPage.content?.htmlContent || ''}
                onChange={handleContentChange}
                modules={modules}
                formats={formats}
                style={{
                  backgroundColor: '#1f2937',
                  color: 'white',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem',
                }}
                placeholder="Create your page content with the visual editor..."
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingPage)}
              disabled={isSaving}
              className="bg-accent-500 hover:bg-accent-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Page'}
            </Button>
            <Button
              onClick={() => setEditingPage(null)}
              variant="outline"
              className="border-gray-600"
            >
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-100">Page Management</h2>
        <div className="flex gap-2">
          <Button onClick={handleInitDefaultContent} variant="outline" className="border-gray-600">
            Initialize Default Content
          </Button>
          <Button onClick={handleNewPage} className="bg-accent-500 hover:bg-accent-600">
            <Plus className="w-4 h-4 mr-2" />
            Create New Page
          </Button>
        </div>
      </div>

      {/* Quick Templates Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {predefinedPages.map((template) => (
              <div key={template.pageName} className="p-4 bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-100 mb-2">{template.title}</h4>
                <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                <Button
                  size="sm"
                  onClick={() => {
                    const existingPage = pages.find(p => p.pageName === template.pageName);
                    if (existingPage) {
                      setEditingPage(existingPage);
                    } else {
                      setEditingPage({
                        id: '',
                        pageName: template.pageName,
                        title: template.title,
                        subtitle: '',
                        content: {
                          sections: [],
                          htmlContent: `<h2>${template.title}</h2><p>Start editing this section...</p>`,
                        },
                        isActive: true,
                        updatedAt: '',
                      });
                    }
                  }}
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  {pages.find(p => p.pageName === template.pageName) ? 'Edit' : 'Create'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {pages.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No pages found. Use the quick templates above to get started!</p>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-100 mb-2">
                      {page.title || page.pageName}
                    </h3>
                    <p className="text-sm text-gray-400 mb-2">
                      URL: /{page.pageName}
                    </p>
                    {page.content?.metaDescription && (
                      <p className="text-sm text-gray-500 mb-2">
                        {page.content.metaDescription}
                      </p>
                    )}
                    <div className="text-xs text-gray-600">
                      Status: {page.isActive ? 'Published' : 'Draft'}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingPage(page)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}