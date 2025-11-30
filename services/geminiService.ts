
import { GoogleGenAI } from "@google/genai";
import { Role } from "../types";

// Used to generate a catchy description for the event based on input
export const generateEventDescription = async (data: {
    title: string;
    date: string;
    location: string;
    startTime: string;
    endTime: string;
    roles: Role[]
}): Promise<string> => {
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    return "Junte-se a nós para este grande evento! Estamos contratando profissionais dedicados para garantir o sucesso da operação.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Include value in the prompt context
    const roleList = data.roles.map(r => `${r.vacancies}x ${r.title} (${r.value || 'A combinar'})`).join(', ');

    const prompt = `
      Escreva uma descrição curta, profissional e convidativa (max 2 frases) para um anúncio de vagas de freelancer em um evento.
      
      Detalhes:
      Evento: ${data.title}
      Data: ${data.date}
      Local: ${data.location}
      Horário: ${data.startTime} até ${data.endTime}
      Vagas e Valores: ${roleList}
      
      O tom deve ser energético e focado em recrutamento. Em Português.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text?.trim() || "Oportunidade de trabalho freelance para evento.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Junte-se a nós para este grande evento! Estamos contratando profissionais dedicados.";
  }
};
