import {SERVER_URL} from "../data/env.ts";
import {useQuery} from "@tanstack/react-query";

export default function useWeather(lat, long) {
    return useQuery({
        queryKey: ["weather", lat, long],
        queryFn: () =>
            fetch(
                `${SERVER_URL}/api/weather?latitude=${encodeURIComponent(lat ?? "")}&longitude=${encodeURIComponent(long ?? "")}`
            ).then(async res => await res.json()),
        enabled: !!lat && !!long,
    });
}