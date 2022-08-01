//Description: Root file for loading webapp

import { render } from 'solid-js/web';
import { css } from '@linaria/core';
import FigmaFileLoader from '../ui/components/figmaFileLoader';
import Loader from '../ui/components/loader';
import { Suspense, createSignal } from 'solid-js';
// import { registerBrowserDependencies } from '../designToCode/workers/vscWorkerLoader';
import { VSCodeSideBar } from '../ui/components/vscodeSideBar';
import { registerVscodeWebviewDependencies } from '../designToCode/workers/vsc/vscWebviewDi';
import SidePane from '../ui/components/sidePane';
import HomeLayout from '../ui/components/homeLayout';
import DesignPaneRightClickMenu from '../ui/components/designPaneRightClickMenu';
import { DesignPane } from '../ui/components/designPane';

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
