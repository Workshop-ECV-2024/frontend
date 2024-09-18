import { useQuery } from "@tanstack/react-query";
import PlanetSchema from "../validation/PlanetSchema";
import * as v from "valibot";
import { SERVER_URL } from "../data/env";
import { Nullish } from "../../types";

export default function usePlanetData(planetName: Nullish<string>) {
  return useQuery({
    queryKey: ["planet", planetName],
    queryFn: () =>
      fetch(
        `${SERVER_URL}/api/planet?name=${encodeURIComponent(planetName ?? "")}`
      ).then(async res => v.parse(PlanetSchema, await res.json())),
    enabled: !!planetName,
  });
}
