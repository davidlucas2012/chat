import { create } from "zustand";
import { persist } from "zustand/middleware";

import type {
  AgentOptions,
  FocusOption,
  ModelChoice,
  ResponseLength,
  ToneOption,
} from "@/types";

interface OptionsState extends AgentOptions {
  setResponseLength: (length: ResponseLength) => void;
  setModel: (model: ModelChoice) => void;
  setTone: (tone: ToneOption) => void;
  setFocus: (focus: FocusOption) => void;
  reset: () => void;
}

const DEFAULT_OPTIONS: AgentOptions = {
  responseLength: "medium",
  model: "gpt-prose",
  tone: "neutral",
  focus: "overview",
};

export const useOptionsStore = create<OptionsState>()(
  persist(
    (set) => ({
      ...DEFAULT_OPTIONS,
      setResponseLength: (responseLength) => set({ responseLength }),
      setModel: (model) => set({ model }),
      setTone: (tone) => set({ tone }),
      setFocus: (focus) => set({ focus }),
      reset: () => set(DEFAULT_OPTIONS),
    }),
    {
      name: "chat-options",
      version: 1,
      partialize: (state) => ({
        responseLength: state.responseLength,
        model: state.model,
        tone: state.tone,
        focus: state.focus,
      }),
    },
  ),
);

export const selectAgentOptions = (state: OptionsState): AgentOptions => ({
  responseLength: state.responseLength,
  model: state.model,
  tone: state.tone,
  focus: state.focus,
});
