import { useMutation } from "@tanstack/react-query";
import {
  PatchUpdateQuoteBody,
  PostCreateQuoteBody,
} from "./types/quote-service-type";
import { patchUpdateQuote, patchVoteQuote, postCreateQuote } from ".";

export const useCreateQuote = () => {
  return useMutation({
    mutationFn: ({
      body,
      options = { access_token: "" },
    }: {
      body: PostCreateQuoteBody;
      options?: { access_token: string };
    }) => postCreateQuote(body, options),
    onSuccess: (data) => {
      console.log("Quote created successfully:", data);
    },
    onError: (error) => {
      console.error("Error creating quote:", error);
    },
  });
};

export const useVoteQuote = () => {
  return useMutation({
    mutationFn: ({
      body,
      options = { access_token: "" },
    }: {
      body: { id: string };
      options?: { access_token: string };
    }) => patchVoteQuote(body.id, options),
    onSuccess: (data) => {
      console.log("Quote voted successfully:", data);
    },
    onError: (error) => {
      console.error("Error voting quote:", error);
    },
  });
};

export const useUpdateQuote = () => {
  return useMutation({
    mutationFn: ({
      body,
      options = { access_token: "" },
    }: {
      body: PatchUpdateQuoteBody;
      options?: { access_token: string };
    }) =>
      patchUpdateQuote(
        body.id,
        {
          quote: body.quote,
          author: body.author,
        },
        options,
      ),
    onSuccess: (data) => {
      console.log("Quote updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating quote:", error);
    },
  });
};
