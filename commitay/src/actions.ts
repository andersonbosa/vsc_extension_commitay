import * as vscode from 'vscode';
import { COMMANDS, CONFIGURATIONS } from './contants';
import { AIClients } from './lib/ia-clients.service';
import { generateCommitFromIAClient, generateCommitPrompt, showCopyButton } from './utils';



const gitdiffmock = `
diff --git a/src/commaiter/src/lib/ia-clients.service.ts b/src/commaiter/src/lib/ia-clients.service.ts
index 43b639f..097255e 100644
--- a/src/commaiter/src/lib/ia-clients.service.ts
+++ b/src/commaiter/src/lib/ia-clients.service.ts
@@ -29,8 +29,8 @@ export namespace AIClients {
     private IA_MODEL = 'gemini-pro'; // alias to gemini-1.0-pro
     private openai: OpenAI;
 
-    constructor(private apikey: string) {
-      this.openai = new OpenAI({ apiKey: apikey, });
+    constructor(private apiKey: string) {
+      this.openai = new OpenAI({ apiKey });
     }
 
     async prompt (userPrompt: IGenerateCommitInput): Promise<IGenerateCommitOutput> {

`;


export class ExtensionActions {

  helloWorld () {
    const handler = () => {
      vscode.window.showInformationMessage('commaiter: Hello World from commaiter!');
      console.log('--------- commaiter', vscode.workspace.getConfiguration().get<any>('commaiter'));
    };

    return {
      command: COMMANDS.HELLO_WORLD,
      handler
    };
  }

  storeUserGeminiApikey () {
    return {
      command: COMMANDS.STORE_USER_GEMINI_APIKEY,
      handler: async () => {
        const apikey = await vscode.window.showInputBox({
          prompt: 'Enter your Gemini APIKEY',
          password: true,
        });
        if (!apikey) {
          return vscode.window.showErrorMessage('commaiter: Please enter your "APIKEY_GOOGLE_GEMINI" first.');
        }
        vscode.workspace.getConfiguration().update(
          CONFIGURATIONS.APIKEY_GOOGLE_GEMINI,
          apikey,
          true, // vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage('commaiter: Gemini APIKEY stored successfully.');
      }
    };
  }

  storeUserChatGPTApikey () {
    return {
      command: COMMANDS.STORE_USER_CHAT_GPT_APIKEY,
      handler: async () => {
        const apikey = await vscode.window.showInputBox({
          prompt: 'Enter your ChatGPT APIKEY',
          password: true,
        });
        if (!apikey) {
          return vscode.window.showErrorMessage('commaiter: Please enter your "APIKEY_CHATGPT" first.');
        }
        vscode.workspace.getConfiguration().update(
          CONFIGURATIONS.APIKEY_CHATGPT,
          apikey,
          true, // vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage('commaiter: ChatGPT APIKEY stored successfully.');
      }
    };
  }

  generateCommitWithGoogleGemini () {
    return {
      command: COMMANDS.GENERATE_GOOGLEGEMINI,
      handler: async () => {
        try {
          const apikey = vscode.workspace.getConfiguration().get<string>(CONFIGURATIONS.APIKEY_GOOGLE_GEMINI);
          if (!apikey) {
            return vscode.window.showErrorMessage('commaiter: Please enter your Gemini APIKEY first.');
          }
          const iaClient = new AIClients.GoogleGeminiAIClient(apikey);
          const output = await iaClient.prompt({ content: generateCommitPrompt(gitdiffmock) });
          if (!output.content) {
            throw new Error('commaiter: It was not possible to obtain IA Client output.');
          }
          showCopyButton('commaiter: Commit generated', output.content);
        } catch (error) {
          console.error(error);
          vscode.window.showErrorMessage('commaiter: Failed to commit changes. See the console for details.');
        }
      }
    };
  }

  generateCommitWithChatGPT () {
    return {
      command: COMMANDS.GENERATE_CHATGPT,
      handler: async () => {
        vscode.window.showWarningMessage('Feature not implemented.');
        // try {
        //   const apikey = vscode.workspace.getConfiguration().get<string>(CONFIGURATIONS.APIKEY_CHATGPT);
        //   if (!apikey) {
        //     return vscode.window.showErrorMessage('commaiter: Please enter your ChatGPT APIKEY first.');
        //   }
        //   const commitMessage = await generateCommitFromIAClient(new AIClients.ChatGPTAIClient(apikey));
        //   vscode.window.showInformationMessage(`commaiter: commaiter: Committed changes with message: "${commitMessage}"`);
        // } catch (error) {
        //   console.error(error);
        //   vscode.window.showErrorMessage('commaiter: Failed to commit changes. See the console for details.');
        // }
      }
    };
  }

}

