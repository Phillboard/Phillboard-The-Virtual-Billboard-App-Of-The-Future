
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Clock } from "lucide-react";
import { getPhillboardPercentile } from "@/services/phillboardService";
import { handleServiceErrorWithToast } from "@/services/phillboardService/edit/errorHandling";

interface UserProfile {
  id: string;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

interface UserProfileStats {
  phillboardCount: number;
  percentile: number | null;
  joinDate: string;
}

interface UserProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
}

export function UserProfileDialog({
  isOpen,
  onOpenChange,
  username,
}: UserProfileDialogProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserProfileStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && username) {
      loadUserProfile();
    }
  }, [isOpen, username]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);

      // Fetch profile data
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, avatar_url, created_at")
        .eq("username", username)
        .maybeSingle();

      if (profileError) {
        throw handleServiceErrorWithToast(profileError, "Could not fetch user profile");
      }

      if (!profileData) {
        // If we don't have a specific profile, fetch info from phillboards table
        const { data: phillboardUser, error: phillboardError } = await supabase
          .from("phillboards")
          .select("username, created_at")
          .eq("username", username)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        if (phillboardError) {
          throw handleServiceErrorWithToast(phillboardError, "Could not fetch user data");
        }

        if (phillboardUser) {
          // Create a basic profile from phillboard data
          setProfile({
            id: "unknown",
            username: phillboardUser.username,
            avatar_url: null,
            created_at: phillboardUser.created_at,
          });
        }
      } else {
        setProfile(profileData);
      }

      // If we have a profile, fetch user stats
      if (profileData || profile) {
        await loadUserStats(username);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserStats = async (username: string) => {
    try {
      // Get phillboard count
      const { data: phillboardsData, error: countError } = await supabase
        .from("phillboards")
        .select("id")
        .eq("username", username);

      if (countError) {
        throw handleServiceErrorWithToast(countError, "Could not fetch user stats");
      }

      const phillboardCount = phillboardsData?.length || 0;

      // Get percentile if they have placed any phillboards
      let percentile: number | null = null;
      if (phillboardCount > 0) {
        percentile = await getPhillboardPercentile(username);
      }

      // Format join date
      const joinDate = profile?.created_at
        ? new Date(profile.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "Unknown";

      setStats({
        phillboardCount,
        percentile,
        joinDate,
      });
    } catch (error) {
      console.error("Error loading user stats:", error);
    }
  };

  // Generate initials for avatar fallback
  const initials = username
    .split(/[^a-zA-Z0-9]/)
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <DialogDescription>
            Information about @{username}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-gray-700 animate-pulse"></div>
            <div className="w-32 h-4 bg-gray-700 animate-pulse rounded"></div>
            <div className="w-24 h-3 bg-gray-700 animate-pulse rounded"></div>
          </div>
        ) : profile ? (
          <div className="py-4">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="w-20 h-20 border-2 border-neon-cyan mb-4">
                <AvatarImage src={profile.avatar_url || undefined} />
                <AvatarFallback className="bg-neon-cyan/20 text-neon-cyan text-xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold text-white mb-1">@{profile.username}</h2>
              
              {stats?.percentile !== null && (
                <Badge variant="outline" className="bg-fuchsia-950/30 text-fuchsia-300">
                  Top {stats.percentile}% Creator
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-cyan-400" size={18} />
                <div>
                  <div className="text-sm font-medium">Phillboards</div>
                  <div className="text-sm text-gray-400">{stats?.phillboardCount || 0} placed</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Award className="text-cyan-400" size={18} />
                <div>
                  <div className="text-sm font-medium">Creator Rank</div>
                  <div className="text-sm text-gray-400">
                    {stats?.percentile !== null
                      ? `Top ${stats.percentile}% of all users`
                      : "Not ranked yet"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="text-cyan-400" size={18} />
                <div>
                  <div className="text-sm font-medium">Joined</div>
                  <div className="text-sm text-gray-400">{stats?.joinDate}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400">
            <p>No profile information found for @{username}</p>
          </div>
        )}

        <DialogClose asChild>
          <Button variant="outline" className="w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
