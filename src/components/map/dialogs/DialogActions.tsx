
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface DialogActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitText?: string;
  submittingText?: string;
}

export function DialogActions({ 
  onCancel, 
  onSubmit, 
  isSubmitting, 
  submitText = "Post Phillboard",
  submittingText = "Posting..."
}: DialogActionsProps) {
  return (
    <DialogFooter>
      <Button 
        variant="outline"
        onClick={onCancel}
        className="bg-transparent border-white/20 hover:bg-white/10"
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button 
        onClick={onSubmit}
        className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {submittingText}
          </>
        ) : submitText}
      </Button>
    </DialogFooter>
  );
}
