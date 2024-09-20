import  React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelectedPlanet } from "../../contexts/SelectedPlanetContext";
import { useCameraContext } from "../../contexts/CameraContext";
import usePlanetData from "../../hooks/usePlanetData";

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const PLANET_DATA_LABEL_MAP = {
  atmospheric_composition: { label: "Atmospheric composition", unit: "" },
  avg_temperature: { label: "Average temperature", unit: "°C" },
  day_length: { label: "Day length", unit: "Earth days" },
  year_length: { label: "Year length", unit: "Earth days" },
  distance_from_sun: { label: "Distance from sun", unit: "km" },
  mass: { label: "Mass relative to Earth", unit: "x" },
  radius: { label: "Radius", unit: "km" },
} as const;

type PlanetDataKey = keyof typeof PLANET_DATA_LABEL_MAP;

const PlanetDetail: React.FC = () => {
  const [selectedPlanet] = useSelectedPlanet();
  const { cameraState } = useCameraContext();
  const { data: planetData } = usePlanetData(selectedPlanet?.name);

  const shouldDisplayDetails = cameraState === "DETAIL_VIEW";

  const getPlanetDataValue = (key: PlanetDataKey) => {
    // Provide more specific type for the planet data fields
    const value = planetData?.[key];
    if (typeof value === 'string' || typeof value === 'number') {
      return value;
    }
    return '';
  };

  return (
      <AnimatePresence>
        {shouldDisplayDetails && (
            <motion.div
                key={selectedPlanet ? selectedPlanet.name : "empty"}
                className="absolute left-5 right-5 top-20 mt-4 w-[400px]"
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={variants}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <h1 className="tracking-tight font-semibold text-7xl lg:text-8xl xl:text-8xl opacity-90">
                {selectedPlanet ? selectedPlanet.name : ""}
              </h1>
              <h4 className="tracking-tight text-2xl mb-5 ml-1 text-secondary font-semibold">
                {selectedPlanet?.displayStats.classification}
              </h4>

              <ul className="text-sm max-w-96 p-4 bg-zinc-700/50 rounded ml-2 hidden lg:flex flex-col gap-2 text-gray-200">
                {Object.entries(PLANET_DATA_LABEL_MAP).map(
                    ([key, { label, unit }]) => (
                        <li key={key} className="">
                          <p className="flex gap-2">
                            <span className="font-semibold">{label}</span>
                            <span>
                      {(key as PlanetDataKey) !== 'atmospheric_composition' &&  getPlanetDataValue(key as PlanetDataKey)} {unit}
                    </span>
                          </p>

                          {(key as PlanetDataKey) === "atmospheric_composition" && planetData?.atmospheric_composition && (
                              <ul className="list-disc list-inside">
                                {Object.entries(
                                    JSON.parse(
                                        planetData.atmospheric_composition
                                    )
                                ).map(([compKey, value]) => (
                                    <li key={compKey}>
                                      {compKey} - {value}%
                                    </li>
                                ))}
                              </ul>
                          )}
                        </li>
                    )
                )}
              </ul>
            </motion.div>
        )}
      </AnimatePresence>
  );
};

export default PlanetDetail;
