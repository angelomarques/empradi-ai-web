import ChatApp from "@/components/ChatApp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChatApp />
    </QueryClientProvider>
  );
}
