//Description: Main loading JS file for VS code extension.

import * as vscode from 'vscode';
import { WebviewProvider } from './panelProvider';
import { Dispatcher } from './dispatch';
import { createOrShowWebview } from './panelProvider';
import { loadWorkers } from '../designToCode/workers/vsc/vscWorkerLoader';

export async function activate(context: vscode.ExtensionContext) {
  const webviewPostMessages = new Map<string, (data: any) => void>();

  const [postMessageToWorker, cleanup] = await loadWorkers(
    context.extensionPath,
    context.globalStorageUri.fsPath,
    (viewName, data) => {
      if (webviewPostMessages.has(viewName)) {
        webviewPostMessages.get(viewName)!(data);
      }
    },
  );

  const dispatcher = new Dispatcher();

  const selectionPanelProvider = new WebviewProvider(
    context,
    'activitybar.selectionPanel',
    // dispatcher,
    'selectionPanel',
    'renderCollection.js',
    (data) => postMessageToWorker({ ...data, viewName: 'selectionPanel' }),
    (postMessage) => {
      webviewPostMessages.set('selectionPanel', postMessage);
    },
    () => {
      webviewPostMessages.delete('selectionPanel');
    },
  );

  // Selection Panel registered here

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(selectionPanelProvider.viewType, selectionPanelProvider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );

  const codePanelProvider = new WebviewProvider(
    context,
    'activitybar.codePanel',
    // dispatcher,
    'codePanel',
    'renderCollection.js',
    (data) => postMessageToWorker({ ...data, viewName: 'codePanel' }),
    (postMessage) => {
      webviewPostMessages.set('codePanel', postMessage);
    },
    () => {
      webviewPostMessages.delete('codePanel');
    },
  );

  // Code Panel registered here

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(codePanelProvider.viewType, codePanelProvider, {
      webviewOptions: {
        retainContextWhenHidden: true,
      },
    }),
  );

  const panels = new Map<string, vscode.WebviewPanel>();

  // Home Layout Page registered here

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.startKombai', () => {
      createOrShowWebview(
        context,
        panels,
        'kombai',
        'Kombai Home',
        'editorPanel',
        'renderCollection.js',
        (data) => postMessageToWorker({ ...data, viewName: 'editorPanel' }),
        (postMessage) => {
          webviewPostMessages.set('editorPanel', postMessage);
        },
        () => {
          webviewPostMessages.delete('editorPanel');
        },
      );
    }),

    // Design Pane Page registered here

    vscode.commands.registerCommand('extension.openDesignPane', () => {
      createOrShowWebview(
        context,
        panels,
        'Kombai designPane',
        'Design Pane',
        'designPane',
        'renderCollection.js',
        (data) => postMessageToWorker({ ...data, viewName: 'designPane' }),
        (postMessage) => {
          webviewPostMessages.set('designPane', postMessage);
        },
        () => {
          webviewPostMessages.delete('designPane');
        },
      );
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
