import { ZodTypeAny } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { BedrockAssetsSchema } from "../schemas/zod/bedrock.ts";
import {
  DowngradesSchema,
  FormatDowngradeSchema,
} from "../schemas/zod/downgrades.ts";
import { JavaAssetsSchema } from "../schemas/zod/java.ts";

function processSchema(path: string, zodSchema: ZodTypeAny): void {
  const jsonSchema = zodToJsonSchema(zodSchema);
  const jsonSchemaString = JSON.stringify(jsonSchema, null, 2);

  Deno.writeTextFileSync(path, jsonSchemaString);
}

processSchema("schemas/json/java.json", JavaAssetsSchema);
processSchema("schemas/json/bedrock.json", BedrockAssetsSchema);

processSchema("schemas/json/downgrades.json", DowngradesSchema);
processSchema("schemas/json/format-downgrade.json", FormatDowngradeSchema);
