
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({
      error: "A inteligência artificial ainda não foi configurada."
    });
  }

  const { idea, area } = req.body || {};

  if (typeof idea !== "string" || !idea.trim()) {
    return res.status(400).json({
      error: "Escreva sua ideia para começar."
    });
  }

  if (idea.length > 6000) {
    return res.status(400).json({
      error: "Sua mensagem é muito longa. Resuma sua ideia."
    });
  }

  const instructions = `
Você é o cérebro central da VYNTRO AI.
Responda sempre em português brasileiro.
Seja inteligente, criativo, prático, estratégico e honesto.
Não invente pesquisas, estatísticas, tendências ou fatos.
Diferencie fatos comprovados de hipóteses.
Ajude a transformar ideias em ações concretas.

Especialidades:
- Mercado e oportunidades
- Psicologia e comportamento de consumo
- Conteúdo, vídeos e engajamento
- Leads e aquisição de clientes
- Vendas e ofertas
- Crescimento e análise
- Curiosidades, história, Egito antigo e ciência

Organize suas respostas com:
1. Entendimento do pedido
2. Análise
3. Oportunidades
4. Plano de ação
5. Próximo passo prático
`;

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-5.5",
        instructions,
        input: `Especialidade escolhida: ${area || "central"}\n\nPedido do usuário: ${idea}`,
        max_output_tokens: 1800
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Erro na API:", data);
      return res.status(502).json({
        error: "Não foi possível obter uma resposta da inteligência artificial."
      });
    }

    return res.status(200).json({
      answer: data.output_text || "Não foi possível gerar uma resposta."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Erro interno ao consultar a inteligência artificial."
    });
  }
}
