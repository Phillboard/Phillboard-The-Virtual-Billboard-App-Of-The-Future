
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronRight } from "lucide-react";

interface SidebarSection {
  title: string;
  items: { name: string; id: string }[];
}

interface APISidebarProps {
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

export function APISidebar({ activeSection, onSectionChange }: APISidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["getting-started", "endpoints", "database"])
  );

  const sections: SidebarSection[] = [
    {
      title: "GETTING STARTED",
      items: [
        { name: "Introduction", id: "introduction" },
        { name: "Authentication", id: "authentication" },
        { name: "Rate Limits", id: "rate-limits" },
        { name: "Error Codes", id: "error-codes" }
      ]
    },
    {
      title: "ENDPOINTS",
      items: [
        { name: "Phillboards", id: "phillboards" },
        { name: "Users", id: "users" },
        { name: "Statistics", id: "statistics" },
        { name: "Search", id: "search" }
      ]
    },
    {
      title: "DATABASE TABLES",
      items: [
        { name: "phillboards", id: "table-phillboards" },
        { name: "phillboards_edit_history", id: "table-edit-history" },
        { name: "profiles", id: "table-profiles" },
        { name: "user_balances", id: "table-balances" }
      ]
    },
    {
      title: "STORED PROCEDURES",
      items: [
        { name: "add_to_balance", id: "proc-add-balance" },
        { name: "get_edit_count", id: "proc-edit-count" },
        { name: "get_most_edited_phillboards", id: "proc-most-edited" },
        { name: "get_top_creators", id: "proc-top-creators" },
        { name: "get_top_earners", id: "proc-top-earners" },
        { name: "get_top_editors", id: "proc-top-editors" }
      ]
    }
  ];

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <Card className="bg-gray-900/95 border-gray-700 h-full overflow-auto">
      <div className="p-4">
        <h2 className="text-lg font-bold text-white mb-6">API Docs</h2>
        
        <div className="space-y-1">
          {sections.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="flex items-center w-full text-left text-xs font-semibold text-gray-400 uppercase tracking-wider py-2 hover:text-gray-300 transition-colors"
              >
                {expandedSections.has(section.title) ? (
                  <ChevronDown className="h-3 w-3 mr-1" />
                ) : (
                  <ChevronRight className="h-3 w-3 mr-1" />
                )}
                {section.title}
              </button>
              
              {expandedSections.has(section.title) && (
                <div className="ml-4 space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onSectionChange(item.id)}
                      className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors ${
                        activeSection === item.id
                          ? "bg-neon-cyan/20 text-neon-cyan border-l-2 border-neon-cyan"
                          : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                      }`}
                    >
                      {item.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
