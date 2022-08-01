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
        <Suspense
          fallback={
            <div class="loader">
              <Loader
                class={css`
                  margin: 40px 50px;
                `}
              />
            </div>
          }
        >
          <FigmaFileLoader
            fileId={'bW3mr9LCJgPWAiyTE7YVbz'}
            frameId={'5:71'}
            apiKey={'343988-38ddbad8-6117-4d4c-aa90-a26cdb6f64f9'}
          >
            {(figmaFileLoadOutputForUI) => <SidePane {...figmaFileLoadOutputForUI} selectedIds={['I93:24;93:4']} />}
          </FigmaFileLoader>
        </Suspense>
      ),
      root,
    );
  });
