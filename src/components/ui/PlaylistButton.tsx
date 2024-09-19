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
import { useEffect } from "react";

interface PlaylistButtonProps {}

export default function PlaylistButton({ ...props }: PlaylistButtonProps) {
  // const { data: planets } = usePlanets();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  return (
    <>
      <Button onPress={onOpen}>Playlist</Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>Playlist</ModalHeader>
          <ModalBody className="flex flex-col gap-1">
            {planetsData.map(planet => (
              <PlaylistItem planetName={planet.name} />
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
  onMusicPlay: () => void;
}

function PlaylistItem({
  planetName,
  isPlaying,
  onMusicPlay,
}: PlaylistItemProps) {
  const [lat, lng] = useGeolocation();
  const { data: planetData } = usePlanetData(planetName);
  const { data: earthData } = usePlanetData("Earth");
  const { data: weather } = useWeather(lat, lng);

  const musicComposer = new MusicComposer(earthData!);

  useEffect(() => {
    if (!earthData) return;
    if (planetName === "Earth" && !weather) return;

    musicComposer.setPlanet(planetName, planetData, weather);
  }, [planetData, earthData, weather, planetName, musicComposer]);

  return (
    <div className="flex focus-within:bg-zinc-800/50 hover:bg-zinc-800/50 rounded-lg p-2 items-center justify-between">
      <span>{planetName}</span>
      <Button
        onPress={() => {
          musicComposer.playMusic();
        }}
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
      {/* {data?.distance_from_sun} */}
    </div>
  );
}
