
import { useAuth } from "@/contexts/AuthContext";
import { UpdateTimestampSection } from "@/components/admin/UpdateTimestampSection";
import { DummyDataButton } from "@/components/admin/DummyDataButton";
import { UserBalancesSection } from "@/components/admin/UserBalancesSection";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  
  // Check if user is logged in
  if (!user) {
    return (
      <div className="container px-4 py-8">
        <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10">
          <p className="text-red-400">You need to be logged in to access this page.</p>
        </div>
      </div>
    );
  }

  // Check if user is admin
  const userIsAdmin = isAdmin(user);
  
  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {userIsAdmin ? (
        <div className="space-y-6">
          {/* Update Timestamp Section */}
          <UpdateTimestampSection />
          
          {/* User Balances Section */}
          <UserBalancesSection />
          
          <div className="p-4 border border-white/10 rounded-lg bg-black/40">
            <h2 className="text-xl font-semibold mb-4">Generate Dummy User</h2>
            <p className="text-sm text-gray-400 mb-4">
              This will create a random user with a @phillboards.com email address and 5-25 phillboards
              with random taglines in the Charleston, WV area.
            </p>
            <DummyDataButton />
          </div>

          {/* API Development Section */}
          <div className="p-4 border border-white/10 rounded-lg bg-black/40">
            <h2 className="text-xl font-semibold mb-4">API Development</h2>
            <p className="text-sm text-gray-400 mb-4">
              Create and manage custom APIs for the project. Build edge functions, configure endpoints, and handle API logic.
            </p>
            <Link to="/admin/api">
              <Button 
                variant="outline"
                className="bg-transparent border-white/20 hover:bg-white/10 text-neon-cyan"
              >
                <Code className="mr-2 h-4 w-4" />
                Open API Development
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="p-4 border border-red-500/30 rounded-lg bg-red-500/10">
          <p className="text-red-400">You do not have permission to access this page.</p>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
