//Description: Root file for loading webapp
import { render } from 'solid-js/web';

window.addEventListener('DOMContentLoaded', function () {
  const root = document.createElement('div');
  document.body.appendChild(root);

  render(() => <div>HEHEHHE</div>, root);
});
