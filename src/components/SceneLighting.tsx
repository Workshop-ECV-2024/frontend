import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect } from "react";

const SceneLighting = () => {
  const { scene } = useThree();
  useEffect(() => {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    ambientLight.castShadow = true;
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 0, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 1024;
    pointLight.shadow.mapSize.height = 1024;
    scene.add(pointLight);
  }, []);
  return (
    <>
      {/* <directionalLightHelper /> */}
      {/* <ambientLight intensity={0.2} color={0xffffff} /> */}
      {/* <directionalLight
        castShadow
        intensity={1.0} // Bright enough to simulate sunlight, but you can tweak it
        position={[5, 0, 0]} // You would compute this based on the sun's current position
        shadow-mapSize-width={2048} // Higher for better shadow quality
        shadow-mapSize-height={2048} // Higher for better shadow quality
        // Further properties to set shadow camera frustum might be needed
      /> */}
      {/* <pointLight
        position={[0, 0, 0]} // The sun's position
        intensity={1.5} // Quite bright to represent the sun's light
        decay={2} // Natural light falloff
        distance={50} // Affects the reach of the light
      /> */}
    </>
  );
};
export default SceneLighting;
