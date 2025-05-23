
import { useAuth } from "@/contexts/AuthContext";
import { UpdateTimestampSection } from "@/components/admin/UpdateTimestampSection";
import { DummyDataButton } from "@/components/admin/DummyDataButton";
import { UserBalancesSection } from "@/components/admin/UserBalancesSection";

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
