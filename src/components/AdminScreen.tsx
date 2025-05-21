
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Shield, UserRound, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

// Mock admin data
const adminData = {
  totalUsers: 145,
  totalPhillboards: 362,
  flaggedContent: [
    { id: 1, user: "techrebel", content: "Inappropriate language", date: "May 20, 2025" },
    { id: 2, user: "pixelart", content: "Prohibited content", date: "May 19, 2025" },
    { id: 3, user: "neondreamer", content: "Location violation", date: "May 18, 2025" },
  ],
  recentUsers: [
    { id: 1, name: "Jamie Smith", email: "jamie@example.com", date: "May 21, 2025" },
    { id: 2, name: "Taylor Reed", email: "taylor@example.com", date: "May 20, 2025" },
    { id: 3, name: "Casey Jones", email: "casey@example.com", date: "May 19, 2025" },
  ]
};

export function AdminScreen() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  
  // In a real app, this would be a secure admin password stored in the backend
  const ADMIN_PASSWORD = "admin123";
  
  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success("Admin access granted");
    } else {
      toast.error("Incorrect admin password");
    }
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword("");
    toast.info("Admin logged out");
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
        <Card className="w-[350px] bg-black/60 backdrop-blur-md border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center flex justify-center items-center gap-2">
              <Shield className="text-neon-cyan" /> Admin Access
            </CardTitle>
            <CardDescription className="text-center">
              Enter the admin password to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Admin Password</Label>
                <Input 
                  id="adminPassword" 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-black/40 border-white/20"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
              >
                Access Admin Panel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="text-neon-cyan" /> Admin Dashboard
        </h1>
        <Button 
          variant="outline" 
          className="bg-transparent border-white/20 hover:bg-white/10"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="neon-card p-4 rounded-lg flex items-center">
          <div className="p-3 rounded-full bg-neon-cyan/20 mr-4">
            <UserRound className="text-neon-cyan h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Users</p>
            <h3 className="text-2xl font-bold">{adminData.totalUsers}</h3>
          </div>
        </div>
        <div className="neon-card p-4 rounded-lg flex items-center">
          <div className="p-3 rounded-full bg-neon-magenta/20 mr-4">
            <MapPin className="text-neon-magenta h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">Total Phillboards</p>
            <h3 className="text-2xl font-bold">{adminData.totalPhillboards}</h3>
          </div>
        </div>
      </div>
      
      {/* Flagged Content */}
      <div className="neon-card p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-3">Flagged Content</h2>
        <div className="space-y-3">
          {adminData.flaggedContent.map((item) => (
            <div key={item.id} className="p-3 rounded-md bg-black/40 border border-red-500/30">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-white">User: <span className="text-red-400">@{item.user}</span></h3>
                  <p className="text-sm text-gray-400">{item.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.date}</p>
                </div>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 bg-transparent border-white/20 hover:bg-white/10"
                  >
                    Review
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    className="h-8"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Recent Users */}
      <div className="neon-card p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Recent Users</h2>
        <div className="space-y-3">
          {adminData.recentUsers.map((user) => (
            <div key={user.id} className="p-3 rounded-md bg-black/40 border border-white/10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-neon-cyan">{user.name}</h3>
                  <p className="text-sm text-gray-400">{user.email}</p>
                  <p className="text-xs text-gray-500 mt-1">Joined: {user.date}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 bg-transparent border-white/20 hover:bg-white/10"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
