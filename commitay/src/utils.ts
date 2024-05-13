import { exec } from 'node:child_process';
import * as vscode from 'vscode';


export function generateCommitPrompt (content: string) {
  const prompt = `
You are to act as the author of a commit message in git. I'll send you an output of 'git diff --staged' command, and you convert it into a commit message. Your mission is to create clean and comprehensive commit message in the conventional commit convention (based on https://www.conventionalcommits.org/en/v1.0.0/) written in present tense for the following code diff with the given specifications below:
- Must be in English (US).
- Must use the Conventional Commits specification.
- Must have the format: "<type>[scope]: <short description> \\n\\n\\n <long description>".
- You must output only the commit message generated on the specified format.

\`\`\`diff
${content}
\`\`\``;

  return prompt;
}

export async function executeGitDiff (): Promise<string> {
  return new Promise((resolve, reject) => {
    exec('git diff --staged', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

export async function getGitDiff () {
  try {
    const diffContent = await executeGitDiff();
    return diffContent;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function commitChanges (message: string): Promise<void> {
  // Use the `git commit -m` command to commit the changes
  await vscode.commands.executeCommand('git.commit', message);
}

export async function copyCommitMessageToClipboard (message: string): Promise<void> {
  await vscode.env.clipboard.writeText(message);
  vscode.window.showInformationMessage(`commitay: Commit message copied to clipboard: "${message}"`);
}

export async function generateCommitMessage (content: string): Promise<string> {
  throw new Error('Function not implemented.');
}

export async function copyToClipboard (text: string) {
  if (text.trim() === '') {
    return;
  }
  try {
    await vscode.env.clipboard.writeText(text);
  } catch (error) {
    vscode.window.showErrorMessage(`commitay: Something goes wrong. Error: ${JSON.stringify(error)}`);
  }
}

export function showCopyButton (message: string, contentToCopy: string) {
  const btnContent = 'Copy';
  vscode.window.showInformationMessage(message, btnContent)
    .then(selection => {
      if (selection === btnContent) {
        copyToClipboard(contentToCopy);
      }
    });
}

export function showOpenIssueButton (message: string) {
  const btnContent = 'Open issue';
  vscode.window.showErrorMessage(message, btnContent)
    .then(selection => {
      if (selection === btnContent) {
        vscode.env.openExternal(
          vscode.Uri.parse('https://github.com/andersonbosa/vsc_extension_commitay/issues/new/choose')
        );
      }
    });
}

