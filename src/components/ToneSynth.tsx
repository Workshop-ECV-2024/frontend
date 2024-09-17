// ToneSynth.jsx
import React, { useState } from 'react';
import * as Tone from 'tone';

const ToneSynth = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Fonction pour déclencher le son
  const playSound = async () => {
    if (!isPlaying) {
      // Déclencher l'audio avec une interaction utilisateur
      await Tone.start();

      // Créer un synthétiseur basique
      const synth = new Tone.Synth().toDestination();

      // Jouer une note 'C4' pendant 1 seconde
      synth.triggerAttackRelease('C4', '6n');

      setIsPlaying(true);
    }
  };

  return (
    <div>
      <button onClick={playSound}>
        {isPlaying ? 'Playing...' : 'Play Sound'}
      </button>
    </div>
  );
};

export default ToneSynth;
