import { create } from "zustand";

import { generateAgentReply } from "@/lib/agent/generateAgentReply";
import { computeTypingDelay } from "@/lib/agent/rules";
import { selectAgentOptions, useOptionsStore } from "@/store/optionsStore";
import type {
  AgentMessage,
  AttachmentMeta,
  ChatMessage,
  GeneratedAgentMessage,
} from "@/types";

interface ChatStoreState {
  messages: ChatMessage[];
  isTyping: boolean;
  sendMessage: (input: { text: string; attachments: AttachmentMeta[] }) => void;
  appendAssistantMessage: (message: GeneratedAgentMessage) => void;
  clear: () => void;
}

let messageCounter = 0;
let typingTimeout: ReturnType<typeof setTimeout> | null = null;

function createMessageId(): string {
  messageCounter += 1;
  return `msg_${messageCounter}`;
}

export const useChatStore = create<ChatStoreState>((set, _get) => ({
  messages: [],
  isTyping: false,
  sendMessage: ({ text, attachments }) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }

    const createdAt = Date.now();
    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
      createdAt,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const options = selectAgentOptions(useOptionsStore.getState());
    const typingDelay = computeTypingDelay(trimmed, options, attachments);
    const assistantPayload = generateAgentReply(trimmed, options, attachments);

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    typingTimeout = setTimeout(() => {
      const assistantMessage: AgentMessage = {
        ...assistantPayload,
        id: createMessageId(),
        createdAt: Date.now(),
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }));
      typingTimeout = null;
    }, typingDelay);
  },
  appendAssistantMessage: (message) => {
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: createMessageId(), createdAt: Date.now() },
      ],
    }));
  },
  clear: () => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      typingTimeout = null;
    }
    messageCounter = 0;
    set({
      messages: [],
      isTyping: false,
    });
  },
}));
