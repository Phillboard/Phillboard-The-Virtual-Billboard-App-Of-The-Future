
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code, Database, Map, Users, Zap, Key, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const APIDocsPage = () => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [email, setEmail] = useState("");

  const endpoints = [
    {
      method: "GET",
      path: "/api/phillboards",
      description: "Retrieve all phillboards in the system with optional filtering",
      parameters: [
        { name: "lat", type: "number", required: false, description: "Latitude for location-based filtering" },
        { name: "lng", type: "number", required: false, description: "Longitude for location-based filtering" },
        { name: "radius", type: "number", required: false, description: "Search radius in kilometers (default: 5)" },
        { name: "limit", type: "number", required: false, description: "Maximum number of results (default: 50, max: 500)" },
        { name: "offset", type: "number", required: false, description: "Number of results to skip for pagination" },
        { name: "placement_type", type: "string", required: false, description: "Filter by placement type (human/billboard)" },
        { name: "user_id", type: "string", required: false, description: "Filter by specific user ID" }
      ],
      response: {
        type: "object",
        example: {
          data: [
            {
              id: "550e8400-e29b-41d4-a716-446655440000",
              title: "Welcome to Charleston!",
              username: "john_doe",
              lat: 38.3498,
              lng: -81.6326,
              created_at: "2023-12-01T10:00:00Z",
              updated_at: "2023-12-01T10:00:00Z",
              image_type: "text",
              content: "Check out this amazing view!",
              placement_type: "human",
              edit_count: 3,
              last_edited_by: "jane_smith"
            }
          ],
          pagination: {
            total: 362,
            limit: 50,
            offset: 0,
            has_more: true
          }
        }
      }
    },
    {
      method: "POST",
      path: "/api/phillboards",
      description: "Create a new phillboard",
      authRequired: true,
      parameters: [
        { name: "title", type: "string", required: true, description: "Title of the phillboard (max 100 characters)" },
        { name: "lat", type: "number", required: true, description: "Latitude coordinate (-90 to 90)" },
        { name: "lng", type: "number", required: true, description: "Longitude coordinate (-180 to 180)" },
        { name: "content", type: "string", required: false, description: "Content or tagline (max 500 characters)" },
        { name: "placement_type", type: "string", required: false, description: "Type of placement (human/billboard, default: human)" },
        { name: "image_url", type: "string", required: false, description: "URL to associated image" }
      ],
      response: {
        type: "object",
        example: {
          success: true,
          data: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "New Phillboard",
            lat: 38.3498,
            lng: -81.6326,
            created_at: "2023-12-01T10:00:00Z"
          },
          message: "Phillboard created successfully"
        }
      }
    },
    {
      method: "PUT",
      path: "/api/phillboards/{id}",
      description: "Update an existing phillboard (costs 1 credit)",
      authRequired: true,
      parameters: [
        { name: "id", type: "string", required: true, description: "Phillboard ID (in URL path)" },
        { name: "title", type: "string", required: false, description: "New title (max 100 characters)" },
        { name: "content", type: "string", required: false, description: "New content or tagline (max 500 characters)" },
        { name: "image_url", type: "string", required: false, description: "New image URL" }
      ],
      response: {
        type: "object",
        example: {
          success: true,
          data: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            title: "Updated Phillboard",
            updated_at: "2023-12-01T10:00:00Z",
            edit_count: 4
          },
          message: "Phillboard updated successfully",
          credits_remaining: 24
        }
      }
    },
    {
      method: "DELETE",
      path: "/api/phillboards/{id}",
      description: "Delete a phillboard (owner only)",
      authRequired: true,
      parameters: [
        { name: "id", type: "string", required: true, description: "Phillboard ID (in URL path)" }
      ],
      response: {
        type: "object",
        example: {
          success: true,
          message: "Phillboard deleted successfully"
        }
      }
    },
    {
      method: "GET",
      path: "/api/users/{id}/profile",
      description: "Get user profile information",
      parameters: [
        { name: "id", type: "string", required: true, description: "User ID (in URL path)" }
      ],
      response: {
        type: "object",
        example: {
          data: {
            id: "550e8400-e29b-41d4-a716-446655440000",
            username: "john_doe",
            avatar_url: "https://example.com/avatar.jpg",
            created_at: "2023-11-01T10:00:00Z",
            phillboard_count: 15,
            total_edits: 42,
            credits: 25
          }
        }
      }
    },
    {
      method: "GET",
      path: "/api/stats/global",
      description: "Get global statistics about the platform",
      response: {
        type: "object",
        example: {
          total_phillboards: 1247,
          total_users: 342,
          total_edits: 892,
          active_users_24h: 67,
          phillboards_created_24h: 23,
          last_updated: "2023-12-01T10:00:00Z"
        }
      }
    },
    {
      method: "GET",
      path: "/api/stats/user/{id}",
      description: "Get statistics for a specific user",
      authRequired: true,
      parameters: [
        { name: "id", type: "string", required: true, description: "User ID (in URL path)" }
      ],
      response: {
        type: "object",
        example: {
          phillboards_created: 15,
          total_edits_made: 42,
          total_edits_received: 18,
          credits: 25,
          rank: {
            creators: 23,
            editors: 15,
            earners: 31
          }
        }
      }
    },
    {
      method: "GET",
      path: "/api/leaderboard",
      description: "Get leaderboard data",
      parameters: [
        { name: "type", type: "string", required: false, description: "Leaderboard type (creators/editors/earners, default: creators)" },
        { name: "limit", type: "number", required: false, description: "Number of results to return (default: 10, max: 100)" },
        { name: "timeframe", type: "string", required: false, description: "Time period (all/month/week, default: all)" }
      ],
      response: {
        type: "object",
        example: {
          data: [
            {
              user_id: "550e8400-e29b-41d4-a716-446655440000",
              username: "top_creator",
              avatar_url: "https://example.com/avatar.jpg",
              score: 25,
              rank: 1
            }
          ],
          leaderboard_type: "creators",
          timeframe: "all",
          total_entries: 342
        }
      }
    },
    {
      method: "POST",
      path: "/api/search",
      description: "Search phillboards with advanced filters",
      parameters: [
        { name: "query", type: "string", required: false, description: "Text search in title and content" },
        { name: "lat", type: "number", required: false, description: "Center latitude for location search" },
        { name: "lng", type: "number", required: false, description: "Center longitude for location search" },
        { name: "radius", type: "number", required: false, description: "Search radius in kilometers" },
        { name: "placement_type", type: "string", required: false, description: "Filter by placement type" },
        { name: "date_from", type: "string", required: false, description: "Start date filter (ISO 8601)" },
        { name: "date_to", type: "string", required: false, description: "End date filter (ISO 8601)" },
        { name: "sort_by", type: "string", required: false, description: "Sort field (created_at/edit_count/distance)" },
        { name: "sort_order", type: "string", required: false, description: "Sort direction (asc/desc, default: desc)" }
      ],
      response: {
        type: "object",
        example: {
          data: [],
          total_results: 45,
          search_params: {
            query: "welcome",
            radius: 10,
            sort_by: "created_at"
          }
        }
      }
    }
  ];

  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "POST": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "PUT": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "DELETE": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleRequestApiKey = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    // In a real implementation, this would send a request to generate an API key
    const mockApiKey = `pk_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    setApiKey(mockApiKey);
    toast.success("API key generated! Check your email for details.");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="container px-4 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-neon-cyan to-blue-400 bg-clip-text text-transparent">
            Phillboards API Documentation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Access phillboard data, user statistics, and location-based content through our RESTful API. 
            Perfect for building integrations, mobile apps, and data analysis tools.
          </p>
        </div>

        {/* API Key Management */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Key Management
            </CardTitle>
            <CardDescription>
              Request an API key to access protected endpoints and increase your rate limits.
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
                  className="bg-black/40 border-white/20"
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
              <div className="mt-4 p-4 bg-black/40 rounded border border-neon-cyan/30">
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
                <p className="text-xs text-gray-400 mt-2">
                  Keep this key secure and never share it publicly. Use it in the Authorization header.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <Map className="h-8 w-8 mx-auto text-neon-cyan mb-2" />
              <CardTitle className="text-sm">Location-Based</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Query phillboards by geographic coordinates and radius</p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <Users className="h-8 w-8 mx-auto text-neon-cyan mb-2" />
              <CardTitle className="text-sm">User Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Access user profiles, balances, and activity statistics</p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <Database className="h-8 w-8 mx-auto text-neon-cyan mb-2" />
              <CardTitle className="text-sm">Real-time Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Get live platform statistics and leaderboard data</p>
            </CardContent>
          </Card>

          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader className="text-center">
              <Zap className="h-8 w-8 mx-auto text-neon-cyan mb-2" />
              <CardTitle className="text-sm">Fast & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-400">Edge functions powered by Supabase for global performance</p>
            </CardContent>
          </Card>
        </div>

        {/* Base URL */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Base URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black/40 p-4 rounded border border-white/20">
              <code className="text-green-400">https://qkgkhsqfpseeljhasirb.supabase.co/functions/v1</code>
            </div>
            <p className="text-sm text-gray-400 mt-2">
              All API endpoints are relative to this base URL. Authentication is handled via Bearer tokens where required.
            </p>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-neon-cyan mb-6">API Endpoints</h2>
          
          {endpoints.map((endpoint, index) => (
            <Card key={index} className="bg-black/60 backdrop-blur-md border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Badge className={`${getMethodColor(endpoint.method)} border`}>
                    {endpoint.method}
                  </Badge>
                  <code className="text-gray-300 bg-black/40 px-2 py-1 rounded text-sm">
                    {endpoint.path}
                  </code>
                  {endpoint.authRequired && (
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                      Auth Required
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-gray-300">
                  {endpoint.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Parameters */}
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-neon-cyan mb-2">Parameters</h4>
                    <div className="space-y-2">
                      {endpoint.parameters.map((param, paramIndex) => (
                        <div key={paramIndex} className="flex items-center gap-2 text-sm">
                          <code className="bg-black/40 px-2 py-1 rounded text-green-400 min-w-0">
                            {param.name}
                          </code>
                          <Badge variant="outline" className="text-xs">
                            {param.type}
                          </Badge>
                          {param.required && (
                            <Badge variant="destructive" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <span className="text-gray-400">{param.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Example */}
                <div>
                  <h4 className="text-sm font-semibold text-neon-cyan mb-2">Response Example</h4>
                  <div className="bg-black/40 p-4 rounded border border-white/20 overflow-x-auto">
                    <pre className="text-sm text-gray-300">
                      <code>{JSON.stringify(endpoint.response.example, null, 2)}</code>
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Authentication */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan flex items-center gap-2">
              <Code className="h-5 w-5" />
              Authentication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Some endpoints require authentication. Include your API key in the Authorization header:
            </p>
            <div className="bg-black/40 p-4 rounded border border-white/20">
              <code className="text-green-400">
                Authorization: Bearer YOUR_API_KEY
              </code>
            </div>
            <p className="text-sm text-gray-400">
              Request an API key using the form above. API keys provide access to protected endpoints and higher rate limits.
            </p>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 p-4 rounded border border-white/20">
                <h4 className="font-semibold text-red-400 mb-2">Anonymous</h4>
                <p className="text-sm text-gray-300">100 requests per hour</p>
                <p className="text-xs text-gray-400">Public endpoints only</p>
              </div>
              <div className="bg-black/40 p-4 rounded border border-white/20">
                <h4 className="font-semibold text-green-400 mb-2">API Key</h4>
                <p className="text-sm text-gray-300">1,000 requests per hour</p>
                <p className="text-xs text-gray-400">All endpoints accessible</p>
              </div>
              <div className="bg-black/40 p-4 rounded border border-white/20">
                <h4 className="font-semibold text-blue-400 mb-2">Premium</h4>
                <p className="text-sm text-gray-300">10,000 requests per hour</p>
                <p className="text-xs text-gray-400">Priority support included</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">400</code>
                <span className="text-gray-300">Bad Request - Invalid parameters</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">401</code>
                <span className="text-gray-300">Unauthorized - Invalid or missing API key</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">403</code>
                <span className="text-gray-300">Forbidden - Insufficient permissions</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">404</code>
                <span className="text-gray-300">Not Found - Resource doesn't exist</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">429</code>
                <span className="text-gray-300">Too Many Requests - Rate limit exceeded</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-black/40 rounded">
                <code className="text-red-400">500</code>
                <span className="text-gray-300">Internal Server Error - Server issue</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIDocsPage;
