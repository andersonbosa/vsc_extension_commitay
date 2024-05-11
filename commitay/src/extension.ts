import * as vscode from 'vscode';
import { ExtensionActions } from './actions';


export function activate (context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "commaiter" is now active! (it happens once by boot).');

	const actions = new ExtensionActions();

	const disposables: vscode.Disposable[] = [
		vscode.commands.registerCommand(
			actions.helloWorld().command,
			actions.helloWorld().handler.bind(actions)
		),
		vscode.commands.registerCommand(
			actions.storeUserGeminiApikey().command,
			actions.storeUserGeminiApikey().handler.bind(actions)
		),
		vscode.commands.registerCommand(
			actions.storeUserChatGPTApikey().command,
			actions.storeUserChatGPTApikey().handler.bind(actions)
		),
		vscode.commands.registerCommand(
			actions.generateCommitWithGoogleGemini().command,
			actions.generateCommitWithGoogleGemini().handler.bind(actions)
		),
		vscode.commands.registerCommand(
			actions.generateCommitWithChatGPT().command,
			actions.generateCommitWithChatGPT().handler.bind(actions)
		),
	];

	context.subscriptions.push(...disposables);
}

export function deactivate () {
	// ...
}
