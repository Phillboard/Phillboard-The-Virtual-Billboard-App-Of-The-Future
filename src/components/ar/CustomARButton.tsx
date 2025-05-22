
import { XRButton } from '@react-three/xr';

export function CustomARButton() {
  return (
    <XRButton
      className="bg-neon-cyan/20 hover:bg-neon-cyan/30 text-white border border-neon-cyan py-2 px-4 rounded-md"
      sessionInit={{
        requiredFeatures: ['hit-test','dom-overlay'],
        domOverlay: { root: document.body as HTMLElement }
      }}
    >
      {({ isPresenting }) => (isPresenting ? 'Exit AR' : 'Enter AR')}
    </XRButton>
  );
}

export default CustomARButton;
