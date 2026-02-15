import { APROOF_DOMAINS } from "@/lib/aproof-domains";

export default function ClinicalSummary({ domainLevels = {}, summary = "" }) {
  const detected = APROOF_DOMAINS.filter(
    (d) => domainLevels[d.code]?.level !== null && domainLevels[d.code]?.level !== undefined
  );

  if (detected.length === 0 && !summary) return null;

  return (
    <div className="space-y-4">
      {summary && (
        <p className="text-sm text-foreground leading-relaxed">{summary}</p>
      )}

      {detected.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 pr-4 font-semibold text-muted-foreground">Domein</th>
                <th className="py-2 pr-4 font-semibold text-muted-foreground">Code</th>
                <th className="py-2 pr-4 font-semibold text-muted-foreground">Niveau</th>
                <th className="py-2 font-semibold text-muted-foreground">Betrouwbaarheid</th>
              </tr>
            </thead>
            <tbody>
              {detected.map((domain) => {
                const r = domainLevels[domain.code];
                return (
                  <tr key={domain.code} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-medium">{domain.name}</td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted-foreground">{domain.code}</td>
                    <td className="py-2 pr-4">
                      {r.level}/{domain.maxLevel}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {r.confidence != null ? `${Math.round(r.confidence * 100)}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
