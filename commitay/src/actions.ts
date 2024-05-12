import * as vscode from 'vscode';
import { COMMANDS, CONFIGURATIONS } from './contants';
import { AIClients } from './lib/ia-clients.service';
import { generateCommitPrompt, getGitDiff, showCopyButton, showOpenIssueButton } from './utils';


export class ExtensionActions {

  helloWorld () {
    const handler = () => {
      vscode.window.showInformationMessage('commitay: Hello World from commitay!');
      console.log('--------- commitay', vscode.workspace.getConfiguration().get<any>('commitay'));
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
          return vscode.window.showErrorMessage('commitay: Please enter your "APIKEY_GOOGLE_GEMINI" first.');
        }
        vscode.workspace.getConfiguration().update(
          CONFIGURATIONS.APIKEY_GOOGLE_GEMINI,
          apikey,
          true, // vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage('commitay: Gemini APIKEY stored successfully.');
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
          return vscode.window.showErrorMessage('commitay: Please enter your "APIKEY_CHATGPT" first.');
        }
        vscode.workspace.getConfiguration().update(
          CONFIGURATIONS.APIKEY_CHATGPT,
          apikey,
          true, // vscode.ConfigurationTarget.Global
        );
        vscode.window.showInformationMessage('commitay: ChatGPT APIKEY stored successfully.');
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
            return vscode.window.showErrorMessage('commitay: Please enter your Gemini APIKEY first.');
          }

          // console.log(await vscode.commands.executeCommand('git.diff'))
          // console.log((await vscode.commands.getCommands()).filter(i => i.includes('diff')));
          const gitDiff = await getGitDiff();
          if (!gitDiff) {
            return vscode.window.showErrorMessage('commitay: It was not possible to obtain git diff.');
          }

          const iaClient = new AIClients.GoogleGeminiAIClient(apikey);
          const output = await iaClient.prompt({ content: generateCommitPrompt(gitDiff) });
          if (!output.content) {
            throw new Error('commitay: It was not possible to obtain IA Client output.');
          }
          showCopyButton('commitay: Commit generated', output.content);
        } catch (error) {
          console.error(error);
          showOpenIssueButton('commitay: Failed to generate commit message. Please open a issue.');
        }
      }
    };
  }

  generateCommitWithChatGPT () {
    return {
      command: COMMANDS.GENERATE_CHATGPT,
      handler: async () => {
        vscode.window.showWarningMessage('Feature not implemented.');
        // TODO: Implement ChatGPT support
      }
    };
  }

}

