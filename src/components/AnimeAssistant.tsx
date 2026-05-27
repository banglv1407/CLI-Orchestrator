import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AssistantState } from '../types';

interface AnimeAssistantProps {
  state: AssistantState;
  text: string;
}

interface Animal {
  name: string;
  idle: string[][];
  active: string[][];
  error: string[][];
  done: string[][];
}

const ANIMALS: Animal[] = [
  {
    name: 'Kitty',
    idle: [
      [
        "  /\\_/\\  ",
        " ( o.o ) ",
        "  > ^ <  "
      ],
      [
        "  /\\_/\\  ",
        " ( -.- ) ",
        "  >'-'<  "
      ]
    ],
    active: [
      [
        "  /\\_/\\  ",
        " ( >.< ) ",
        "  ~ ^ ~  "
      ],
      [
        "  /\\_/\\  ",
        " ( ^.^ ) ",
        "  > * <  "
      ]
    ],
    error: [
      [
        "  /\\_/\\  ",
        " ( x.x ) ",
        "  > m <  "
      ]
    ],
    done: [
      [
        "  /\\_/\\  ",
        " ( @.@ ) ",
        "  > ▽ <  "
      ]
    ]
  },
  {
    name: 'Bunny',
    idle: [
      [
        "  (\\_/)  ",
        "  (o.o)  ",
        " (> <) "
      ],
      [
        "  (\\_/)  ",
        "  (-.-)  ",
        " (> <) "
      ]
    ],
    active: [
      [
        "  (\\_/)  ",
        "  (0.0)  ",
        " (>O<) "
      ],
      [
        "  (\\_/)  ",
        "  (^.^)  ",
        " (> <) "
      ]
    ],
    error: [
      [
        "  (\\_/)  ",
        "  (x.x)  ",
        " (>_<) "
      ]
    ],
    done: [
      [
        "  (\\_/)  ",
        "  (*_*)  ",
        " (>▽<) "
      ]
    ]
  },
  {
    name: 'Bear',
    idle: [
      [
        "  (o.o)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ],
      [
        "  (-.-)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ]
    ],
    active: [
      [
        "  (Q.Q)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ],
      [
        "  (^.^)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ]
    ],
    error: [
      [
        "  (x.x)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ]
    ],
    done: [
      [
        "  (♥.♥)  ",
        "  /)  )\\ ",
        " (,,)(,,)"
      ]
    ]
  },
  {
    name: 'Owl',
    idle: [
      [
        "  {o,o}  ",
        "  /)_)   ",
        "   \" \"   "
      ],
      [
        "  {-.o}  ",
        "  /)_)   ",
        "   \" \"   "
      ]
    ],
    active: [
      [
        "  {O.O}  ",
        "  /( )\\_ ",
        "   \" \"   "
      ],
      [
        "  {^.^}  ",
        "  /)_)   ",
        "   \" \"   "
      ]
    ],
    error: [
      [
        "  {x,x}  ",
        "  /)_)   ",
        "   \" \"   "
      ]
    ],
    done: [
      [
        "  {@,@}  ",
        "  /)_)   ",
        "   \" \"   "
      ]
    ]
  },
  {
    name: 'VoltRat',
    idle: [
      [
        "  /\\/\\   ",
        " (o.o )  ",
        "  > ^ <  "
      ],
      [
        "  /\\/\\   ",
        " (-.- )  ",
        "  > - <  "
      ]
    ],
    active: [
      [
        "  /\\/\\   ",
        " (>.< )  ",
        " ⚡ ^ ⚡ "
      ],
      [
        "  /\\/\\   ",
        " (^.^ )  ",
        " ⚡ * ⚡ "
      ]
    ],
    error: [
      [
        "  /\\/\\   ",
        " (x.x )  ",
        "  >_m_<  "
      ]
    ],
    done: [
      [
        "  /\\/\\   ",
        " (@.@ )  ",
        " ⭐v⭐ "
      ]
    ]
  }
];

const moodBorderColor: Record<AssistantState, string> = {
  Idle: 'border-cyber-neon/40 bg-cyber-neon/5 text-cyber-neon',
  Thinking: 'border-cyber-electric/40 bg-cyber-electric/5 text-cyber-electric',
  'Running CLI': 'border-cyber-glow/40 bg-cyber-glow/5 text-cyber-glow',
  Error: 'border-cyber-warn/40 bg-cyber-warn/5 text-cyber-warn',
  Done: 'border-cyber-neon bg-cyber-neon/10 text-cyber-neon',
};

export function AnimeAssistant({ state, text }: AnimeAssistantProps) {
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [frameIndex, setFrameIndex] = useState(0);

  // Randomize animal once on mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * ANIMALS.length);
    setSelectedAnimal(ANIMALS[randomIndex]);
  }, []);

  // Set up animation frames shifting
  useEffect(() => {
    const intervalTime = state === 'Thinking' || state === 'Running CLI' ? 300 : 750;
    const interval = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % 2);
    }, intervalTime);
    return () => clearInterval(interval);
  }, [state]);

  const getCurrentFrames = () => {
    if (!selectedAnimal) return [];

    let framesList: string[][];
    if (state === 'Error') {
      framesList = selectedAnimal.error;
    } else if (state === 'Done') {
      framesList = selectedAnimal.done;
    } else if (state === 'Thinking' || state === 'Running CLI') {
      framesList = selectedAnimal.active;
    } else {
      framesList = selectedAnimal.idle;
    }

    const currentFrame = framesList[frameIndex % framesList.length];
    return currentFrame || framesList[0] || [];
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl border border-cyber-line bg-cyber-panel/40 p-3"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-cyber-electric/5 blur-2xl" />

      <div className="flex items-center gap-3">
        {/* Animated ASCII Animal Panel */}
        <AnimatePresence mode="wait">
          {selectedAnimal && (
            <motion.div
              key={selectedAnimal.name}
              animate={
                state === 'Thinking' || state === 'Running CLI'
                  ? { 
                      y: [0, -3, 0], 
                      rotate: [-1.5, 1.5, -1.5],
                      scale: [1, 1.02, 1] 
                    }
                  : state === 'Error'
                  ? { 
                      x: [-2, 2, -2, 2, 0],
                      scale: [1, 0.96, 1] 
                    }
                  : state === 'Done'
                  ? { 
                      y: [0, -8, 0, -4, 0], 
                      scale: [1, 1.04, 1] 
                    }
                  : { 
                      y: [0, -1.5, 0], // Idle gentle breathing
                    }
              }
              transition={
                state === 'Thinking' || state === 'Running CLI'
                  ? { duration: 0.6, repeat: Infinity, ease: "easeInOut" }
                  : state === 'Error'
                  ? { duration: 0.4, repeat: 2, ease: "easeInOut" }
                  : state === 'Done'
                  ? { duration: 0.8, ease: "easeOut" }
                  : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
              }
              className={`flex shrink-0 flex-col items-center justify-center rounded-lg border p-1.5 font-mono text-[10px] leading-[1.1] select-none ${moodBorderColor[state]} w-20 h-16 shadow-neon-sm-faint`}
            >
              {getCurrentFrames().map((line, idx) => (
                <div key={idx} className="whitespace-pre">
                  {line}
                </div>
              ))}
              <span className="mt-0.5 text-[7.5px] opacity-60 tracking-wider font-semibold uppercase">{selectedAnimal.name}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[10px] uppercase tracking-[0.2em] text-cyber-neon font-bold">Assistant</h3>
          <p className="text-xs text-slate-200 mt-0.5 leading-snug line-clamp-2" title={text}>{text}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">State:</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-cyber-electric">{state}</span>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
