import type { LikertScaleQuestion, TextQuestion } from "@lofwen/models";

export const likertScaleQuestion: LikertScaleQuestion = {
  "@id": "likert-scale-question",
  "@type": "LikertScaleQuestion",
  prompt: "Is this the best app ever?",
  responseCategories: [
    "Strongly disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly agree",
  ].map((label, index) => ({
    label,
    value: index,
  })),
};

export const textQuestion: TextQuestion = {
  "@id": "text-question",
  "@type": "TextQuestion",
  prompt: "Tell us what you like about the app.",
};
