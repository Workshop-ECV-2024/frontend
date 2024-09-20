// ExitViewButton.tsx
import { useSelectedPlanet } from '../../../contexts/SelectedPlanetContext';
import { useSpeedControl } from '../../../contexts/SpeedControlContext';
import { useCameraContext } from '../../../contexts/CameraContext';
import { Button } from '@nextui-org/button';
import { IconX } from '@tabler/icons-react';

const ExitViewButton: React.FC = () => {
  const [selectedPlanet, setSelectedPlanet] = useSelectedPlanet();
  const { restoreSpeedFactor } = useSpeedControl();
  const { setCameraState } = useCameraContext();

  const handleExitDetailMode = () => {
    setSelectedPlanet(null);
    restoreSpeedFactor();
    setCameraState('MOVING_TO_HOME');
  };

  if (!selectedPlanet) return null;

  return (
    <Button
        className="bg-red-500/30 hover:bg-[rgba(116,64,165,0.49)] text-[rgba(139,103,172,0.32)] font-bold py-2 px-4 rounded-full text-white flex items-center gap-2"
        onClick={handleExitDetailMode}>
      <IconX />Exit Detail View
    </Button>
  );
};

export default ExitViewButton;
