export type PlaybookArticleSummary = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  babyAgeMin: number | null;
  babyAgeMax: number | null;
  tags: string[];
  saved: boolean;
};

export type PlaybookFilterState = {
  tag: string | null;
  savedOnly: boolean;
  babyAgeMonths: number | null;
};
