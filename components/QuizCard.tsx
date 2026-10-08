"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, FileText, Zap, ChevronRight, X, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types";

interface QuizCardProps {
  quiz: Quiz;
  onComplete: (allCorrect: boolean) => void;
}

type QuizState = "idle" | "question" | "feedback" | "complete";

export default function QuizCard({ quiz, onComplete }: QuizCardProps) {
  const [state, setState] = useState<QuizState>("idle");
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const question = quiz.questions[currentQ];
  const isCorrect = selectedAnswer === question?.correct_index;

  const handleStart = () => {
    setState("question");
    setCurrentQ(0);
    setSelectedAnswer(null);
    setCorrectCount(0);
  };

  const handleAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setState("feedback");
    if (idx === question.correct_index) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNext = () => {
    if (currentQ + 1 < quiz.questions.length) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setState("question");
    } else {
      setState("complete");
      onComplete(correctCount + (isCorrect ? 1 : 0) === quiz.questions.length);
    }
  };

  if (state === "idle") {
    return (
      <div className="bg-[#141414] rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-white/40 bg-white/5 px-2 py-1 rounded-full">
              DAILY DROP
            </span>
            <span className="text-xs font-bold text-[#00d4a0] flex items-center gap-1">
              <Zap className="w-3 h-3" />
              +{quiz.xp_reward} XP
            </span>
          </div>
          <h3 className="text-lg font-bold text-white mb-1">{quiz.description}</h3>
          <p className="text-sm text-white/50 mb-4">Topic: {quiz.topic}</p>
          <div className="flex items-center gap-4 text-xs text-white/40 mb-4">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {quiz.read_time}
            </span>
            <span className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {quiz.questions.length} Quick Qs
            </span>
            <span className="px-2 py-0.5 bg-[#00d4a0]/10 text-[#00d4a0] rounded-full text-[10px] font-semibold">
              BITE-SIZED
            </span>
          </div>
        </div>
        <button
          onClick={handleStart}
          className="w-full bg-[#00d4a0] text-[#0d0d0d] font-bold py-4 flex items-center justify-center gap-2 hover:bg-[#00e8af] transition-colors"
        >
          Start Quiz →
        </button>
      </div>
    );
  }

  if (state === "complete") {
    const allCorrect = correctCount === quiz.questions.length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#141414] rounded-2xl border border-white/5 p-6 text-center"
      >
        <div className="text-5xl mb-4">{allCorrect ? "🎉" : "📚"}</div>
        <h3 className="text-xl font-bold text-white mb-2">
          {allCorrect ? "Perfect Score!" : "Good Effort!"}
        </h3>
        <p className="text-white/50 text-sm mb-4">
          {correctCount}/{quiz.questions.length} correct answers
        </p>
        {allCorrect && (
          <div className="bg-[#00d4a0]/10 border border-[#00d4a0]/20 rounded-xl p-3 mb-4">
            <p className="text-[#00d4a0] text-sm font-semibold">
              +{quiz.xp_reward} XP earned! Streak extended 🔥
            </p>
          </div>
        )}
        <button
          onClick={() => setState("idle")}
          className="w-full bg-white/5 text-white py-3 rounded-xl font-medium hover:bg-white/10 transition-colors"
        >
          Done
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      key={currentQ}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-[#141414] rounded-2xl border border-white/5 p-4"
    >
      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-white/40">
          Q{currentQ + 1} of {quiz.questions.length}
        </span>
        <div className="flex gap-1">
          {quiz.questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-6 h-1 rounded-full transition-colors",
                i < currentQ
                  ? "bg-[#00d4a0]"
                  : i === currentQ
                  ? "bg-white/40"
                  : "bg-white/10"
              )}
            />
          ))}
        </div>
      </div>

      <p className="text-white font-semibold text-base mb-5">{question.question}</p>

      <div className="space-y-2 mb-4">
        {question.options.map((option, idx) => {
          const isSelected = selectedAnswer === idx;
          const showResult = state === "feedback";
          const isCorrectOption = idx === question.correct_index;

          return (
            <motion.button
              key={idx}
              onClick={() => handleAnswer(idx)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all border",
                showResult && isCorrectOption
                  ? "bg-[#00d4a0]/15 border-[#00d4a0] text-[#00d4a0]"
                  : showResult && isSelected && !isCorrectOption
                  ? "bg-red-500/15 border-red-500/50 text-red-400"
                  : isSelected
                  ? "bg-white/10 border-white/30 text-white"
                  : "bg-white/5 border-white/5 text-white/70 hover:bg-white/8 hover:border-white/15"
              )}
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult && isCorrectOption && (
                  <CheckCircle2 className="w-4 h-4 text-[#00d4a0] shrink-0" />
                )}
                {showResult && isSelected && !isCorrectOption && (
                  <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                )}
              </div>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {state === "feedback" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="bg-white/5 rounded-xl p-3 mb-4"
          >
            <p className="text-xs text-white/60 leading-relaxed">{question.explanation}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {state === "feedback" && (
        <button
          onClick={handleNext}
          className="w-full bg-[#00d4a0] text-[#0d0d0d] font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#00e8af] transition-colors"
        >
          {currentQ + 1 < quiz.questions.length ? "Next →" : "Finish 🎉"}
        </button>
      )}
    </motion.div>
  );
}
