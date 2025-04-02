import React, { useEffect, useRef } from "react";
import { Box, Input, MenuItem, MenuList, Stack } from "@mui/material";

import { useQuery } from "@tanstack/react-query";
import { fetchSuggestions } from "../api";
import { Token, useFormulaStore } from "../store";
import { DropdownMenu } from "./DropdownMenu";

export interface DropdownValues {
  name: string;
  id: number;
  category: string;
}

const FormInput = () => {
  const { tokens } = useFormulaStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const lastToken = tokens[tokens.length - 1];
  const search =
    lastToken?.type === "text"
      ? (lastToken.value ?? "").split(/[\s()+\-*/^]+/).pop() ?? ""
      : "";

  const { data } = useQuery({
    queryKey: ["autocomplete", tokens],
    queryFn: () => fetchSuggestions(search),
    enabled: !!search,
  });

  const onlyText =
    tokens.filter((t) => t.type === "text").length === tokens.length;

  const isBeforeTag = (index: number) => tokens[index + 1]?.type === "tag";

  const handleChange = (value: string, index: number) => {
    const newTokens = [...tokens];
    newTokens[index] = { type: "text", value };
    useFormulaStore.getState().setTokens(newTokens);
  };

  const onSelect = (item: DropdownValues) => {
    const currentTokens = [...useFormulaStore.getState().tokens];
    const lastIndex = currentTokens.length - 1;
    const lastToken = currentTokens[lastIndex];

    if (lastToken?.type === "text") {
      const splitRegex = /([\s()+\-*/^]+)/;
      const parts = (lastToken.value ?? "").split(splitRegex);

      const newText = parts.slice(0, -1).join("");

      const newTokens: Token[] = [
        ...currentTokens.slice(0, -1),
        { type: "text", value: newText ?? "" },
        {
          type: "tag",
          id: item.id,
          label: `${item.name} - ${item.category}`,
        },
        { type: "text", value: "" },
      ];

      useFormulaStore.getState().setTokens(newTokens);
    }
  };

  const handleBackspace = (
    event: React.KeyboardEvent,
    index: number,
    value: string,
  ) => {
    if (event.key === "Backspace" && value === "") {
      const newTokens = [...tokens];

      if (index > 0 && newTokens[index - 1]?.type === "tag") {
        newTokens.splice(index - 1, 2);
        useFormulaStore.getState().setTokens(newTokens);

        setTimeout(() => {
          const input = inputRefs.current[index - 2];
          if (input) {
            input.focus();
            const length = input.value.length;
            input.setSelectionRange(length, length);
          }
        }, 0);

        return;
      }

      if (tokens.length === 1 && index === 0) {
        useFormulaStore.getState().setTokens([{ type: "text", value: "" }]);
        return;
      }
    }
  };

  useEffect(() => {
    const input = inputRefs.current[inputRefs.current?.length - 1];
    const lastIndex = tokens.length - 1;

    if (
      tokens?.[lastIndex]?.type === "text" &&
      tokens[lastIndex].value === ""
    ) {
      input?.focus();
    }
  }, [tokens]);

  return (
    <Stack alignItems="center" spacing="20px" marginTop="200px" overflow="auto">
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          border: "1px solid #777",
          borderRadius: "8px",
          padding: "8px",
          minHeight: "44px",
        }}
      >
        {tokens.map((token, index) => (
          <React.Fragment key={`token-${index}`}>
            {token.type === "tag" ? (
              <Box
                sx={{
                  padding: "2px 6px",
                  background: "#EEE",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "16px",
                }}
              >
                {token.label}
                <DropdownMenu tagIndex={index} />
              </Box>
            ) : (
              <Input
                value={token.value}
                inputRef={(el) => (inputRefs.current[index] = el)}
                onChange={(event) => handleChange(event.target.value, index)}
                onKeyDown={(event) =>
                  handleBackspace(event, index, token?.value ?? "")
                }
                disableUnderline
                sx={{
                  fontSize: "16px",
                  padding: 0,
                  margin: 0,
                  lineHeight: 1,
                  height: "auto",
                  width:
                    isBeforeTag(index) && !onlyText
                      ? `${(token.value ?? "").length + 1}ch`
                      : "auto",
                  display: "inline-flex",
                  alignItems: "center",
                  flexGrow: 0,
                }}
              />
            )}
          </React.Fragment>
        ))}
      </Box>

      {data ? (
        <Box
          maxHeight="200px"
          overflow="auto"
          border="1px solid #777777"
          borderRadius="10px"
        >
          <MenuList>
            {data.map((item: DropdownValues) => (
              <MenuItem key={item.id} onClick={() => onSelect(item)}>
                {item.name} __ {item.category}
              </MenuItem>
            ))}
          </MenuList>
        </Box>
      ) : null}
    </Stack>
  );
};

export { FormInput };
