// Description: For creating and managing webview panel in VS code extension.

import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export function getHtmlForWebview(
  webview: vscode.Webview,
  extensionUri: vscode.Uri,
  extensionPath: string,
  appName: string,
  scripts: string[],
  styles: string[],

  viewType: string,
) {
  // Use a nonce to only allow a specific script to be run.`
  // const nonce = getNonce();

  const asWebviewUri = (file: string) => {
    // const r = `vscode-resource:${[extensionPath, 'dist', file].join('/')}`;
    const r = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, file));
    return r;
  };

  const manifests = JSON.parse(
    fs.readFileSync(vscode.Uri.file(path.join(extensionPath, './manifest.json')).fsPath, 'utf8'),
  );

  const urlHandleFunction = `
       window.handlePublicUrl = function(url) {
        const newUrl = "vscode-resource:${extensionPath}/" + url.slice(1);
        return newUrl;
       } 
     window.appName = "${appName}";
`;

  return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
        <meta name="viewType" content="${viewType}">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
        
				<meta http-equiv="Content-Security-Policy" content="default-src 'unsafe-inline' 'unsafe-eval' 'self' blob: ${
          webview.cspSource
        } https://api.figma.com https://*.amazonaws.com; style-src 'unsafe-inline' ${
    webview.cspSource
  }; img-src 'self' data: ${webview.cspSource};">
        

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

    
        ${styles
          .map(
            (styleFile) => `
        <!--${asWebviewUri(styleFile)}-->
        <link href="${asWebviewUri(styleFile)}" rel="stylesheet">`,
          )
          .join('\n')}
			</head>
			<body>
        <script>var exports = {};</script>

        ${urlHandleFunction ? `<script>${urlHandleFunction}</script>` : ''}

        ${scripts
          .map(
            (scriptFile) => `
          <!--${asWebviewUri(manifests[scriptFile])}-->
        <script src="${asWebviewUri(manifests[scriptFile])}"></script>`,
          )
          .join('\n')}   
			</body>
			</html>`;
}

// export function wireWebview(
//   panel: { webview: vscode.Webview; onDidDispose: vscode.Event<void> },
//   context: vscode.ExtensionContext,
// ) {
//   function postMessage(msg: Message) {
//     panel.webview.postMessage(msg);
//   }

//   panel.webview.onDidReceiveMessage(dispatcher.dispatch.bind(dispatcher), null, context.subscriptions);
//   const listenerKey = dispatcher.addListener(postMessage);
//   panel.onDidDispose(
//     () => {
//       dispatcher.removeListener(listenerKey);
//     },
//     null,
//     context.subscriptions,
//   );
// }

export class WebviewProvider implements vscode.WebviewViewProvider {
  // public static readonly viewType = 'activitybar.kombai';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly _context: vscode.ExtensionContext,
    public readonly viewType: string,
    // private readonly _dispatcher: Dispatcher,
    public readonly appName: string,
    public readonly fileName: string,
    private readonly _eventListener: (msg: Message) => void,
    private readonly _registerPostMessage: (fn: (msg: Message) => void) => void,
    private readonly _onDidDispose: () => void,
  ) {}

  resolveWebviewView(
    panel: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken,
  ): void | Thenable<void> {
    this._view = panel;

    panel.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._context.extensionUri],
    };

    panel.webview.html = getHtmlForWebview(
      panel.webview,
      this._context.extensionUri,
      this._context.extensionPath,
      this.appName,
      [this.fileName],
      [],
      this.viewType,
    );

    panel.webview.onDidReceiveMessage(this._eventListener, null, this._context.subscriptions);
    // const listenerKey = dispatcher.addListener(postMessage);
    panel.onDidDispose(this._onDidDispose, null, this._context.subscriptions);

    this._registerPostMessage(function postMessage(msg: Message) {
      panel.webview.postMessage(msg);
    });

    //wireWebview(webviewView, this._dispatcher, this._context);
  }
}
export function createOrShowWebview(
  context: vscode.ExtensionContext,
  panels: Map<string, vscode.WebviewPanel>,
  // dispatcher: Dispatcher,
  viewType: string,
  title: string,
  appName: string,
  manifestFile: string,
  eventListener: (msg: Message) => void,
  registerPostMessage: (fn: (msg: Message) => void) => void,
  onDidDispose: () => void,
) {
  const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
  const currentPanel = panels.get(viewType);

  // If we already have a panel, show it.
  if (currentPanel) {
    currentPanel.reveal(column);
    return;
  }

  // Otherwise, create a new panel.

  const panel = vscode.window.createWebviewPanel(viewType, title, vscode.ViewColumn.One, {
    enableScripts: true,
    localResourceRoots: [context.extensionUri],
    retainContextWhenHidden: true,
  });

  const htmlFileContent = getHtmlForWebview(
    panel.webview,
    context.extensionUri,
    context.extensionPath,
    appName,
    [manifestFile],
    [],
    panel.viewType,
  );

  panel.webview.onDidReceiveMessage(eventListener, null, context.subscriptions);
  // const listenerKey = dispatcher.addListener(postMessage);
  panel.onDidDispose(onDidDispose, null, context.subscriptions);

  registerPostMessage(function postMessage(msg: Message) {
    panel.webview.postMessage(msg);
  });

  panel.webview.html = htmlFileContent;

  //wireWebview(panel, dispatcher, context);

  //panels.set(viewType, panel);
}
