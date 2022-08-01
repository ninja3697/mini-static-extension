// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { WebviewProvider } from './panelProvider';
import { createOrShowWebview } from './panelProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	

const codePanelProvider = new WebviewProvider(
    context,
    'activitybar.codePanel',
    'sidePane.js',
  );

  console.log(context.extensionPath);

  // Code Panel registered here

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(codePanelProvider.viewType, codePanelProvider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );

}

// this method is called when your extension is deactivated
export function deactivate() {}
