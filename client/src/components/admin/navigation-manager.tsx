import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, Trash2, Move, GripVertical } from "lucide-react";

interface NavigationItem {
  id: string;
  label: string;
  url: string;
  order: number;
  isActive: boolean;
}

interface NavigationManagerProps {
  token: string;
}

export default function NavigationManager({ token }: NavigationManagerProps) {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: NavigationItem) => {
    setIsSaving(true);
    try {
      const url = item.id ? `/api/admin/navigation/${item.id}` : '/api/admin/navigation';
      const method = item.id ? 'PUT' : 'POST';
      
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
          title: "Success",
          description: "Navigation item saved successfully",
        });
        await fetchItems();
        setEditingItem(null);
      } else {
        throw new Error('Failed to save navigation item');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save navigation item",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return;
    
    try {
      const response = await fetch(`/api/admin/navigation/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Navigation item deleted successfully",
        });
        await fetchItems();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete navigation item",
        variant: "destructive",
      });
    }
  };

  const handleNewItem = () => {
    const maxOrder = items.length > 0 ? Math.max(...items.map(i => i.order)) : 0;
    setEditingItem({
      id: '',
      label: '',
      url: '',
      order: maxOrder + 1,
      isActive: true,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading navigation items...</div>
    </div>;
  }

  if (editingItem) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">
            {editingItem.id ? 'Edit Navigation Item' : 'Create New Navigation Item'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Label
            </label>
            <Input
              value={editingItem.label}
              onChange={(e) => setEditingItem({
                ...editingItem,
                label: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., Home, About, Services"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              URL
            </label>
            <Input
              value={editingItem.url}
              onChange={(e) => setEditingItem({
                ...editingItem,
                url: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="e.g., /, /about, /services, https://external.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Order
            </label>
            <Input
              type="number"
              value={editingItem.order}
              onChange={(e) => setEditingItem({
                ...editingItem,
                order: parseInt(e.target.value) || 0
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Display order (lower numbers first)"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={editingItem.isActive}
              onChange={(e) => setEditingItem({
                ...editingItem,
                isActive: e.target.checked
              })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm text-gray-300">
              Active (visible in navigation)
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingItem)}
              disabled={isSaving}
              className="bg-accent-500 hover:bg-accent-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Item'}
            </Button>
            <Button
              onClick={() => setEditingItem(null)}
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
        <h2 className="text-2xl font-bold text-gray-100">Navigation Management</h2>
        <Button onClick={handleNewItem} className="bg-accent-500 hover:bg-accent-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Navigation Item
        </Button>
      </div>

      <div className="grid gap-4">
        {items.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No navigation items found. Add your first item!</p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-gray-500">
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-400 mb-2">
                        URL: {item.url}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Order: {item.order}</span>
                        <span className={item.isActive ? 'text-green-400' : 'text-red-400'}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingItem(item)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(item.id)}
                      size="sm"
                      variant="destructive"
                    >
                      <Trash2 className="w-4 h-4" />
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