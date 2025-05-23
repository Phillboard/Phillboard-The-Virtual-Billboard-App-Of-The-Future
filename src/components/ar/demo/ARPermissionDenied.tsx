
import { Button } from "@/components/ui/button";

interface ARPermissionDeniedProps {
  onRetry: () => void;
}

const ARPermissionDenied = ({ onRetry }: ARPermissionDeniedProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="bg-black/80 p-6 rounded-lg text-center">
        <h3 className="text-xl font-bold text-white mb-4">Camera access denied</h3>
        <p className="text-gray-300 mb-6">We need camera access to show the AR experience</p>
        <Button onClick={onRetry}>Try Again</Button>
      </div>
    </div>
  );
};

export default ARPermissionDenied;
