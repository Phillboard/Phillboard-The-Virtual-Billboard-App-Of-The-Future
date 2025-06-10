
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Eye, EyeOff, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface APIKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used: string | null;
  requests_count: number;
  status: "active" | "revoked";
}

export function APIKeyManager() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);

  // Mock data - in real implementation, this would fetch from Supabase
  useEffect(() => {
    const mockKeys: APIKey[] = [
      {
        id: "1",
        name: "Production API",
        key: "pk_live_abcdef123456789",
        created_at: "2023-11-15T10:30:00Z",
        last_used: "2023-12-01T14:22:00Z",
        requests_count: 15420,
        status: "active"
      },
      {
        id: "2",
        name: "Mobile App",
        key: "pk_live_xyz789456123abc",
        created_at: "2023-11-20T16:45:00Z",
        last_used: "2023-12-01T09:15:00Z",
        requests_count: 8930,
        status: "active"
      },
      {
        id: "3",
        name: "Test Integration",
        key: "pk_test_def456789123xyz",
        created_at: "2023-11-10T12:00:00Z",
        last_used: null,
        requests_count: 0,
        status: "revoked"
      }
    ];
    setApiKeys(mockKeys);
  }, []);

  const generateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error("Please enter a name for the API key");
      return;
    }

    setIsCreating(true);
    
    // Simulate API call
    setTimeout(() => {
      const newKey: APIKey = {
        id: Math.random().toString(36).substring(2, 15),
        name: newKeyName,
        key: `pk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`,
        created_at: new Date().toISOString(),
        last_used: null,
        requests_count: 0,
        status: "active"
      };
      
      setApiKeys([newKey, ...apiKeys]);
      setNewKeyName("");
      setIsCreating(false);
      toast.success("API key created successfully");
    }, 1000);
  };

  const revokeApiKey = (keyId: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === keyId ? { ...key, status: "revoked" as const } : key
    ));
    toast.success("API key revoked");
  };

  const deleteApiKey = (keyId: string) => {
    setApiKeys(apiKeys.filter(key => key.id !== keyId));
    toast.success("API key deleted");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("API key copied to clipboard");
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const maskKey = (key: string) => {
    return key.substring(0, 8) + '•'.repeat(key.length - 12) + key.substring(key.length - 4);
  };

  return (
    <Card className="bg-black/60 backdrop-blur-md border-white/10">
      <CardHeader>
        <CardTitle className="text-neon-cyan flex items-center gap-2">
          <Key className="h-5 w-5" />
          API Key Management
        </CardTitle>
        <CardDescription>
          Create and manage API keys for accessing the Phillboards API. Each key provides authenticated access to protected endpoints.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create new API key */}
        <div className="p-4 border border-white/10 rounded-lg bg-black/20">
          <h3 className="font-semibold mb-3">Create New API Key</h3>
          <div className="flex gap-3">
            <Input
              placeholder="Enter key name (e.g., 'Production App')"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="bg-black/40 border-white/20"
            />
            <Button
              onClick={generateApiKey}
              disabled={isCreating || !newKeyName.trim()}
              className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan whitespace-nowrap"
            >
              <Plus className="h-4 w-4 mr-2" />
              {isCreating ? "Creating..." : "Create Key"}
            </Button>
          </div>
        </div>

        {/* API Keys List */}
        <div className="space-y-4">
          <h3 className="font-semibold">Existing API Keys</h3>
          
          {apiKeys.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <Key className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No API keys created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 border border-white/10 rounded-lg bg-black/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{apiKey.name}</h4>
                        <Badge variant={apiKey.status === "active" ? "default" : "destructive"}>
                          {apiKey.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        Created: {formatDate(apiKey.created_at)}
                        {apiKey.last_used && (
                          <span className="ml-4">
                            Last used: {formatDate(apiKey.last_used)}
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-400">
                        Requests: {apiKey.requests_count.toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                        className="h-8 w-8 p-0"
                      >
                        {visibleKeys.has(apiKey.id) ? 
                          <EyeOff className="h-4 w-4" /> : 
                          <Eye className="h-4 w-4" />
                        }
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(apiKey.key)}
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      {apiKey.status === "active" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => revokeApiKey(apiKey.id)}
                          className="h-8 w-8 p-0 text-yellow-400 hover:text-yellow-300"
                        >
                          <Key className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteApiKey(apiKey.id)}
                        className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 p-3 rounded border border-white/20">
                    <code className="text-sm text-gray-300 break-all">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Usage Statistics */}
        <div className="p-4 border border-white/10 rounded-lg bg-black/20">
          <h3 className="font-semibold mb-3">Usage Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-neon-cyan">
                {apiKeys.filter(key => key.status === "active").length}
              </div>
              <div className="text-sm text-gray-400">Active Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {apiKeys.reduce((sum, key) => sum + key.requests_count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {apiKeys.filter(key => key.last_used).length}
              </div>
              <div className="text-sm text-gray-400">Used Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {apiKeys.filter(key => key.status === "revoked").length}
              </div>
              <div className="text-sm text-gray-400">Revoked Keys</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
