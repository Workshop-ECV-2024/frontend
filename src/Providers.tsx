// Providers.tsx
import { ReactNode } from "react";
import { SelectedPlanetProvider } from "./contexts/SelectedPlanetContext";
import { SpeedControlProvider } from "./contexts/SpeedControlContext";
import { PlanetPositionsProvider } from "./contexts/PlanetPositionsContext";
import { CameraProvider } from "./contexts/CameraContext";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./lib/react-query";

type ProvidersProps = {
  children: ReactNode;
};

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <SelectedPlanetProvider>
          <SpeedControlProvider>
            <PlanetPositionsProvider>
              <CameraProvider>{children}</CameraProvider>
            </PlanetPositionsProvider>
          </SpeedControlProvider>
        </SelectedPlanetProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
};

export default Providers;
