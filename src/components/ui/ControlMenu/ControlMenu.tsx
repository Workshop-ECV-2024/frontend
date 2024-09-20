import { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useCameraContext } from '../../../contexts/CameraContext';
import CameraHomeButton from "./CameraHomeButton";
import InfoButton from "./InfoButton";
import ExitViewButon from "./ExitViewButon";
import HelpButton from "./HelpButton";
import CreateJam from '../../CreateJam';

const ControlMenu = () => {
    const { cameraState } = useCameraContext();
    const controls = useAnimation();
    const [showCreateJam, setShowCreateJam] = useState(false); // État pour afficher ou masquer CreateJam

    useEffect(() => {
        if (cameraState === 'FREE') { 
            controls.start('visible');
        }
    }, [cameraState, controls]);

    const menuVariants = {
        hidden: { y: '-140%', opacity: 1 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    return (
        <div>
            {/* Menu de contrôle */}
            <motion.div 
              className="
                absolute top-5 left-5
                p-2
                border-2
                border-secondary-100
                rounded-xl
                bg-black
                z-10
              "
              variants={menuVariants}
              initial="hidden"
              animate={controls}
            >
                <div className="flex gap-x-2">
                    <CameraHomeButton />
                    <InfoButton />
                    <HelpButton />

                    {/* Bouton Create Jam */}
                    <button
                        onClick={() => setShowCreateJam(true)} // Affiche CreateJam
                        className="bg-[rgba(137,104,168,0.32)] hover:bg-[rgba(116,64,165,0.49)] text-[rgba(139,103,172,0.32) font-bold py-2 px-4 rounded-full"
                    >
                        Create Jam
                    </button>

                    <ExitViewButon />
                </div>
            </motion.div>

            {/* Affichage du composant CreateJam si l'état est vrai */}
            {showCreateJam && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="relative shadow-lg">
                        <CreateJam />
                        
                        {/* Bouton pour fermer CreateJam */}
                        <button
                            onClick={() => setShowCreateJam(false)} // Masque CreateJam
                            className="absolute top-2 right-2 text-red font-bold py-1 px-2 rounded-full"
                        >
                            ✖
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ControlMenu;
