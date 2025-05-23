
interface ARStatusIndicatorProps {
  isCapturing: boolean;
}

const ARStatusIndicator = ({ isCapturing }: ARStatusIndicatorProps) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm py-2 px-4 rounded-full text-sm text-white z-10">
      {isCapturing ? "Phillboard placed!" : "Point camera at a flat surface"}
    </div>
  );
};

export default ARStatusIndicator;
