import { APROOF_DOMAINS } from "@/lib/aproof-domains";
import { Badge } from "@/components/ui/badge";

export default function EvidencePanel({ domainLevels = {} }) {
  const detected = APROOF_DOMAINS.filter((d) => domainLevels[d.code]?.evidence?.length > 0);

  if (detected.length === 0) {
    return (
      <div className="text-center py-6 text-sm text-muted-foreground">
        Nog geen sleutelwoorden gedetecteerd...
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {detected.map((domain) => {
        const result = domainLevels[domain.code];
        return (
          <div key={domain.code} className="flex flex-wrap items-center gap-2">
            <Badge
              className="text-white text-[10px] shrink-0"
              style={{ backgroundColor: domain.color }}
            >
              {domain.name}
            </Badge>
            {result.evidence.map((kw, i) => (
              <span
                key={i}
                className="text-xs px-2 py-0.5 rounded-md bg-muted text-foreground"
              >
                {kw}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
}
