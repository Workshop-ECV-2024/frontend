import { useEffect, useState } from "react";
import { useSelectedPlanet } from "../contexts/SelectedPlanetContext.tsx";
import {MusicComposer, PlanetData, Weather} from "../lib/MusicComposer.ts";
import usePlanetData from "../hooks/usePlanetData.ts";
import * as Tone from "tone";
import useWeather from "../hooks/useWeather.ts";
import useGeolocation from "../hooks/useGeolocation.ts";

export default function WeatherSymphony() {
  const latLong = useGeolocation();
  const [selectedPlanet] = useSelectedPlanet();
  const { data: planetData } = usePlanetData(selectedPlanet?.name);
  const { data: earthData } = usePlanetData("Earth");
  const [composer, setComposer] = useState<MusicComposer | null>(null);
  const { data: weather } = useWeather(latLong[0], latLong[1]);

  useEffect(() => {
    if (!selectedPlanet && composer) {
      composer.stopMusic();
      return;
    }

    if (earthData) {
      Tone.getTransport().cancel();
      setComposer(new MusicComposer(earthData as PlanetData));
    }

    if (!selectedPlanet || !composer) return;

    if (selectedPlanet.name === "Earth") {
      composer.stopMusic();
      composer.setPlanet(selectedPlanet.name, earthData as PlanetData, weather as Weather);
      composer.playMusic();
      return;
    }

    composer.stopMusic();
    composer.setPlanet(selectedPlanet.name, planetData as PlanetData);
    composer.playMusic();
  }, [selectedPlanet, planetData, earthData]);

  return null;
}
