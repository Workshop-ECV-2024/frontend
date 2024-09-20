import React from "react";
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
  // name: { label: "Nom" },
  atmospheric_composition: { label: "Atmospheric composition", unit: "" },
  avg_temperature: { label: "Average temperature", unit: "°C" },
  day_length: { label: "Day length", unit: "Earth days" },
  year_length: { label: "Year length", unit: "Earth days" },
  distance_from_sun: { label: "Distance from sun", unit: "km" },
  mass: { label: "Mass relative to Earth", unit: "x" },
  radius: { label: "Radius", unit: "km" },
} as const satisfies {
  [TKey in Exclude<
    keyof NonNullable<Required<ReturnType<typeof usePlanetData>["data"]>>,
    "created_at" | "updated_at" | "id" | "name"
  >]: {
    label: string;
    unit?: string;
  };
};

type PlanetDataKey = keyof typeof PLANET_DATA_LABEL_MAP;

const PlanetDetail: React.FC = () => {
  const [selectedPlanet] = useSelectedPlanet();
  const { cameraState } = useCameraContext();
  const { data: planetData } = usePlanetData(selectedPlanet?.name);

  const shouldDisplayDetails = cameraState === "DETAIL_VIEW";


  return (
      // @ts-ignore
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
          {/* Détails de la planète */}
          <h1 className="tracking-tight font-semibold text-7xl lg:text-8xl xl:text-8xl opacity-90">
            {selectedPlanet ? selectedPlanet.name : ""}
          </h1>
          <h4 className="tracking-tight text-2xl mb-5 ml-1 text-secondary font-semibold">
            {selectedPlanet?.displayStats.classification}
          </h4>

          {/* Data list */}
          <ul className="text-sm max-w-96 p-4 bg-zinc-700/50 rounded ml-2 hidden lg:flex flex-col gap-2 text-gray-200">
            {Object.entries(PLANET_DATA_LABEL_MAP).map(
              ([key, { label, unit }]) => (
                // Each spec
                <li key={key} className="">
                  <p className="flex gap-2">
                    <span className="font-semibold">{label}</span>
                    <span className="">
                      {/* String value */}
                      {(key as PlanetDataKey) !== "atmospheric_composition" &&
                        planetData?.[key as PlanetDataKey]}{" "}
                      {/* Unit */}
                      {unit}
                    </span>
                  </p>

                  {/* Atmospheric composition values */}
                  {(key as PlanetDataKey) === "atmospheric_composition" && (
                    <ul className="list-disc list-inside">
                      {Object.entries(
                        JSON.parse(
                          planetData?.[
                            // juste pour flex un peu, je sais que c'est horrible mais trkl
                            key as "atmospheric_composition" satisfies PlanetDataKey
                          ] ?? ""
                        )
                      ).map(([key, value]) => (
                          // @ts-ignore
                        <li key={key}>
                          {key} - {value}%
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
