
import { Clock, Edit, MapPin, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { Phillboard } from "./types";
import { formatTime, getPlacementTypeLabel, getLocationDescription } from "./utils";

interface ActivityItemProps {
  activity: {
    type: 'placement' | 'edit';
    phillboard: Phillboard;
    timestamp: string;
  };
  canDelete: boolean;
  onDeleteClick: (phillboard: Phillboard) => void;
  onUsernameClick: (username: string) => void;
}

export function ActivityItem({ activity, canDelete, onDeleteClick, onUsernameClick }: ActivityItemProps) {
  const { phillboard, type, timestamp } = activity;
  
  return (
    <div 
      className={`p-4 rounded-lg border ${
        type === 'edit' ? 'border-purple-800 bg-purple-900/20' : 'border-gray-800 bg-black/60'
      } transition-all hover:border-cyan-900`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="flex items-center gap-2">
          {type === 'edit' ? (
            <Edit size={16} className="text-purple-400" />
          ) : (
            <MapPin size={16} className="text-cyan-400" />
          )}
          <h3 className="font-semibold text-cyan-400">{phillboard.title}</h3>
          {phillboard.is_edited && type !== 'edit' && (
            <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-0.5 rounded-full">
              Edited
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {canDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 text-red-500 hover:text-red-400 hover:bg-red-950/30"
              onClick={() => onDeleteClick(phillboard)}
            >
              <Trash2 size={16} />
              <span className="sr-only">Delete</span>
            </Button>
          )}
          <span className="text-xs text-gray-400">{formatTime(timestamp)}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-2">
        {type === 'edit' ? 'Edited' : 'Placed'} by{" "}
        <button 
          onClick={() => onUsernameClick(phillboard.username)}
          className="text-fuchsia-500 hover:underline focus:outline-none"
        >
          @{phillboard.username}
        </button>
      </p>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <span className="inline-flex items-center px-2 py-1 rounded-full bg-gray-800">
          {getPlacementTypeLabel(phillboard.placement_type)}
        </span>
        
        {phillboard.edit_count && phillboard.edit_count > 0 && (
          <span className="inline-flex items-center px-2 py-1 rounded-full bg-purple-900/30">
            {phillboard.edit_count} edit{phillboard.edit_count !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      
      {phillboard.image_type && phillboard.image_type !== 'text' && (
        <div className="bg-gray-900 rounded h-24 flex items-center justify-center mb-2">
          <span className="text-xs text-gray-500">{phillboard.image_type} content</span>
        </div>
      )}
      
      {phillboard.content && (
        <p className="text-sm text-gray-300 mb-2 italic">"{phillboard.content}"</p>
      )}
      
      <div className="flex items-center text-xs text-gray-500">
        <Clock size={14} className="mr-1" />
        <span>{getLocationDescription(phillboard.lat, phillboard.lng)}</span>
      </div>
    </div>
  );
}
