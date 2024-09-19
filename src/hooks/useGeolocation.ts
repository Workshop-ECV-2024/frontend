import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [latlng, setLatlng] = useState<[number, number] | [null, null]>([
    null,
    null,
  ]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setLatlng([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return latlng;
}
