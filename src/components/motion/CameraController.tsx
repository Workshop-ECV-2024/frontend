import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import { OrbitControls } from 'three-stdlib';
import { useSelectedPlanet } from '../../contexts/SelectedPlanetContext';
import { usePlanetPositions } from '../../contexts/PlanetPositionsContext';
import { useCameraContext } from '../../contexts/CameraContext';
import { useCameraSetup } from '../../hooks/useCameraSetup';
//import { useIntroAnimation } from '../../hooks/useIntroAnimation';

const CameraController: React.FC = () => {
  useCameraSetup();
  
  const orbitControlsRef = useRef<OrbitControls>(null);
  const { camera } = useThree();
  const [selectedPlanet] = useSelectedPlanet();
  const { planetPositions } = usePlanetPositions();
  const { cameraState, setCameraState } = useCameraContext();

  const homePosition = useRef(new Vector3(7, 6, 7)).current;
  const lookAtSun = useRef(new Vector3(0, 0, 0)).current;
  const lerpFactor = 0.03;
  const cameraPositionEpsilon = 0.1;
  const detailViewMinDistance = useRef(2).current;
  const detailViewMaxDistance = useRef(3).current;

  const introAnimationCompleted = useRef(false);

  useFrame(() => {
    const controls = orbitControlsRef.current;

    if (controls) {
      switch (cameraState) {

        // Static Cases:
        case 'FREE':
          controls.enabled = true;
          controls.target.set(lookAtSun.x, lookAtSun.y, lookAtSun.z);
          controls.maxDistance = Infinity;
          controls.update();
          break;
        
        case 'DETAIL_VIEW':
          if (selectedPlanet) {
            controls.enabled = true;
            const currentPlanetPosition = planetPositions[selectedPlanet.name];
            if (currentPlanetPosition) {
              controls.target.set(...currentPlanetPosition);
              controls.minDistance = selectedPlanet.radius * detailViewMinDistance;
              controls.maxDistance = selectedPlanet.radius * detailViewMaxDistance;
              controls.update();
            }
          }
          break;

        // Motion Cases:
        case 'INTRO_ANIMATION':
          if (!introAnimationCompleted.current) {
            controls.enabled = false;
            camera.position.lerp(homePosition, 0.07);
            camera.lookAt(lookAtSun);
            if (camera.position.distanceTo(homePosition) < 0.001) {
              introAnimationCompleted.current = true;
              camera.position.copy(homePosition);
              setCameraState('FREE');
            }
          }
          break;

        case 'MOVING_TO_HOME':
          controls.enabled = false;
          camera.position.lerp(homePosition, lerpFactor);
          camera.lookAt(lookAtSun);
          if (camera.position.distanceTo(homePosition) < cameraPositionEpsilon) {
            camera.position.copy(homePosition);
            controls.target.set(lookAtSun.x, lookAtSun.y, lookAtSun.z);
            controls.maxDistance = Infinity;
            controls.update();
            setCameraState('FREE');
          }
          break;

        case 'ZOOMING_IN':
          if (selectedPlanet) {
            const currentPlanetPosition = planetPositions[selectedPlanet.name];
            if (currentPlanetPosition) {
              controls.enabled = false;
              const planetPosition = new Vector3(...currentPlanetPosition);
              const targetCameraPosition = planetPosition.clone().add(new Vector3(1, 0, 0).multiplyScalar(selectedPlanet.radius * 3));
              camera.position.lerp(targetCameraPosition, lerpFactor);
              camera.lookAt(planetPosition);

              if (camera.position.distanceTo(targetCameraPosition) < selectedPlanet.radius * cameraPositionEpsilon) {
                setCameraState('DETAIL_VIEW');
              }
            }
          }
          break;

      }
    }
  });

  return (
    <DreiOrbitControls
      ref={orbitControlsRef}
      enableZoom={true}
      rotateSpeed={0.7}
      zoomSpeed={0.7}
    />
  );
};

export default CameraController;
