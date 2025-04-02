import { create } from "zustand";

export type TokenType = "text" | "tag";

export type Token = {
  type: TokenType;
  value?: string;
  id?: number;
  label?: string;
};

type FormulaStore = {
  tokens: Token[];
  setTokens: (tokens: Token[]) => void;
  insertTag: (tag: { id: number; label: string }) => void;
};

export const useFormulaStore = create<FormulaStore>((set) => ({
  tokens: [{ type: "text", value: "" }],
  setTokens: (tokens) => set({ tokens }),
  insertTag: (tag) =>
    set((state) => {
      const last = state.tokens[state.tokens.length - 1];
      const updatedTokens = [...state.tokens];
      if (last?.type === "text") {
        updatedTokens.pop();
        updatedTokens.push({ type: "text", value: last.value });
      }
      updatedTokens.push({ type: "tag", id: tag.id, label: tag.label });
      updatedTokens.push({ type: "text", value: "" });
      return { tokens: updatedTokens };
    }),
}));
