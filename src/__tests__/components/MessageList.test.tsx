import type { JSX } from "react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("framer-motion", async () => {
  const React = await import("react");
  const createMock = (tag: keyof JSX.IntrinsicElements) =>
    React.forwardRef<HTMLElement, Record<string, unknown>>((props, ref) =>
      React.createElement(tag, { ref, ...props }),
    );
  const motion = new Proxy(
    {},
    {
      get: (_target, key: string) =>
        createMock(key as keyof JSX.IntrinsicElements),
    },
  );

  return {
    motion,
    useReducedMotion: () => true,
  };
});

vi.mock("@/components/OptionsPanel", () => ({
  OptionsPanel: () => null,
}));

import App from "@/App";
import { useChatStore } from "@/store/chatStore";

describe("Message flow", () => {
  beforeEach(() => {
    useChatStore.getState().clear();
    const mediaQueryListMock = {
      matches: false,
      media: "",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => {
        mediaQueryListMock.media = query;
        return mediaQueryListMock;
      }),
    });
  });

  it("appends user message, shows typing indicator, then assistant reply and autoscrolls", async () => {
    const scrollStub = vi.fn();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const originalScroll = Element.prototype.scrollIntoView;
    Object.defineProperty(Element.prototype, "scrollIntoView", {
      configurable: true,
      writable: true,
      value: scrollStub,
    });

    const user = userEvent.setup();
    render(<App />);

    const textarea = screen.getByLabelText(/message/i);
    await user.type(textarea, "How to plan the roadmap?");
    await user.keyboard("{Enter}");

    expect(
      await screen.findByText("How to plan the roadmap?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(scrollStub).toHaveBeenCalled();

    expect(
      await screen.findByText(/Follow these steps/, { exact: false }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();

    if (originalScroll) {
      Object.defineProperty(Element.prototype, "scrollIntoView", {
        configurable: true,
        writable: true,
        value: originalScroll,
      });
    } else {
      Reflect.deleteProperty(
        Element.prototype as unknown as Record<string, unknown>,
        "scrollIntoView",
      );
    }
  });
});
