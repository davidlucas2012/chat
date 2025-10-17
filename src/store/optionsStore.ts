import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AgentOptions,
  ModelChoice,
  ResponseLength,
  ToneOption,
} from "@/types";

interface OptionsState extends AgentOptions {
  setResponseLength: (length: ResponseLength) => void;
  setModel: (model: ModelChoice) => void;
  setTone: (tone: ToneOption) => void;
  reset: () => void;
}

const DEFAULT_OPTIONS: AgentOptions = {
  responseLength: "medium",
  model: "gpt-prose",
  tone: "neutral",
};

export const useOptionsStore = create<OptionsState>()(
  persist(
    (set) => ({
      ...DEFAULT_OPTIONS,
      setResponseLength: (responseLength) => set({ responseLength }),
      setModel: (model) => set({ model }),
      setTone: (tone) => set({ tone }),
      reset: () => set(DEFAULT_OPTIONS),
    }),
    {
      name: "chat-options",
      version: 2,
      partialize: (state) => ({
        responseLength: state.responseLength,
        model: state.model,
        tone: state.tone,
      }),
      migrate: (state) => {
        if (!state || typeof state !== "object") {
          return DEFAULT_OPTIONS;
        }
        const {
          responseLength = DEFAULT_OPTIONS.responseLength,
          model = DEFAULT_OPTIONS.model,
          tone = DEFAULT_OPTIONS.tone,
        } = state as Partial<AgentOptions>;
        return {
          responseLength,
          model,
          tone,
        };
      },
    },
  ),
);

export const selectAgentOptions = (state: OptionsState): AgentOptions => ({
  responseLength: state.responseLength,
  model: state.model,
  tone: state.tone,
});
