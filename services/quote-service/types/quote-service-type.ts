export interface PostCreateQuoteBody {
  quote: string;
  author: string;
}

export interface PatchUpdateQuoteBody {
  id: string;
  quote: string;
  author: string;
}
