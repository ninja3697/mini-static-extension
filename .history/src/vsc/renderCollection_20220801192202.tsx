//Description: Root file for loading webapp

import { JSXElement } from 'solid-js';
import { render } from 'solid-js/web';

const sidePane = () => {
  return <></>;
};

window.addEventListener('DOMContentLoaded', function () {
  const root = document.createElement('div');
  document.body.appendChild(root);

  render(() => <p>HHHHs</p>, root);
});
