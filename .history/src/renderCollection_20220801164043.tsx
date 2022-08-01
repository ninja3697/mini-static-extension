//Description: Root file for loading webapp

import { render } from 'solid-js/web';

import { Suspense, createSignal } from 'solid-js';
// import { registerBrowserDependencies } from '../designToCode/workers/vscWorkerLoader';
import SidePane from '../ui/components/sidePane';


declare global {
  interface Window {
    appName: string;
  }
}

window.addEventListener('DOMContentLoaded', async function () {

  const root = document.createElement('div');
  document.body.appendChild(root);

  
    render(
      () => (
       
       <></>
      ),
      root,
    );
  });
