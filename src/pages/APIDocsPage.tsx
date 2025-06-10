
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code, Database, Map, Users, Zap } from "lucide-react";

const APIDocsPage = () => {
  const endpoints = [
    {
      method: "GET",
      path: "/api/phillboards",
      description: "Retrieve all phillboards in the system",
      parameters: [
        { name: "lat", type: "number", required: false, description: "Latitude for location-based filtering" },
        { name: "lng", type: "number", required: false, description: "Longitude for location-based filtering" },
        { name: "radius", type: "number", required: false, description: "Search radius in kilometers" }
      ],
      response: {
        type: "array",
        example: {
          data: [
            {
              id: "uuid",
              title: "Welcome to Charleston!",
              username: "john_doe",
              lat: 38.3498,
              lng: -81.6326,
              created_at: "2023-12-01T10:00:00Z",
              image_type: "text",
              content: "Check out this amazing view!",
              placement_type: "human"
            }
          ]
        }
      }
    },
    {
      method: "POST",
      path: "/api/phillboards",
      description: "Create a new phillboard",
      authRequired: true,
      parameters: [
        { name: "title", type: "string", required: true, description: "Title of the phillboard" },
        { name: "lat", type: "number", required: true, description: "Latitude coordinate" },
        { name: "lng", type: "number", required: true, description: "Longitude coordinate" },
        { name: "content", type: "string", required: false, description: "Content or tagline" },
        { name: "placement_type", type: "string", required: false, description: "Type of placement (human/billboard)" }
      ],
      response: {
        type: "object",
        example: {
          success: true,
          data: {
            id: "uuid",
            title: "New Phillboard",
            message: "Phillboard created successfully"
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
          last_updated: "2023-12-01T10:00:00Z"
        }
      }
    },
    {
      method: "GET",
      path: "/api/leaderboard",
      description: "Get leaderboard data",
      parameters: [
        { name: "type", type: "string", required: false, description: "Leaderboard type (creators/editors/earners)" },
        { name: "limit", type: "number", required: false, description: "Number of results to return (default: 10)" }
      ],
      response: {
        type: "array",
        example: {
          data: [
            {
              user_id: "uuid",
              username: "top_creator",
              avatar_url: "https://...",
              score: 25
            }
          ]
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
              <code className="text-green-400">https://your-project.supabase.co/functions/v1</code>
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
              Contact the admin to get an API key for your application.
            </p>
          </CardContent>
        </Card>

        {/* Rate Limits */}
        <Card className="bg-black/60 backdrop-blur-md border-white/10 mt-8">
          <CardHeader>
            <CardTitle className="text-neon-cyan">Rate Limits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-black/40 p-4 rounded border border-white/20">
                <h4 className="font-semibold text-green-400 mb-2">Free Tier</h4>
                <p className="text-sm text-gray-300">1,000 requests per hour</p>
              </div>
              <div className="bg-black/40 p-4 rounded border border-white/20">
                <h4 className="font-semibold text-blue-400 mb-2">Authenticated</h4>
                <p className="text-sm text-gray-300">10,000 requests per hour</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default APIDocsPage;
