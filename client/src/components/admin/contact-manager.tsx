import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Save, Trash2, Phone, Mail, MapPin, Globe } from "lucide-react";

interface ContactInfo {
  id: string;
  type: 'phone' | 'email' | 'address' | 'hours' | 'social';
  label: string;
  value: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

interface ContactManagerProps {
  token: string;
}

export default function ContactManager({ token }: ContactManagerProps) {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/admin/contact-info', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setContacts(data.sort((a: ContactInfo, b: ContactInfo) => a.order - b.order));
      }
    } catch (error) {
      console.error('Error fetching contact info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (contact: ContactInfo) => {
    setIsSaving(true);
    try {
      const url = contact.id ? `/api/admin/contact-info/${contact.id}` : '/api/admin/contact-info';
      const method = contact.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contact information saved successfully",
        });
        await fetchContacts();
        setEditingContact(null);
      } else {
        throw new Error('Failed to save contact information');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save contact information",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact information?')) return;
    
    try {
      const response = await fetch(`/api/admin/contact-info/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Contact information deleted successfully",
        });
        await fetchContacts();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete contact information",
        variant: "destructive",
      });
    }
  };

  const handleNewContact = () => {
    const maxOrder = contacts.length > 0 ? Math.max(...contacts.map(c => c.order)) : 0;
    setEditingContact({
      id: '',
      type: 'phone',
      label: '',
      value: '',
      order: maxOrder + 1,
      isActive: true,
    });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'phone': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'address': return <MapPin className="w-4 h-4" />;
      case 'social': return <Globe className="w-4 h-4" />;
      default: return <Phone className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="text-gray-400">Loading contact information...</div>
    </div>;
  }

  if (editingContact) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-gray-100">
            {editingContact.id ? 'Edit Contact Information' : 'Add Contact Information'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Type
              </label>
              <select
                value={editingContact.type}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  type: e.target.value as ContactInfo['type']
                })}
                className="w-full bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="address">Address</option>
                <option value="hours">Business Hours</option>
                <option value="social">Social Media</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Label
              </label>
              <Input
                value={editingContact.label}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  label: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="e.g., Main Phone, Support Email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Value
            </label>
            {editingContact.type === 'address' || editingContact.type === 'hours' ? (
              <Textarea
                value={editingContact.value}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  value: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder="Enter the contact information"
                rows={3}
              />
            ) : (
              <Input
                value={editingContact.value}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  value: e.target.value
                })}
                className="bg-gray-700 border-gray-600 text-white"
                placeholder={
                  editingContact.type === 'phone' ? '+371 12345678' :
                  editingContact.type === 'email' ? 'info@chiptuningpro.lv' :
                  editingContact.type === 'social' ? 'https://facebook.com/chiptuningpro' :
                  'Contact information'
                }
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Order
              </label>
              <Input
                type="number"
                value={editingContact.order}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  order: parseInt(e.target.value) || 0
                })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="flex items-center gap-2 pt-7">
              <input
                type="checkbox"
                id="contactActive"
                checked={editingContact.isActive}
                onChange={(e) => setEditingContact({
                  ...editingContact,
                  isActive: e.target.checked
                })}
                className="rounded"
              />
              <label htmlFor="contactActive" className="text-sm text-gray-300">
                Active (visible on website)
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleSave(editingContact)}
              disabled={isSaving}
              className="bg-accent-500 hover:bg-accent-600"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Contact Info'}
            </Button>
            <Button
              onClick={() => setEditingContact(null)}
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
        <h2 className="text-2xl font-bold text-gray-100">Contact Information</h2>
        <Button onClick={handleNewContact} className="bg-accent-500 hover:bg-accent-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Contact Info
        </Button>
      </div>

      <div className="grid gap-4">
        {contacts.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="text-center py-8">
              <p className="text-gray-400">No contact information found. Add your first contact method!</p>
            </CardContent>
          </Card>
        ) : (
          contacts.map((contact) => (
            <Card key={contact.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="text-accent-400 mt-1">
                      {getIcon(contact.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100 mb-1">
                        {contact.label}
                      </h3>
                      <div className="text-gray-300 mb-2">
                        {contact.type === 'address' || contact.type === 'hours' ? (
                          <pre className="whitespace-pre-wrap text-sm">{contact.value}</pre>
                        ) : (
                          <span className="text-sm">{contact.value}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Type: {contact.type}</span>
                        <span>Order: {contact.order}</span>
                        <span className={contact.isActive ? 'text-green-400' : 'text-red-400'}>
                          {contact.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setEditingContact(contact)}
                      size="sm"
                      variant="outline"
                      className="border-gray-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(contact.id)}
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