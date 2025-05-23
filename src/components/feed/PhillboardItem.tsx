
import { useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { Phillboard, convertToMapPin } from "./types";
import { formatTime, getPlacementTypeLabel, getLocationDescription } from "./utils";

interface PhillboardItemProps {
  phillboard: Phillboard;
  canDelete: boolean;
  onDeleteClick: (phillboard: Phillboard) => void;
  onUsernameClick: (username: string) => void;
}

export function PhillboardItem({ phillboard, canDelete, onDeleteClick, onUsernameClick }: PhillboardItemProps) {
  return (
    <div 
      className="p-4 rounded-lg border border-gray-800 bg-black/60 transition-all hover:border-cyan-900"
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-semibold text-cyan-400">{phillboard.title}</h3>
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
          <span className="text-xs text-gray-400">{formatTime(phillboard.created_at)}</span>
        </div>
      </div>
      
      <p className="text-sm text-gray-300 mb-2">
        by{" "}
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
        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        <span>{getLocationDescription(phillboard.lat, phillboard.lng)}</span>
      </div>
    </div>
  );
}
