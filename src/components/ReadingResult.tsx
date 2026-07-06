import type { ReadingOutput } from "../types/tarot";

interface ReadingResultProps {
  reading: ReadingOutput;
  onRestart: () => void;
}

export function ReadingResult({ reading, onRestart }: ReadingResultProps) {
  return (
    <section className="mt-5 space-y-4">
      <div className="rounded-lg border border-oracle/40 bg-black/25 p-5 shadow-glow">
        <p className="text-sm text-oracle">{new Date(reading.createdAt).toLocaleString("zh-CN")}</p>
        <h2 className="mt-2 font-display text-3xl text-white">{reading.question}</h2>
        <p className="mt-2 text-pearl/80">
          {reading.spreadName} · {reading.category} · {reading.timeframe} · {reading.subject}
        </p>
      </div>

      <article className="rounded-lg border border-white/10 bg-white/[.06] p-4">
        <h3 className="font-display text-2xl text-white">抽到的牌</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {reading.cards.map((card) => (
            <div key={`${card.position}-${card.cardName}-brief`} className="rounded-md border border-oracle/20 bg-black/20 px-3 py-2 text-sm text-pearl/85">
              <span className="text-oracle">{card.position}</span> · {card.cardName} · {card.orientation === "upright" ? "正位" : "逆位"}
            </div>
          ))}
        </div>
      </article>

      <div className="grid gap-3 md:grid-cols-2">
        {reading.cards.map((card) => (
          <article key={`${card.position}-${card.cardName}`} className="rounded-lg border border-white/10 bg-white/[.06] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-oracle">{card.position}</p>
                <h3 className="font-display text-2xl text-white">
                  {card.cardName} · {card.orientation === "upright" ? "正位" : "逆位"}
                </h3>
              </div>
              <div className="min-w-16 rounded-md border border-oracle/30 px-2 py-1 text-center text-xs text-oracle">{card.keywords.slice(0, 2).join(" / ")}</div>
            </div>
            <p className="mt-3 text-sm leading-6 text-pearl/80">{card.positionMeaning}</p>
            <p className="mt-2 text-sm leading-6 text-white/90">{card.meaning}</p>
          </article>
        ))}
      </div>

      <ResultBlock title="组合解读" text={reading.combinationReading} />
      <ResultBlock title="整体总结" text={reading.overallSummary} />
      <ResultBlock title="行动建议" text={reading.advice} preserveLines />

      <div className="grid gap-3 md:grid-cols-2">
        <ListBlock title="使用到的知识库片段" items={reading.knowledgeUsed} />
        <ListBlock title="参考的相似案例" items={reading.similarCasesUsed} />
      </div>

      <div className="rounded-lg border border-oracle/30 bg-oracle/10 p-4 text-sm leading-6 text-pearl/90">{reading.disclaimer}</div>
      <button onClick={onRestart} className="w-full rounded-md bg-oracle px-5 py-3 font-semibold text-night transition hover:bg-[#e2b963]">
        重新测算
      </button>
    </section>
  );
}

function ResultBlock({ title, text, preserveLines = false }: { title: string; text: string; preserveLines?: boolean }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[.06] p-4">
      <h3 className="font-display text-2xl text-white">{title}</h3>
      <p className={`mt-2 text-sm leading-7 text-pearl/85 ${preserveLines ? "whitespace-pre-line" : ""}`}>{text}</p>
    </article>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <article className="rounded-lg border border-white/10 bg-white/[.06] p-4">
      <h3 className="font-display text-xl text-white">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm text-pearl/80">
        {items.map((item) => (
          <li key={item} className="rounded-md bg-black/20 px-3 py-2">
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
