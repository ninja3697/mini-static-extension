//Description: Root file for loading webapp

import { JSXElement } from 'solid-js';
import { render } from 'solid-js/web';

declare global {
  interface Window {
    appName: string;
  }
}

const sidePane = () => {
  return <></>;
};

window.addEventListener('DOMContentLoaded', async function () {
  const root = document.createElement('div');
  document.body.appendChild(root);

  render();
  {
    return <></>;
  }
});
