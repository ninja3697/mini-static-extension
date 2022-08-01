//Description: Root file for loading webapp

import { JSXElement } from 'solid-js';
import { sidePane } from './sidePane';
import { render } from 'solid-js/web';

window.addEventListener('DOMContentLoaded', function () {
  const root = document.createElement('div');
  document.body.appendChild(root);

  render(() => sidePane(), root);
});
