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
import { MusicComposer } from "../../lib/MusicComposer";
import {useEffect, useState} from "react";
import * as Tone from "tone";

interface PlaylistButtonProps {}

export default function PlaylistButton({ ...props }: PlaylistButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [lat, lng] = useGeolocation();
  const { data: weather } = useWeather(lat, lng);
  const [composer, setComposer] = useState<MusicComposer | null>(null);
  const { data: earthData } = usePlanetData("Earth");
  const [currPlanet, setCurrPlanet] = useState<string | null>(null)

  function handleMusicPlay(planetName, planetData) {
    if (!earthData) return;

    Tone.getTransport().cancel();
    setComposer(new MusicComposer(earthData));
    console.log(planetName, composer)
    if (!planetName || !composer) return;

    if (planetName === "Earth") {
      composer.stopMusic();
      composer.setPlanet(planetName, earthData, weather);
      composer.playMusic();
      setCurrPlanet(planetName)
      return;
    }

    composer.stopMusic();
    composer.setPlanet(planetName, planetData);
    composer.playMusic();

    setCurrPlanet(planetName)
  }

  useEffect(() => {
    Tone.getTransport().cancel();
    setComposer(new MusicComposer(earthData));
  }, [earthData]);

  return (
    <>
      <Button onPress={onOpen}>Playlist</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Playlist</ModalHeader>
          <ModalBody className="flex flex-col gap-1">
            {planetsData.map(planet => (
              <PlaylistItem key={planet.name} planetName={planet.name} onMusicPlay={handleMusicPlay} isPlaying={currPlanet === planet.name} />
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
  onMusicPlay: (planetName, planetData) => void;
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
        {isPlaying ? (
          <IconPlayerPause size={16} />
        ) : (
          <IconPlayerPlay size={16} />
        )}
      </Button>
    </div>
  );
}
