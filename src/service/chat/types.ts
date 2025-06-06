export type MessageResponse = {
  answer: string;
  results: {
    title: string;
    url: string;
    content: string;
  }[];
};