import { useEffect, useState } from "react";
import { useSelectedPlanet } from "../contexts/SelectedPlanetContext.tsx";
import { MusicComposer, PlanetData, Weather } from "../lib/MusicComposer.ts";
import usePlanetData from "../hooks/usePlanetData.ts";
import * as Tone from "tone";
import useWeather from "../hooks/useWeather.ts";
import useGeolocation from "../hooks/useGeolocation.ts";

// Helper function to normalize planet data
const normalizePlanetData = (data: any): PlanetData | null => {
  if (!data) return null;

  return {
    ...data,
    distance_from_sun: parseFloat(data.distance_from_sun),  // Ensure it's a number
    radius: parseFloat(data.radius), // Ensure it's a number if needed
    day_length: parseFloat(data.day_length), // Same for day_length
    year_length: parseFloat(data.year_length), // Same for year_length
    // Add other properties that need conversion if necessary
  } as PlanetData;
};

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

    // Normalize planet data before using it
    const normalizedEarthData = normalizePlanetData(earthData);
    const normalizedPlanetData = normalizePlanetData(planetData);

    if (normalizedEarthData) {
      Tone.getTransport().cancel();
      setComposer(new MusicComposer(normalizedEarthData));
    }

    if (!selectedPlanet || !composer) return;

    if (selectedPlanet.name === "Earth" && normalizedEarthData && weather) {
      composer.stopMusic();
      composer.setPlanet(selectedPlanet.name, normalizedEarthData, weather as Weather);
      composer.playMusic();
      return;
    }

    if (normalizedPlanetData) {
      composer.stopMusic();
      composer.setPlanet(selectedPlanet.name, normalizedPlanetData);
      composer.playMusic();
    }
  }, [selectedPlanet, planetData, earthData, weather]);

  return null;
}