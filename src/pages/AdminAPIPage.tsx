
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Code, Play, Save, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const AdminAPIPage = () => {
  const { user, isAdmin } = useAuth();
  const [functionName, setFunctionName] = useState("");
  const [functionCode, setFunctionCode] = useState(`import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Your API logic here
    const data = { message: "Hello from your custom API!" };
    
    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});`);
  const [apiDocumentation, setApiDocumentation] = useState("");

  // Check if user is logged in and is admin
  if (!user) {
    return (
      <div className="container px-4 py-8">
        <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10">
          <p className="text-red-400">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  const userIsAdmin = isAdmin(user);
  
  if (!userIsAdmin) {
    return (
      <div className="container px-4 py-8">
        <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10">
          <p className="text-red-400">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const handleSaveFunction = () => {
    if (!functionName.trim()) {
      toast.error("Please enter a function name");
      return;
    }
    
    // In a real implementation, this would save the function to Supabase
    toast.success(`Function "${functionName}" saved successfully!`);
  };

  const handleTestFunction = () => {
    if (!functionName.trim() || !functionCode.trim()) {
      toast.error("Please enter both function name and code");
      return;
    }
    
    // In a real implementation, this would test the function
    toast.info("Testing function... (This would actually deploy and test the function)");
  };

  return (
    <div className="container px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/admin">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Admin
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Code className="text-neon-cyan" />
            API Development
          </h1>
          <p className="text-gray-400">Create and manage custom APIs for your project</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Development Area */}
        <div className="lg:col-span-2">
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-neon-cyan">Edge Function Editor</CardTitle>
              <CardDescription>
                Create serverless functions that run on the edge. These functions can handle API requests, 
                process data, and integrate with external services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="functionName">Function Name</Label>
                <Input
                  id="functionName"
                  placeholder="my-api-function"
                  value={functionName}
                  onChange={(e) => setFunctionName(e.target.value)}
                  className="bg-black/40 border-white/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="functionCode">Function Code</Label>
                <Textarea
                  id="functionCode"
                  placeholder="Enter your TypeScript/JavaScript code here..."
                  value={functionCode}
                  onChange={(e) => setFunctionCode(e.target.value)}
                  className="bg-black/40 border-white/20 font-mono text-sm min-h-[400px]"
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                onClick={handleSaveFunction}
                className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Function
              </Button>
              <Button 
                onClick={handleTestFunction}
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/10"
              >
                <Play className="h-4 w-4 mr-2" />
                Test Function
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start bg-transparent border-white/20 hover:bg-white/10"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Existing Functions
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start bg-transparent border-white/20 hover:bg-white/10"
              >
                <Code className="h-4 w-4 mr-2" />
                Function Templates
              </Button>
            </CardContent>
          </Card>

          {/* Documentation */}
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Document your API endpoints, parameters, and responses..."
                value={apiDocumentation}
                onChange={(e) => setApiDocumentation(e.target.value)}
                className="bg-black/40 border-white/20 text-sm min-h-[200px]"
              />
            </CardContent>
          </Card>

          {/* Examples */}
          <Card className="bg-black/60 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-sm">Common Patterns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="p-2 bg-black/40 rounded border border-white/10">
                <p className="text-neon-cyan mb-1">REST API Endpoint</p>
                <p className="text-gray-400">Handle GET, POST, PUT, DELETE requests</p>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/10">
                <p className="text-neon-cyan mb-1">Database Operations</p>
                <p className="text-gray-400">Query and update Supabase tables</p>
              </div>
              <div className="p-2 bg-black/40 rounded border border-white/10">
                <p className="text-neon-cyan mb-1">External API Integration</p>
                <p className="text-gray-400">Call third-party services securely</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminAPIPage;
