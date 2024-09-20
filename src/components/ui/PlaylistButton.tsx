import { useEffect, useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import usePlanetData from "../../hooks/usePlanetData";
import planetsData from "../../lib/planetsData";
import { IconPlayerPause, IconPlayerPlay } from "@tabler/icons-react";
import useWeather from "../../hooks/useWeather";
import useGeolocation from "../../hooks/useGeolocation";
import { MusicComposer, PlanetData } from "../../lib/MusicComposer";
import * as Tone from "tone";

// Helper function to normalize planet data
const normalizePlanetData = (data: any): PlanetData | null => {
  if (!data) return null;

  return {
    ...data,
    distance_from_sun: parseFloat(data.distance_from_sun),  // Ensure it's a number
    radius: parseFloat(data.radius), // Convert to number if needed
    day_length: parseFloat(data.day_length), // Same for day_length
    year_length: parseFloat(data.year_length), // Same for year_length
    avg_temperature: data.avg_temperature ? Number(data.avg_temperature) : null,
    mass: data.mass ? Number(data.mass) : null,
    // Add other properties that need conversion if necessary
  } as PlanetData;
};

// PlaylistButton Component
export default function PlaylistButton() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lat, lng] = useGeolocation();
  const { data: weather } = useWeather(lat, lng);
  const [composer, setComposer] = useState<MusicComposer | null>(null);
  const { data: earthData } = usePlanetData("Earth");
  const [currPlanet, setCurrPlanet] = useState<string | null>(null);

  function handleMusicPlay(planetName, planetData) {
    if (!earthData) return;

    Tone.getTransport().cancel();
    setComposer(new MusicComposer(earthData as PlanetData));

    if (!planetName || !composer) return;

    const normalizedPlanetData = normalizePlanetData(planetData);
    if (!normalizedPlanetData) return;

    if (planetName === "Earth") {
      composer.stopMusic();
      composer.setPlanet(planetName, earthData, weather);
      composer.playMusic();
      setCurrPlanet(planetName);
      return;
    }

    composer.stopMusic();
    composer.setPlanet(planetName, normalizedPlanetData);
    composer.playMusic();
    setCurrPlanet(planetName);
  }

  useEffect(() => {
    Tone.getTransport().cancel();
    setComposer(new MusicComposer(normalizePlanetData(earthData)));
  }, [earthData]);

  return (
      <>
        <Button
            className="bg-[rgba(137,104,168,0.32)] hover:bg-[rgba(116,64,165,0.49)] text-[rgba(139,103,172,0.32)] font-bold py-2 px-4 rounded-full text-white"
            onPress={onOpen}
        >
          Playlist
        </Button>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
          <ModalContent>
            <ModalHeader>Playlist</ModalHeader>
            <ModalBody className="flex flex-col gap-1">
              {planetsData.map((planet) => (
                  <PlaylistItem
                      key={planet.name}
                      planetName={planet.name}
                      onMusicPlay={handleMusicPlay}
                      isPlaying={currPlanet === planet.name}
                  />
              ))}
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
  );
}

interface PlaylistItemProps {
  planetName: string;
  isPlaying?: boolean;
  onMusicPlay: (planetName: string, planetData: PlanetData) => void;
}

function PlaylistItem({
                        planetName,
                        isPlaying,
                        onMusicPlay,
                      }: PlaylistItemProps) {
  const { data: planetData } = usePlanetData(planetName);

  return (
      <div className="flex focus-within:bg-zinc-800/50 hover:bg-zinc-800/50 rounded-lg p-2 items-center justify-between">
        <span>{planetName}</span>
        <Button
            onPress={() => onMusicPlay(planetName, planetData)}
            size="sm"
            color="secondary"
            variant="faded"
        >
          {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
        </Button>
      </div>
  );
}
