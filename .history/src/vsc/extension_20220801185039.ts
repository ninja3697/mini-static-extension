//Description: Main loading JS file for VS code extension.

import * as vscode from 'vscode';
import { WebviewProvider } from './panelProvider';


export async function activate(context: vscode.ExtensionContext) {
  const codePanelProvider = new WebviewProvider(
    context,
    'activitybar.codePanel',
    'renderCollection.js',
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

//Abhijit's old code

// const listeners = {
//   openEditorPanel: function ({ msg }: Message) {
//     if (msg === 'something_clicked') {
//       createOrShowWebview(context, panels, dispatcher, 'editor.kombai.figmaLarge', 'Kombai');
//     }
//   },
// };

// Object.entries(listeners).forEach(([key, listener]) => {
//   if (!key.startsWith('_')) dispatcher.addListener(listener);
// });
