import { useState, useRef, useEffect } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useSendMessageMutation } from "@/service/chat/mutations";
import type { MessageResponse } from "@/service/chat/types";

// Mocked data for AI response
// const MOCK_AI_RESPONSE = {
//   summary:
//     "Com base na sua consulta sobre 'evasao de estudantes', analisei os anais do EMPRAD e encontrei 3 artigos relevantes publicados entre 2022 e 2023.\n\nSíntese da descoberta: A análise dos artigos revela tendências convergentes sobre inovação, gestão, empresas brasileiras no contexto empresarial brasileiro. Os estudos demonstram a interconexão desses temas e sua relevância para o desenvolvimento de negócios mais competitivos e sustentáveis no atual cenário econômico e social.\n\nMetodologias empregadas: Os estudos analisados utilizaram predominantemente métodos qualitativos (estudos de caso e entrevistas em profundidade), combinados com análises quantitativas de dados secundários, o que permite compreender tanto as particularidades dos casos estudados quanto estabelecer correlações estatisticamente significativas entre variáveis de interesse.\n\nImplicações e recomendações: Os estudos sugerem que gestores e empreendedores devem desenvolver competências adaptativas e visão sistêmica para navegar com sucesso em ambientes de negócios cada vez mais voláteis e interconectados. A literatura recomenda a adoção de práticas colaborativas e o monitoramento contínuo do ambiente competitivo para identificar oportunidades de competitividade sustentável.",
//   references: [
//     {
//       title:
//         "Inovação em Práticas de Gestão: Um Estudo de Caso em Empresas Brasileiras",
//       authors: "Silva, M.A., Oliveira, J.C. (2022)",
//       snippet:
//         "Os resultados indicam que as práticas de inovação em gestão estão fortemente correlacionadas com o desempenho organizacional, especialmente em ambientes de alta competitividade.",
//       tags: ["inovação", "gestão", "empresas brasileiras"],
//     },
//     {
//       title:
//         "Metodologias Ágeis na Administração Pública: Desafios e Oportunidades",
//       authors: "Santos, F.R., Pereira, L.M., Costa, D.S. (2023)",
//       snippet:
//         "A implementação de metodologias ágeis na administração pública brasileira apresenta barreiras culturais significativas, mas demonstra potencial para melhorias na eficiência dos serviços públicos.",
//       tags: ["administração pública", "gestão pública", "ágeis"],
//     },
//     {
//       title:
//         "O Impacto do Trabalho Remoto na Produtividade e Bem-estar dos Colaboradores",
//       authors: "Mendes, A.P., Carvalho, S.T., Martins, J.R. (2022)",
//       snippet:
//         "O estudo revelou que 78% dos profissionais em regime de teletrabalho reportam aumento de produtividade, embora 42% tenham indicado dificuldades relacionadas ao equilíbrio entre vida pessoal e profissional.",
//       tags: ["trabalho remoto", "produtividade", "bem-estar"],
//     },
//   ],
// };

function LoadingDots() {
  return (
    <div className="flex gap-1 items-center h-6">
      <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.2s]"></span>
      <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0s]"></span>
      <span className="block w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]"></span>
    </div>
  );
}

function ReferenceCard({
  refData,
}: {
  refData: MessageResponse["results"][0];
}) {
  return (
    <div className="border rounded-lg p-4 mb-3 bg-card shadow-sm">
      <div className="font-medium text-primary mb-1">
        {refData.title}
      </div>
      <a
        href={refData.url}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline" })}
      >
        {refData.url}
      </a>
      {/* <div className="text-xs text-muted-foreground mb-2">
        {refData.authors}
      </div> */}
      {/* <div className="text-sm mb-2">"{refData.snippet}"</div>
      <div className="flex flex-wrap gap-2">
        {refData.tags.map((tag) => (
          <span
            key={tag}
            className="bg-muted text-xs px-2 py-0.5 rounded-full text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div> */}
    </div>
  );
}

export default function ChatApp() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente de pesquisa EMPRAD. Como posso ajudar com sua pesquisa nos artigos científicos do EMPRAD? Você pode me perguntar sobre temas como empreendedorismo, inovação, gestão ou sustentabilidade.",
    },
  ]);
  const [input, setInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState<MessageResponse | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  const { mutate: sendMessage, isPending } = useSendMessageMutation({
    onMutate: () => {
      setAiAnswer(null);
    },
    onSuccess: (data) => {
      setAiAnswer(data);
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: data.answer },
      ]);
    },
    onError: () => {
      setMessages((msgs) => [
        ...msgs,
        { role: "assistant", content: "API fora do ar" },
      ]);
    },
  });

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, isPending, aiAnswer]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    setInput("");
    setAiAnswer(null);
  };

  // filter results that only show unique urls
  const uniqueResults = aiAnswer?.results.filter(
    (result, index, self) =>
      index === self.findIndex((t) => t.url === result.url)
  );

  return (
    <div className="max-w-2xl mx-auto min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto" ref={chatRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-xl px-4 py-3 max-w-[80%] shadow-sm whitespace-pre-line ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isPending && (
          <div className="flex mb-4 justify-start">
            <div className="rounded-xl px-4 py-3 bg-muted text-muted-foreground max-w-[80%] shadow-sm flex items-center min-h-[2.5rem]">
              <LoadingDots />
            </div>
          </div>
        )}
        {aiAnswer && (
          <div className="mt-2">
            <div className="mb-2 text-sm font-semibold text-primary">
              Referências Encontradas
            </div>
            <div>
              {uniqueResults?.map((ref, i) => (
                <ReferenceCard key={i} refData={ref} />
              ))}
            </div>
          </div>
        )}
      </div>
      <form
        className="flex items-center gap-2 p-4 border-t bg-background"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
      >
        <input
          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring"
          placeholder="Pesquise nos 1585 artigos do EMPRAD..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isPending}
        />
        <Button type="submit" disabled={isPending || !input.trim()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            className="mr-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M12 5l7 7-7 7"
            />
          </svg>
        </Button>
      </form>
    </div>
  );
}
