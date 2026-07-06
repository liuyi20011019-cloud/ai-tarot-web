import { useMemo, useState } from "react";
import { CardDeck } from "./components/CardDeck";
import { HistoryList } from "./components/HistoryList";
import { Layout } from "./components/Layout";
import { QuestionForm } from "./components/QuestionForm";
import { ReadingResult } from "./components/ReadingResult";
import { SpreadRecommendation } from "./components/SpreadRecommendation";
import { generateReading } from "./lib/interpretationEngine";
import { getRecommendationReason, recommendSpread } from "./lib/spreadSelector";
import { saveReading } from "./lib/historyStorage";
import type { DrawnCard, QuestionInput, ReadingOutput, Spread } from "./types/tarot";

type Step = "question" | "draw" | "result";

const initialQuestion: QuestionInput = {
  question: "",
  category: "感情",
  timeframe: "近一个月",
  subject: "自己",
  background: "",
};

export default function App() {
  const [step, setStep] = useState<Step>("question");
  const [questionInput, setQuestionInput] = useState<QuestionInput>(initialQuestion);
  const [selectedSpread, setSelectedSpread] = useState<Spread>(() => recommendSpread(initialQuestion));
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [reading, setReading] = useState<ReadingOutput | null>(null);
  const [historyRefresh, setHistoryRefresh] = useState(0);

  const recommendationReason = useMemo(() => getRecommendationReason(questionInput, selectedSpread), [questionInput, selectedSpread]);

  const recommend = () => {
    setSelectedSpread(recommendSpread(questionInput));
    setStep("question");
  };

  const completeReading = (cards: DrawnCard[]) => {
    const output = generateReading({ ...questionInput, spread: selectedSpread, drawnCards: cards });
    saveReading(output);
    setReading(output);
    setHistoryRefresh((value) => value + 1);
    setStep("result");
  };

  const restart = () => {
    setDrawnCards([]);
    setReading(null);
    setStep("question");
  };

  return (
    <Layout>
      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          {step === "question" ? (
            <>
              <QuestionForm value={questionInput} onChange={setQuestionInput} onSubmit={recommend} />
              {questionInput.question.trim() ? (
                <SpreadRecommendation
                  spread={selectedSpread}
                  reason={recommendationReason}
                  onSelect={setSelectedSpread}
                  onStart={() => {
                    setDrawnCards([]);
                    setStep("draw");
                  }}
                />
              ) : null}
            </>
          ) : null}
          {step === "draw" ? <CardDeck spread={selectedSpread} drawnCards={drawnCards} setDrawnCards={setDrawnCards} onComplete={completeReading} /> : null}
          {step === "result" && reading ? <ReadingResult reading={reading} onRestart={restart} /> : null}
        </div>
        <aside className="lg:sticky lg:top-4 lg:self-start">
          <div className="rounded-lg border border-oracle/20 bg-white/[.05] p-4">
            <p className="text-sm text-oracle">当前流程</p>
            <div className="mt-3 space-y-2 text-sm">
              {["输入问题", "推荐牌阵", "抽牌动画", "生成解读", "保存历史"].map((item, index) => (
                <div key={item} className="flex items-center gap-2 text-pearl/80">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-oracle/40 text-xs text-oracle">{index + 1}</span>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
      <HistoryList refreshKey={historyRefresh} />
    </Layout>
  );
}
