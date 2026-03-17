import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- 初級編のデータ構造 ---
const grammarData = [
  {
    level: "N5",
    label: "Beginner",
    categories: [
      { id: "n5-1", title: "文字と数字", videoUrl: "", quizUrl: "", points: ["Hiragana", "Numbers"] },
      { id: "n5-2", title: "名詞 (Nouns)", videoUrl: "", quizUrl: "", points: ["Noun①現在型", "Noun②過去型", "KOSOADO", "名詞文の練習"] },
      { id: "n5-3", title: "い形容詞 (I-adj)", videoUrl: "", quizUrl: "", points: ["I adjective 現在型", "I adjective 過去型", "い形容詞の文章練習"] },
      { id: "n5-4", title: "な形容詞 (Na-adj)", videoUrl: "", quizUrl: "", points: ["na adjective 現在型", "na adjective 過去型", "な形容詞の文章練習"] },
      { id: "n5-5", title: "実践 Speaking", videoUrl: "", quizUrl: "", points: ["5つの自己紹介", "定型文：レストラン注文"] }
    ]
  }
];

export default function App() {
  const [activeLevel, setActiveLevel] = useState("N5");
  const [completed, setCompleted] = useState(new Set());

  const currentLevel = grammarData.find(l => l.level === activeLevel);

  const togglePoint = (id) => {
    const next = new Set(completed);
    next.has(id) ? next.delete(id) : next.add(id);
    setCompleted(next);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>文法ロードマップ</h1>
        <p style={{ color: '#666' }}>Hana & Ruto Japanese Learning</p>
      </header>

      {currentLevel?.categories.map((cat) => (
        <section key={cat.id} style={{ marginBottom: '40px', borderLeft: '2px solid #ddd', paddingLeft: '20px' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '15px' }}>{cat.title}</h2>
          
          {/* 動画アコーディオン */}
          <details style={{ marginBottom: '15px', border: '1px solid #eee', borderRadius: '8px' }}>
            <summary style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#f9f9f9' }}>🎥 動画で学習（クリックで開く）</summary>
            <div style={{ padding: '10px', backgroundColor: '#000', color: '#fff', textAlign: 'center' }}>
              {cat.videoUrl ? <iframe src={cat.videoUrl} width="100%" /> : "動画を準備中..."}
            </div>
          </details>

          {/* 学習項目リスト */}
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cat.points.map(point => (
              <li key={point} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" checked={completed.has(point)} onChange={() => togglePoint(point)} />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {/* クイズボタン */}
          <button 
            onClick={() => window.open(cat.quizUrl, '_blank')}
            style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#000', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            ✍️ クイズに挑戦
          </button>
        </section>
      ))}
    </div>
  );
}

export default Index;
