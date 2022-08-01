//Description: Root file for loading webapp

import { render, Suspense } from 'solid-js/web';

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
      <Suspense fallback={<div class="loader"></div>}>
        <div>HEHHEHE</div>
      </Suspense>
    ),
    root,
  );
});
