import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, Trash2, Shield, User } from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  isActive: boolean;
  createdAt: string;
}

interface UserManagerProps {
  token: string;
}

export default function UserManager({ token }: UserManagerProps) {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [editingUser, setEditingUser] = useState<{
    id: string;
    username: string;
    password: string;
    isActive: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      // For now, we'll show a placeholder since the API isn't implemented yet
      setUsers([
        {
          id: '1',
          username: 'admin',
          isActive: true,
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (user: typeof editingUser) => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // This would be the API call when implemented
      toast({
        title: "Info",
        description: "User management API is not yet implemented",
        variant: "default",
      });
      setEditingUser(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    toast({
      title: "Info",
      description: "User deletion API is not yet implemented",
    });
  };

  const handleNewUser = () => {
    setEditingUser({
      id: '',
      username: '',
      password: '',
      isActive: true,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading users...</div>
    </div>;
  }

  if (editingUser) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">
            {editingUser.id ? 'Edit Admin User' : 'Create New Admin User'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <Input
              value={editingUser.username}
              onChange={(e) => setEditingUser({
                ...editingUser,
                username: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <Input
              type="password"
              value={editingUser.password}
              onChange={(e) => setEditingUser({
                ...editingUser,
                password: e.target.value
              })}
              className="bg-gray-700 border-gray-600 text-white"
              placeholder={editingUser.id ? "Leave blank to keep current password" : "Enter password"}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="userActive"
              checked={editingUser.isActive}
              onChange={(e) => setEditingUser({
                ...editingUser,
                isActive: e.target.checked
              })}
              className="rounded"
            />
            <label htmlFor="userActive" className="text-sm text-gray-300">
              Active (can log in to admin panel)
            </label>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingUser)}
              disabled={isSaving}
              className="bg-accent-500 hover:bg-accent-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save User'}
            </Button>
            <Button
              onClick={() => setEditingUser(null)}
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
        <h2 className="text-2xl font-bold text-gray-100">Admin Users</h2>
        <Button onClick={handleNewUser} className="bg-accent-500 hover:bg-accent-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      <div className="grid gap-4">
        {users.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No admin users found.</p>
            </CardContent>
          </Card>
        ) : (
          users.map((user) => (
            <Card key={user.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="bg-accent-500 rounded-full p-2">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        {user.username}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Created: {new Date(user.createdAt).toLocaleDateString()}</span>
                        <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
                          <Shield className="w-3 h-3 inline mr-1" />
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingUser({
                        id: user.id,
                        username: user.username,
                        password: '',
                        isActive: user.isActive
                      })}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    {user.username !== 'admin' && (
                      <Button
                        onClick={() => handleDelete(user.id)}
                        size="sm"
                        variant="destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="bg-gray-700 border-gray-600">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-amber-400">
            <Shield className="w-4 h-4" />
            <p className="text-sm">
              <strong>Note:</strong> User management APIs are being developed. 
              Currently showing existing admin user for demonstration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}