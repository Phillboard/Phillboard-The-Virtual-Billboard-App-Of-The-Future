
import { useState } from "react";
import { APISidebar } from "@/components/api-docs/APISidebar";
import { APIContent } from "@/components/api-docs/APIContent";

const APIDocsPage = () => {
  const [activeSection, setActiveSection] = useState("introduction");

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <APISidebar 
            activeSection={activeSection} 
            onSectionChange={setActiveSection} 
          />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto bg-black/20">
          <APIContent activeSection={activeSection} />
        </div>
      </div>
    </div>
  );
};

export default APIDocsPage;
