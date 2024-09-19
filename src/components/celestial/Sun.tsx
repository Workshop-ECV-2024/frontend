import { Vector3, TextureLoader } from "three";
import { useLoader, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";

interface SunProps {
  position: Vector3 | [number, number, number];
  radius: number;
}

const Sun: React.FC<SunProps> = ({ position, radius }) => {
  const sunTexture = useLoader(TextureLoader, "/images/bodies/sun_2k.webp");
  const { scene } = useThree();

  useEffect(() => {
    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 32, 32),
      new THREE.MeshPhongMaterial({
        // color: 0xffdd99,
        emissive: 0xffdd99,
        emissiveMap: sunTexture,
        emissiveIntensity: 0.75,
        map: sunTexture,
      })
    );

    scene.add(sun);
  }, []);

  return null;
};

export default Sun;
