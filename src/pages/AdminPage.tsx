import { useAuth } from "@/contexts/AuthContext";
import { UpdateTimestampSection } from "@/components/admin/UpdateTimestampSection";
import { DummyDataButton } from "@/components/admin/DummyDataButton";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {isAdmin(user) ? (
        <div className="space-y-6">
          {/* Update Timestamp Section */}
          <UpdateTimestampSection />
          
          <div className="p-4 border border-white/10 rounded-lg bg-black/40">
            <h2 className="text-xl font-semibold mb-4">Generate Dummy User</h2>
            <p className="text-sm text-gray-400 mb-4">
              This will create a random user with a @phillboards.com email address and 5-25 phillboards
              with random taglines in the Charleston, WV area.
            </p>
            <DummyDataButton />
          </div>
          
          {/* Additional admin tools could be added here */}
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
