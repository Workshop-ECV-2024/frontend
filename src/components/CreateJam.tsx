import { useState } from "react";
import * as Tone from "tone"; // Importer Tone.js
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

interface Phenomenon {
  name: string;
  note: string;
}

const spacePhenomena: Phenomenon[] = [
  { name: "Supernova", note: "C4" },
  { name: "Comet", note: "D4" },
  { name: "Black Hole", note: "E4" },
  { name: "Nebula", note: "F4" },
  { name: "Pulsar", note: "G4" },
  { name: "Meteor Shower", note: "A4" },
  { name: "Quasar", note: "B4" },
  { name: "Exoplanet", note: "C5" },
  { name: "Solar Flare", note: "D5" },
  { name: "Galaxy Cluster", note: "E5" },
  { name: "Asteroid Belt", note: "F5" },
  { name: "Aurora Borealis", note: "G5" },
  { name: "Cosmic Ray", note: "A5" },
  { name: "Stellar Wind", note: "B5" },
];

interface RecordedSoundProps {
  sound: Phenomenon;
  index: number;
  moveSound: (fromIndex: number, toIndex: number) => void;
  removeSound: (index: number) => void;
}

function RecordedSound({ sound, index, moveSound, removeSound }: RecordedSoundProps) {
  const [, ref] = useDrag({
    type: "sound",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "sound",
    hover: (draggedItem: { index: number }) => {
      if (draggedItem.index !== index) {
        moveSound(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <li ref={(node) => ref(drop(node))} className="flex justify-between items-center">
      <span>{sound.name}</span>
      <button
        onClick={() => removeSound(index)}
        className="text-red-500 hover:text-red-700 font-bold text-xl ml-4"
        aria-label="Remove sound"
      >
        ✖
      </button>
    </li>
  );
}

function CreateJam() {
  const [recordedSounds, setRecordedSounds] = useState<Phenomenon[]>([]);

  const playNote = (note: string) => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, "8n");
  };

  const handleButtonClick = (phenomenon: Phenomenon) => {
    playNote(phenomenon.note);
    recordSound(phenomenon);
  };

  const recordSound = (phenomenon: Phenomenon) => {
    setRecordedSounds((prev) => [...prev, phenomenon]);
  };

  const removeSound = (index: number) => {
    setRecordedSounds((prev) => prev.filter((_, i) => i !== index));
  };

  const moveSound = (fromIndex: number, toIndex: number) => {
    setRecordedSounds((prev) => {
      const updatedSounds = [...prev];
      const [movedSound] = updatedSounds.splice(fromIndex, 1);
      updatedSounds.splice(toIndex, 0, movedSound);
      return updatedSounds;
    });
  };

  const playFinalMusic = async () => {
    await Tone.start();
    Tone.Transport.bpm.value = 120;
    Tone.Transport.start();

    const synth = new Tone.Synth().toDestination();
    recordedSounds.forEach((sound, index) => {
      synth.triggerAttackRelease(sound.note, "8n", Tone.now() + index * (60 / Tone.Transport.bpm.value));
    });
  };

  const handleRandomSound = () => {
    const randomPhenomenon = spacePhenomena[Math.floor(Math.random() * spacePhenomena.length)];
    playNote(randomPhenomenon.note);
    recordSound(randomPhenomenon);
  };

  const handleCreateJam = async () => {
    setRecordedSounds([]);
    const numSounds = 5;
    for (let i = 0; i < numSounds; i++) {
      const randomPhenomenon = spacePhenomena[Math.floor(Math.random() * spacePhenomena.length)];
      recordSound(randomPhenomenon);
    }
    await playFinalMusic();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex flex-col items-center p-4 min-h-screen bg-black">
        <h1 className="text-4xl font-bold mb-12">Create your SPACE JAM</h1>
        <div className="flex flex-wrap justify-center gap-4 w-[50vw]">
          {spacePhenomena.map((phenomenon, index) => (
            <button
              key={index}
              onClick={() => handleButtonClick(phenomenon)}
              className="bg-[rgba(137,104,168,0.68)] hover:bg-[rgba(136,83,186,0.88)] text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition duration-300 hover:scale-110"
            >
              {phenomenon.name}
            </button>
          ))}
        </div>
        <div className="flex gap-6 mt-8">
          <button
            onClick={handleRandomSound}
            className="bg-white transform transition duration-300 hover:scale-110 text-purple-800 font-bold py-2 px-6 rounded-lg mt-8"
          >
            Random sound
          </button>
          <button
            onClick={handleCreateJam}
            className="bg-white transform transition duration-300 hover:scale-110 text-purple-800 font-bold py-2 px-6 rounded-lg mt-8"
          >
            Random Jam
          </button>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-bold mb-2">Recorded Sounds:</h3>
          {recordedSounds.length > 0 ? (
            <ul className="list-disc list-inside">
              {recordedSounds.map((sound, index) => (
                <RecordedSound
                  key={index}
                  sound={sound}
                  index={index}
                  moveSound={moveSound}
                  removeSound={removeSound}
                />
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">No sounds recorded yet.</p>
          )}
        </div>
        <button
          onClick={playFinalMusic}
          className="border border-[rgba(137,104,168,0.81)] hover:bg-purple-800 text-white font-bold py-2 px-10 rounded-lg mt-8"
        >
          Play
        </button>
      </div>
    </DndProvider>
  );
}

export default CreateJam;
