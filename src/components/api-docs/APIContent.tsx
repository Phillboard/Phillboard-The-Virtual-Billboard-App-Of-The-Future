
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Copy, Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface APIContentProps {
  activeSection: string;
}

export function APIContent({ activeSection }: APIContentProps) {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");

  const handleRequestApiKey = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    const mockApiKey = `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(mockApiKey);
    toast.success("API key generated! Check your email for details.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "POST": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PUT": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "introduction":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">Introduction</h1>
              <p className="text-gray-300 text-lg mb-6">
                All of your database stored procedures are available on your API. This means you can build your logic directly into the 
                database (if you're brave enough)!
              </p>
              <p className="text-gray-300 mb-4">
                The API endpoint supports POST (and in some cases GET) to execute the function.
              </p>
            </div>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Base URL</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-green-400">https://qkgkhsqfpseeljhasirb.supabase.co/functions/v1</code>
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  All API endpoints are relative to this base URL. Authentication is handled via Bearer tokens where required.
                </p>
              </CardContent>
            </Card>
          </div>
        );

      case "authentication":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">Authentication</h1>
              <p className="text-gray-300 mb-6">
                Request an API key to access protected endpoints and increase your rate limits.
              </p>
            </div>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-cyan flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key Request
                </CardTitle>
                <CardDescription>
                  Enter your email to receive an API key for accessing protected endpoints.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <Input
                      type="email"
                      placeholder="your-email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-gray-800 border-gray-600"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button 
                      onClick={handleRequestApiKey}
                      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan w-full"
                    >
                      Request API Key
                    </Button>
                  </div>
                </div>
                
                {apiKey && (
                  <div className="mt-4 p-4 bg-gray-900 rounded border border-neon-cyan/30">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-neon-cyan">Your API Key</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="h-6 w-6 p-0"
                        >
                          {showApiKey ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(apiKey)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <code className="text-sm text-gray-300 break-all">
                      {showApiKey ? apiKey : apiKey.replace(/./g, '•')}
                    </code>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Using Your API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  Include your API key in the Authorization header:
                </p>
                <div className="bg-gray-900 p-4 rounded border border-gray-600">
                  <code className="text-green-400">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "phillboards":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">Phillboards API</h1>
              <p className="text-gray-300 mb-6">
                Manage phillboards - create, read, update, and delete phillboard data.
              </p>
            </div>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className="bg-green-500/20 text-green-400 border border-green-500/30">
                    GET
                  </Badge>
                  <code className="text-gray-300 bg-gray-800 px-2 py-1 rounded text-sm">
                    /api/phillboards
                  </code>
                </div>
                <CardDescription className="text-gray-300">
                  Retrieve all phillboards in the system with optional filtering
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-neon-cyan mb-2">Parameters</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <code className="bg-gray-800 px-2 py-1 rounded text-green-400">lat</code>
                        <Badge variant="outline" className="text-xs">number</Badge>
                        <span className="text-gray-400">Latitude for location-based filtering</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="bg-gray-800 px-2 py-1 rounded text-green-400">lng</code>
                        <Badge variant="outline" className="text-xs">number</Badge>
                        <span className="text-gray-400">Longitude for location-based filtering</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <code className="bg-gray-800 px-2 py-1 rounded text-green-400">radius</code>
                        <Badge variant="outline" className="text-xs">number</Badge>
                        <span className="text-gray-400">Search radius in kilometers (default: 5)</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-neon-cyan mb-2">Response Example</h4>
                    <div className="bg-gray-900 p-4 rounded border border-gray-600 overflow-x-auto">
                      <pre className="text-sm text-gray-300">
                        <code>{JSON.stringify({
                          data: [
                            {
                              id: "550e8400-e29b-41d4-a716-446655440000",
                              title: "Welcome to Charleston!",
                              username: "john_doe",
                              lat: 38.3498,
                              lng: -81.6326,
                              created_at: "2023-12-01T10:00:00Z",
                              placement_type: "human"
                            }
                          ],
                          pagination: {
                            total: 362,
                            limit: 50,
                            offset: 0
                          }
                        }, null, 2)}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case "table-phillboards":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">phillboards</h1>
              <p className="text-gray-300 mb-6">
                Main table storing all phillboard data including location, content, and metadata.
              </p>
            </div>

            <Card className="bg-black/40 border-gray-700">
              <CardHeader>
                <CardTitle className="text-neon-cyan">Table Structure</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-600">
                        <th className="text-left py-2 text-neon-cyan">Column</th>
                        <th className="text-left py-2 text-neon-cyan">Type</th>
                        <th className="text-left py-2 text-neon-cyan">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-gray-300">
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">id</code></td>
                        <td className="py-2">uuid</td>
                        <td className="py-2">Primary key</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">title</code></td>
                        <td className="py-2">text</td>
                        <td className="py-2">Phillboard title</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">lat</code></td>
                        <td className="py-2">double precision</td>
                        <td className="py-2">Latitude coordinate</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">lng</code></td>
                        <td className="py-2">double precision</td>
                        <td className="py-2">Longitude coordinate</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">user_id</code></td>
                        <td className="py-2">uuid</td>
                        <td className="py-2">Creator user ID</td>
                      </tr>
                      <tr className="border-b border-gray-700">
                        <td className="py-2"><code className="bg-gray-800 px-1 rounded">placement_type</code></td>
                        <td className="py-2">text</td>
                        <td className="py-2">Type: human, billboard, building</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-neon-cyan mb-4">API Documentation</h1>
              <p className="text-gray-300 mb-6">
                Select a section from the sidebar to view detailed documentation.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-8">
      {renderContent()}
    </div>
  );
}
