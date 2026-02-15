import { createClientFromRequest } from "npm:@base44/sdk@0.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const conversationText = body.conversationText || "";
    const recentTranscript = body.recentTranscript || "";

    if (!conversationText && !recentTranscript) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const textToAnalyze = recentTranscript || conversationText;

    const prompt = `Je bent een klinisch taalmodel getraind op Nederlandse medische teksten, gebaseerd op het A-PROOF project (VU Amsterdam/CLTL).

Analyseer de volgende patiënt-uitspraak en bepaal welke van de 9 ICF-domeinen worden besproken. Geef per domein een functioneringsniveau.

De 9 A-PROOF domeinen:
1. b1300 - Energieniveau (schaal 0-4, waar 4 = geen probleem)
2. b140 - Aandachtsfuncties (schaal 0-4)
3. b152 - Emotionele functies (schaal 0-4)
4. b440 - Ademhalingsfuncties (schaal 0-4)
5. b455 - Inspanningstolerantie (schaal 0-5, waar 5 = geen probleem)
6. b530 - Gewichtshandhaving (schaal 0-4)
7. d450 - Lopen/FAC (schaal 0-5, waar 5 = geen probleem)
8. d550 - Eten (schaal 0-4)
9. d840-d859 - Werk en werkgelegenheid (schaal 0-4)

Belangrijk:
- Alleen domeinen rapporteren die DUIDELIJK in de tekst worden besproken
- Hogere scores betekenen MINDER problemen (A-PROOF conventie)
- Geef evidence: welke woorden/zinnen leidden tot de detectie
- Geef een confidence score (0-1) per domein

Tekst om te analyseren:
"${textToAnalyze}"`;

    const response = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          domains: {
            type: "array",
            items: {
              type: "object",
              properties: {
                code: { type: "string", description: "ICF code (e.g. b1300, d450)" },
                name: { type: "string", description: "Domain name in Dutch" },
                level: { type: "number", description: "Functioning level (0-4 or 0-5)" },
                max_level: { type: "number", description: "Maximum level for this domain (4 or 5)" },
                confidence: { type: "number", description: "Confidence score 0-1" },
                evidence: { type: "array", items: { type: "string" }, description: "Keywords/phrases that triggered detection" },
                reasoning: { type: "string", description: "Brief explanation" }
              },
              required: ["code", "name", "level", "max_level", "confidence", "evidence"]
            }
          },
          summary: { type: "string", description: "Brief clinical summary in Dutch" },
          keywords_found: { type: "array", items: { type: "string" } }
        },
        required: ["domains", "summary"]
      }
    });

    return new Response(JSON.stringify({ data: response }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("Error analyzing ICF domains:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
