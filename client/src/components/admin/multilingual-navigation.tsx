import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { GripVertical, Plus, Edit, Trash2, Save, X, Globe } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  order: number;
  isActive: boolean;
  icon?: string;
  translations?: { [key: string]: string }; // language code -> translated label
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  isActive: boolean;
  isDefault: boolean;
}

interface MultilingualNavigationProps {
  token: string;
}

function SortableItem({ 
  id, 
  item, 
  onEdit, 
  onDelete,
  languages
}: { 
  id: string; 
  item: NavigationItem; 
  onEdit: (item: NavigationItem) => void; 
  onDelete: (id: string) => void; 
  languages: Language[];
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-gray-700 border border-gray-600 rounded-lg p-4 flex items-center gap-4 hover:bg-gray-650 transition-colors"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab hover:cursor-grabbing text-gray-400 hover:text-gray-200"
      >
        <GripVertical className="w-5 h-5" />
      </div>
      
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {item.icon && <i className={`${item.icon} text-accent-400`}></i>}
          <span className="font-medium text-white">{item.label}</span>
          {!item.isActive && (
            <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">Hidden</span>
          )}
          <Globe className="w-4 h-4 text-gray-400" />
        </div>
        <div className="text-sm text-gray-400 mb-1">{item.href}</div>
        {item.translations && Object.keys(item.translations).length > 0 && (
          <div className="flex flex-wrap gap-1">
            {languages.map(lang => 
              item.translations?.[lang.code] && (
                <span key={lang.code} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                  {lang.code.toUpperCase()}: {item.translations[lang.code]}
                </span>
              )
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(item)}
          className="text-gray-400 hover:text-white hover:bg-gray-600"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(item.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

export default function MultilingualNavigation({ token }: MultilingualNavigationProps) {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchNavigationItems(), fetchLanguages()]);
    setIsLoading(false);
  };

  const fetchNavigationItems = async () => {
    try {
      const response = await fetch('/api/admin/navigation', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.sort((a: NavigationItem, b: NavigationItem) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching navigation items:', error);
    }
  };

  const fetchLanguages = async () => {
    try {
      const response = await fetch('/api/admin/languages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setLanguages(data);
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleDragEnd = async (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = items.findIndex(item => item.id === active.id);
      const newIndex = items.findIndex(item => item.id === over.id);
      
      const newItems = arrayMove(items, oldIndex, newIndex);
      
      // Update order values
      const updatedItems = newItems.map((item, index) => ({
        ...item,
        order: index + 1
      }));
      
      setItems(updatedItems);
      
      // Save to server
      try {
        setIsSaving(true);
        await Promise.all(
          updatedItems.map(item =>
            fetch(`/api/admin/navigation/${item.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify(item),
            })
          )
        );
        
        toast({
          title: "Order Updated",
          description: "Navigation menu order saved successfully",
        });
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Could not save new order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleSaveItem = async (item: NavigationItem) => {
    setIsSaving(true);
    try {
      const url = item.id.startsWith('new-') 
        ? '/api/admin/navigation' 
        : `/api/admin/navigation/${item.id}`;
      const method = item.id.startsWith('new-') ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(item),
      });

      if (response.ok) {
        toast({
          title: "Saved Successfully",
          description: "Navigation item updated",
        });
        await fetchNavigationItems();
        setEditingItem(null);
      }
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Could not save navigation item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;

    try {
      await fetch(`/api/admin/navigation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      
      toast({
        title: "Deleted",
        description: "Navigation item removed",
      });
      await fetchNavigationItems();
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Could not delete navigation item",
        variant: "destructive",
      });
    }
  };

  const handleNewItem = () => {
    setEditingItem({
      id: `new-${Date.now()}`,
      label: '',
      href: '',
      order: items.length + 1,
      isActive: true,
      icon: 'fas fa-link',
      translations: {}
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-accent-500 mb-4"></i>
          <p className="text-gray-400">Loading navigation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">Navigation Menu</h3>
          <p className="text-gray-400">Drag and drop to reorder. Edit for multilingual support.</p>
        </div>
        <Button
          onClick={handleNewItem}
          className="bg-accent-500 hover:bg-accent-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {isSaving && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-center gap-2">
          <i className="fas fa-spinner fa-spin text-blue-400"></i>
          <span className="text-blue-300">Saving changes...</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={handleDelete}
                languages={languages}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {items.length === 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="text-center py-8">
            <Globe className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No navigation items found</p>
            <Button onClick={handleNewItem} className="bg-accent-500 hover:bg-accent-600">
              <Plus className="w-4 h-4 mr-2" />
              Create First Menu Item
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="bg-gray-800 border-gray-700 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Edit className="w-5 h-5" />
                {editingItem.id.startsWith('new-') ? 'Add New Menu Item' : 'Edit Menu Item'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="label" className="text-gray-300">
                    Menu Label (Default)
                  </Label>
                  <Input
                    id="label"
                    value={editingItem.label}
                    onChange={(e) => setEditingItem({...editingItem, label: e.target.value})}
                    placeholder="Home, Services, About..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="href" className="text-gray-300">
                    Link URL
                  </Label>
                  <Input
                    id="href"
                    value={editingItem.href}
                    onChange={(e) => setEditingItem({...editingItem, href: e.target.value})}
                    placeholder="#home, /services, https://..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="icon" className="text-gray-300">
                    Icon (Font Awesome)
                  </Label>
                  <Input
                    id="icon"
                    value={editingItem.icon || ''}
                    onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
                    placeholder="fas fa-home, fas fa-cog..."
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="flex items-center space-x-2 pt-6">
                  <Switch
                    id="active"
                    checked={editingItem.isActive}
                    onCheckedChange={(checked) => setEditingItem({...editingItem, isActive: checked})}
                  />
                  <Label htmlFor="active" className="text-gray-300">
                    Show in menu
                  </Label>
                </div>
              </div>

              {/* Multilingual translations */}
              <div>
                <Label className="text-gray-300 mb-3 block">
                  <Globe className="w-4 h-4 inline mr-2" />
                  Translations
                </Label>
                <Tabs defaultValue={languages.find(l => l.isDefault)?.code || 'en'} className="w-full">
                  <TabsList className="bg-gray-700 border-gray-600 mb-4">
                    {languages.filter(l => l.isActive).map((lang) => (
                      <TabsTrigger key={lang.code} value={lang.code} className="data-[state=active]:bg-accent-500">
                        {lang.nativeName}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {languages.filter(l => l.isActive).map((lang) => (
                    <TabsContent key={lang.code} value={lang.code}>
                      <Input
                        value={editingItem.translations?.[lang.code] || ''}
                        onChange={(e) => setEditingItem({
                          ...editingItem,
                          translations: {
                            ...editingItem.translations,
                            [lang.code]: e.target.value
                          }
                        })}
                        placeholder={`Menu label in ${lang.nativeName}...`}
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="border-gray-600"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={() => handleSaveItem(editingItem)}
                  disabled={isSaving || !editingItem.label || !editingItem.href}
                  className="bg-accent-500 hover:bg-accent-600"
                >
                  {isSaving ? (
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}