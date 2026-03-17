import { useState, useCallback, useMemo } from "react";
import { grammarData } from "@/data/grammarData";
import ProgressBar from "@/components/ProgressBar";
import LevelSelector from "@/components/LevelSelector";
import GrammarNode from "@/components/GrammarNode";
import { motion } from "framer-motion";

const STORAGE_KEY = "grammar-roadmap-progress";

const loadProgress = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveProgress = (set: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
};

const Index = () => {
  const [activeLevel, setActiveLevel] = useState("N5");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(loadProgress);

  const currentLevel = grammarData.find((l) => l.level === activeLevel)!;

  const togglePoint = useCallback((id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveProgress(next);
      return next;
    });
  }, []);

  const completedByLevel = useMemo(() => {
    const map: Record<string, { completed: number; total: number }> = {};
    grammarData.forEach((lvl) => {
      const allPoints = lvl.categories.flatMap((c) => c.points);
      map[lvl.level] = {
        total: allPoints.length,
        completed: allPoints.filter((p) => completed.has(p.id)).length,
      };
    });
    return map;
  }, [completed]);

  const stats = completedByLevel[activeLevel];

  return (
    <div className="min-h-screen bg-background">
      <ProgressBar completed={stats.completed} total={stats.total} level={activeLevel} />

      {/* Header */}
      <div className="max-w-2xl mx-auto px-4 pt-8 pb-6 text-center">
        <motion.h1
          className="font-display font-extrabold text-3xl md:text-4xl text-foreground"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          文法ロードマップ
        </motion.h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Japanese Grammar Roadmap — JLPT N5〜N3
        </p>

        <div className="mt-6">
          <LevelSelector
            levels={grammarData}
            activeLevel={activeLevel}
            onSelect={(lvl) => {
              setActiveLevel(lvl);
              setExpandedId(null);
            }}
            completedByLevel={completedByLevel}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-2xl mx-auto px-4 pb-20 relative">
        {/* Vertical line */}
        <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-border" />

        {currentLevel.categories.map((cat, i) => (
          <GrammarNode
            key={cat.id}
            category={cat}
            index={i}
            isExpanded={expandedId === cat.id}
            onToggle={() => setExpandedId(expandedId === cat.id ? null : cat.id)}
            completedPoints={completed}
            onTogglePoint={togglePoint}
            side={i % 2 === 0 ? "left" : "right"}
          />
        ))}

        {/* End marker */}
        <div className="flex justify-center mt-4">
          <div className="w-3 h-3 rounded-full bg-border" />
        </div>
      </div>
    </div>
  );
};

export default Index;
