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
import { GripVertical, Plus, Edit, Trash2, Save, X } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
  icon?: string;
}

interface DragDropNavigationProps {
  token: string;
}

function SortableItem({ id, item, onEdit, onDelete }: { 
  id: string; 
  item: NavigationItem; 
  onEdit: (item: NavigationItem) => void; 
  onDelete: (id: string) => void; 
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
        </div>
        <div className="text-sm text-gray-400">{item.url}</div>
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

export default function DragDropNavigation({ token }: DragDropNavigationProps) {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchNavigationItems();
  }, []);

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

  const handleAddNew = () => {
    const newItem: NavigationItem = {
      id: `new-${Date.now()}`,
      label: '',
      url: '',
      order: items.length + 1,
      isActive: true,
      icon: 'fas fa-link'
    };
    setEditingItem(newItem);
  };

  return (
    <div className="space-y-6">
      {/* Help Section */}
      <Card className="bg-green-900/20 border-green-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <i className="fas fa-info-circle text-green-400"></i>
            <span className="font-medium text-green-300">Drag & Drop Navigation</span>
          </div>
          <div className="text-sm text-gray-300 space-y-1">
            <p>• Grab the ⋮⋮ handle to drag items up or down to reorder</p>
            <p>• Your website menu will update automatically</p>
            <p>• Hide items by setting them to inactive</p>
            <p>• Use clear, simple names that visitors understand</p>
          </div>
        </CardContent>
      </Card>

      {/* Add New Button */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">Website Menu Items</h3>
          <p className="text-gray-400">Drag to reorder, click to edit</p>
        </div>
        <Button onClick={handleAddNew} className="bg-accent-500 hover:bg-accent-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Menu Item
        </Button>
      </div>

      {/* Edit Form */}
      {editingItem && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">
              {editingItem.id.startsWith('new-') ? 'Add New Menu Item' : 'Edit Menu Item'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Menu Text *
                </label>
                <Input
                  value={editingItem.label}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="Home, Services, Contact, etc."
                />
                <p className="text-xs text-gray-500 mt-1">What visitors see in the menu</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Link URL *
                </label>
                <Input
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="/, /services, /contact, etc."
                />
                <p className="text-xs text-gray-500 mt-1">Page this menu item links to</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Icon (optional)
                </label>
                <Input
                  value={editingItem.icon || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, icon: e.target.value })}
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="fas fa-home, fas fa-cog, etc."
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center space-x-2 text-gray-300">
                  <input
                    type="checkbox"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="rounded border-gray-600 bg-gray-700"
                  />
                  <span>Show in menu</span>
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => handleSaveItem(editingItem)}
                disabled={isSaving || !editingItem.label || !editingItem.url}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => setEditingItem(null)}
                variant="outline"
                className="border-gray-600 text-gray-300"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Items List */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <i className="fas fa-bars text-accent-400"></i>
            Current Menu Items
            {isSaving && <span className="text-sm text-yellow-400">(Saving order...)</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-3">
                {items.map((item) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    item={item}
                    onEdit={setEditingItem}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <i className="fas fa-mouse-pointer text-3xl mb-4"></i>
              <p>No navigation items yet. Click "Add Menu Item" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}