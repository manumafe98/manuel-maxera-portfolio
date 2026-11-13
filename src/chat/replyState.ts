import type { AnswerBlock, ReplyEvent } from "./replyScript";

export type AnswerPart =
  { type: "text"; text: string } | { type: "block"; block: AnswerBlock };

/** What a Chat shows for one reply, folded from its reply events. */
export interface ReplyState {
  thinking: string;
  /** Set once thinking is done. */
  thinkingSeconds: number | null;
  /** The Skill this reply runs, such as "open-projects". */
  skill: string | null;
  tool: { name: string; args: string; result: string | null } | null;
  answer: AnswerPart[];
  done: boolean;
}

export const emptyReply: ReplyState = {
  thinking: "",
  thinkingSeconds: null,
  skill: null,
  tool: null,
  answer: [],
  done: false,
};

export const applyReplyEvent = (
  state: ReplyState,
  event: ReplyEvent,
): ReplyState => {
  switch (event.type) {
    case "thinking":
      return { ...state, thinking: state.thinking + event.text };
    case "thinking-done":
      return { ...state, thinkingSeconds: event.seconds };
    case "skill":
      return { ...state, skill: event.name };
    case "open-app":
      return state;
    case "tool-call":
      return {
        ...state,
        tool: { name: event.name, args: event.args, result: null },
      };
    case "tool-result":
      return state.tool
        ? { ...state, tool: { ...state.tool, result: event.result } }
        : state;
    case "answer-chunk": {
      const last = state.answer[state.answer.length - 1];
      if (last?.type === "text") {
        return {
          ...state,
          answer: [
            ...state.answer.slice(0, -1),
            { type: "text", text: last.text + event.text },
          ],
        };
      }
      return {
        ...state,
        answer: [...state.answer, { type: "text", text: event.text }],
      };
    }
    case "answer-block":
      return {
        ...state,
        answer: [...state.answer, { type: "block", block: event.block }],
      };
    case "done":
      return { ...state, done: true };
  }
};
