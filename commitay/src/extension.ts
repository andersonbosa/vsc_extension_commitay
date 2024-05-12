import * as vscode from 'vscode';
import { ExtensionActions } from './actions';


export function activate (context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "commitay" is now active! (it happens once by boot).');

	const actions = new ExtensionActions();

	const disposables: vscode.Disposable[] = [
		vscode.commands.registerCommand(
			actions.storeUserGeminiApikey().command,
			actions.storeUserGeminiApikey().handler.bind(actions)
		),
		vscode.commands.registerCommand(
			actions.generateCommitWithGoogleGemini().command,
			actions.generateCommitWithGoogleGemini().handler.bind(actions)
		),
	];

	context.subscriptions.push(...disposables);
}

export function deactivate () {
	// ...
}
