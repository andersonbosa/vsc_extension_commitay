import { GenerativeModel, GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { IAIClient, IGenerateCommitInput, IGenerateCommitOutput } from './types';

export namespace AIClients {

  export class GoogleGeminiAIClient implements IAIClient<IGenerateCommitInput, IGenerateCommitOutput> {
    private IA_MODEL = 'gemini-pro'; // alias to gemini-1.0-pro
    private model: GenerativeModel;

    constructor(private apikey: string) {
      const genAI = new GoogleGenerativeAI(this.apikey);
      this.model = genAI.getGenerativeModel({ model: this.IA_MODEL });
    }

    async prompt (userPrompt: IGenerateCommitInput): Promise<IGenerateCommitOutput> {
      try {
        const result = await this.model.generateContent(userPrompt.content);
        const content = result.response.text();
        return { content };
      } catch (error) {
        return { content: null };
      }
    }
  }

  export class ChatGPTAIClient implements IAIClient<IGenerateCommitInput, IGenerateCommitOutput> {
    private IA_MODEL = 'gemini-pro'; // alias to gemini-1.0-pro
    private openai: OpenAI;

    constructor(private apiKey: string) {
      this.openai = new OpenAI({ apiKey });
    }

    async prompt (userPrompt: IGenerateCommitInput): Promise<IGenerateCommitOutput> {
      try {
        const response = await this.openai.chat.completions.create({
          messages: [
            { role: 'user', content: 'You are a git commit generator.' },
            { role: 'user', content: userPrompt.content }
          ],
          model: this.IA_MODEL,
          n: 1, // Generate a single response
          stop: null,
          // max_tokens: 100, // Adjust the max_tokens value as needed
          // temperature: 0.7, // Adjust the temperature value as needed
        });

        if (response.choices.length > 0) {
          // const content = response.choices[0].message.content?.trim()
          const content = response.choices.map(c => c.message.content).join()?.trim();
          return { content };
        } else {
          return { content: null };
        }
      } catch (error) {
        console.error('Error generating commit with ChatGPT:', error);
        return { content: null };
      }
    }
  }
}

