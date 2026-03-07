import { motion } from 'framer-motion';
import type { AssistantState } from '../types';

interface AnimeAssistantProps {
  state: AssistantState;
  text: string;
}

const moodColor: Record<AssistantState, string> = {
  Idle: 'from-cyan-400 to-blue-500',
  Thinking: 'from-lime-300 to-cyan-500',
  'Running CLI': 'from-cyan-300 to-emerald-400',
  Error: 'from-rose-400 to-red-500',
  Done: 'from-teal-300 to-lime-400',
};

export function AnimeAssistant({ state, text }: AnimeAssistantProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-cyber-line bg-cyber-panel/70 p-4"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyber-electric/10 blur-2xl" />

      <div className="flex items-center gap-4">
        <motion.div
          animate={{ scale: state === 'Thinking' || state === 'Running CLI' ? [1, 1.08, 1] : 1 }}
          transition={{ duration: 1.6, repeat: state === 'Idle' ? 0 : Infinity }}
          className={`h-16 w-16 rounded-full bg-gradient-to-br ${moodColor[state]} p-1 shadow-neon`}
        >
          <div className="flex h-full w-full items-center justify-center rounded-full bg-cyber-base font-display text-xl text-white">AI</div>
        </motion.div>

        <div>
          <h3 className="font-display text-xs uppercase tracking-[0.2em] text-cyber-neon">Assistant</h3>
          <p className="text-sm text-slate-200">{text}</p>
          <p className="mt-1 text-xs uppercase tracking-wider text-slate-400">State: {state}</p>
        </div>
      </div>
    </motion.section>
  );
}
