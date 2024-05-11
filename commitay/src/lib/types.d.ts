export interface IAPIClient<O> {
  request (endpoint: string, data: any): Promise<O>
}

export interface IAIClient<I, O> {
  prompt (userPrompt: I): Promise<O>
}

export interface IGenerateCommitInput {
  content: string
}

export interface IGenerateCommitOutput {
  content: string | null
}
