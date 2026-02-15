import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import VoiceInput from "@/components/aproof/VoiceInput";
import DomainBars from "@/components/aproof/DomainBars";
import EvidencePanel from "@/components/aproof/EvidencePanel";
import TranscriptPanel from "@/components/aproof/TranscriptPanel";
import ClinicalSummary from "@/components/aproof/ClinicalSummary";
import { ArrowLeft } from "lucide-react";

export default function Demo() {
  const [transcript, setTranscript] = useState([]);
  const [domainLevels, setDomainLevels] = useState({});
  const [summary, setSummary] = useState("");

  // Append a turn to the transcript
  const handleTranscript = useCallback((entry) => {
    setTranscript((prev) => [...prev, entry]);
  }, []);

  // Process ICF analysis response and merge into domainLevels
  const handleAnalysis = useCallback((payload) => {
    if (!payload) return;
    const domains = payload.domains || [];

    setDomainLevels((prev) => {
      const next = { ...prev };
      for (const d of domains) {
        if (!d.code) continue;
        next[d.code] = {
          level: d.level,
          confidence: d.confidence,
          evidence: d.evidence || [],
          reasoning: d.reasoning || "",
        };
      }
      return next;
    });

    if (payload.summary) setSummary(payload.summary);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav bar */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Terug
          </Link>
          <h1 className="text-lg font-bold text-aproof-coral tracking-tight">
            A-PROOF Demo
          </h1>
          <div className="w-16" /> {/* spacer */}
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* -------- Left column -------- */}
          <div className="space-y-6">
            {/* Voice control */}
            <Card className="bg-white border-none shadow-md">
              <CardContent className="flex flex-col items-center py-8">
                <h2 className="text-lg font-semibold mb-4">Spraak invoer</h2>
                <VoiceInput
                  onTranscript={handleTranscript}
                  onAnalysis={handleAnalysis}
                />
              </CardContent>
            </Card>

            {/* Transcript */}
            <Card className="bg-white border-none shadow-md">
              <CardContent>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Transcript
                </h2>
                <TranscriptPanel transcript={transcript} />
              </CardContent>
            </Card>
          </div>

          {/* -------- Right column -------- */}
          <div className="space-y-6">
            {/* Domain bars — the hero */}
            <Card className="bg-white border-none shadow-md">
              <CardContent>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  ICF-domeinen
                </h2>
                <DomainBars domainLevels={domainLevels} />
              </CardContent>
            </Card>

            {/* Evidence */}
            <Card className="bg-white border-none shadow-md">
              <CardContent>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Sleutelwoorden
                </h2>
                <EvidencePanel domainLevels={domainLevels} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-width clinical summary */}
        {(summary || Object.keys(domainLevels).length > 0) && (
          <Card className="bg-white border-none shadow-md mt-6">
            <CardContent>
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Klinisch overzicht
              </h2>
              <ClinicalSummary domainLevels={domainLevels} summary={summary} />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
