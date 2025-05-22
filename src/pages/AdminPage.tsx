
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateSampleData, checkSampleDataExists } from "@/services/sampleDataService";
import { useAuth } from "@/contexts/AuthContext";
import { UpdateTimestampSection } from "@/components/admin/UpdateTimestampSection";
import { AdminScreen } from "@/components/AdminScreen";

const AdminPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user, isAdmin } = useAuth();

  const handleGenerateData = async () => {
    if (!isAdmin(user)) {
      toast.error("Only administrators can generate sample data");
      return;
    }
    
    try {
      setIsGenerating(true);
      
      // Check if we already have sufficient sample data
      const hasData = await checkSampleDataExists();
      if (hasData) {
        toast.info("Sample data already exists in sufficient quantity");
        return;
      }
      
      const success = await generateSampleData();
      
      if (success) {
        toast.success("Sample data generated successfully");
      } else {
        toast.error("Failed to generate sample data");
      }
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error("An error occurred while generating sample data");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {isAdmin(user) ? (
        <div className="space-y-6">
          {/* Update Timestamp Section */}
          <UpdateTimestampSection />
          
          {/* Sample Data Generator */}
          <div className="p-4 border border-white/10 rounded-lg bg-black/40">
            <h2 className="text-xl font-semibold mb-4">Generate Sample Data</h2>
            <p className="text-sm text-gray-400 mb-4">
              This will generate 20 sample users with Gmail accounts and 1-30 random phillboards in East Coast cities,
              plus 100 phillboards for admin@mopads.com around Charleston, WV.
            </p>
            <Button 
              onClick={handleGenerateData}
              disabled={isGenerating}
              className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : "Generate Sample Data"}
            </Button>
          </div>
          
          {/* Admin Screen Component */}
          <div className="p-4 border border-white/10 rounded-lg bg-black/40">
            <AdminScreen />
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
