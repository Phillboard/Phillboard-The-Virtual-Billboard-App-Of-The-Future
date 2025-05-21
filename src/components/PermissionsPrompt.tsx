
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Permission = {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
};

const permissions: Permission[] = [
  {
    id: "camera",
    title: "Camera Access",
    description: "We need your camera to show AR signs and phillboards in the real world.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
        <circle cx="12" cy="13" r="3"/>
      </svg>
    ),
  },
  {
    id: "location",
    title: "Location Access",
    description: "We need your location to anchor phillboards in the wild and show you nearby signs.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    id: "motion",
    title: "Motion Tracking",
    description: "We need motion tracking to properly display AR content as you move around.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
        <path d="m2 4 3 12h14l3-12"/>
        <path d="m6 8 4 6"/>
        <path d="m14 8-4 6"/>
        <path d="m11 8-3 6"/>
        <path d="m13 8 3 6"/>
      </svg>
    ),
  },
];

export function PermissionsPrompt({ onComplete }: { onComplete: () => void }) {
  const [currentPermission, setCurrentPermission] = useState(0);
  const [grantedPermissions, setGrantedPermissions] = useState<string[]>([]);

  const handleGrantPermission = () => {
    const newGrantedPermissions = [...grantedPermissions, permissions[currentPermission].id];
    setGrantedPermissions(newGrantedPermissions);
    
    if (currentPermission < permissions.length - 1) {
      setCurrentPermission(currentPermission + 1);
    } else {
      onComplete();
    }
  };
  
  const currentPerm = permissions[currentPermission];
  const progress = Math.round(((currentPermission) / permissions.length) * 100);

  return (
    <Card className="w-[350px] bg-black/60 backdrop-blur-md border-white/10 animate-fade-in">
      <CardHeader>
        <div className="w-full bg-secondary/30 h-1.5 rounded-full mb-4">
          <div 
            className="bg-neon-cyan h-1.5 rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 rounded-full bg-neon-cyan/10 text-neon-cyan">
            {currentPerm.icon}
          </div>
        </div>
        <CardTitle className="text-xl text-center">{currentPerm.title}</CardTitle>
        <CardDescription className="text-center">{currentPerm.description}</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          onClick={handleGrantPermission}
          className="w-full bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
        >
          Allow Access
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => {
            if (currentPermission < permissions.length - 1) {
              setCurrentPermission(currentPermission + 1);
            } else {
              onComplete();
            }
          }}
          className="text-sm text-white/70 hover:text-white"
        >
          Not Now
        </Button>
      </CardFooter>
    </Card>
  );
}
