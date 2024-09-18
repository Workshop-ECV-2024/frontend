import * as v from "valibot";

const PlanetSchema = v.object({
  id: v.number(),
  name: v.optional(v.string()),
  radius: v.optional(v.string()),
  mass: v.optional(v.string()),
  distance_from_sun: v.optional(v.string()),
  day_length: v.optional(v.string()),
  year_length: v.optional(v.string()),
  atmospheric_composition: v.optional(v.string()),
  avg_temperature: v.optional(v.number()),
  created_at: v.optional(v.string()),
  updated_at: v.optional(v.string()),
});

export type PlanetSchemaInput = v.InferInput<typeof PlanetSchema>;
export type PlanetSchemaOutput = v.InferOutput<typeof PlanetSchema>;

export default PlanetSchema;
