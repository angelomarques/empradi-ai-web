export type MessageResponse = {
  answer: string;
  results: {
    metadata: {
      title: string;
      url: string;
    };
    text: string;
  }[];
};