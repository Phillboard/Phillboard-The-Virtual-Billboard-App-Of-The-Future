
interface ARCapturedImageProps {
  isCapturing: boolean;
  overlayImage: string | null;
}

const ARCapturedImage = ({ isCapturing, overlayImage }: ARCapturedImageProps) => {
  if (!isCapturing || !overlayImage) return null;
  
  return (
    <div className="absolute inset-0">
      <img src={overlayImage} className="h-full w-full object-cover" alt="AR view" />
    </div>
  );
};

export default ARCapturedImage;
