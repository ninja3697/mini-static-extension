//Description: Root file for loading webapp
import { render } from 'solid-js/web';
import { format } from 'prettier/standalone';
import * as parserHtml from 'prettier/parser-html';
import * as parserCss from 'prettier/parser-postcss';
import * as parserEspree from 'prettier/parser-espree';
import { createEffect, createResource } from 'solid-js';
import * as Prism from 'prismjs';
import { cssClassesToString, tagToCode } from '../sidePane';
import { tag } from '../vsc/temp';

import { css } from '@linaria/core';
import '../styles/prism-themes/vs-dark.scss';
import '../styles/renderCollection.scss';

window.addEventListener('DOMContentLoaded', async function () {
  const root = document.createElement('div');
  document.body.appendChild(root);
  //@ts-ignore
  const vscode = acquireVsCodeApi();

  const [html, cssClasses] = tagToCode(tag);

  const resources =
    '<link rel="stylesheet" href=https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600 />';

  let cssCode = `${cssClassesToString(cssClasses).join('\n')}`;
  let htmlCode = `${html}\n\n${resources}`;
  // htmlCode = htmlCode + props.googleFontStyles.map((url) => `<link rel="stylesheet" href=${url} />`).join('\n');

  const displayCode = `<style>${cssCode}</style>\n${htmlCode}`;

  async function beautify(language: string, code: string, printWidth?: number): Promise<string> {
    if (language === 'css' || language === 'scss' || language === 'less') {
      return format(code, { parser: language, plugins: [parserCss], printWidth });
    } else if (language === 'html' || language === 'xml') {
      return format(code, { parser: 'html', plugins: [parserHtml, parserCss], printWidth });
    } else {
      return format(code, {
        parser: 'espree',
        plugins: [parserEspree, parserHtml, parserCss],
        printWidth,
      });
    }
  }

  function highlight(code: string, language: string) {
    return Prism.highlight(code, Prism.languages[language], language);
  }

  function onClassNameClick(className: string, nodes: HTMLCollectionOf<Element>) {
    for (const node of nodes) {
      if (node.textContent?.includes(className)) {
        node.scrollIntoView({ behavior: 'smooth' });
        break;
      }
    }
  }

  function createSpanClassNameComponent(className: string, onClick: () => void) {
    const element = document.createElement('span');
    element.textContent = className;
    element.classList.add('class-name');
    element.addEventListener('click', onClick);
    return element;
  }

  function convertToClickableClassName(element: Element, styleNodes: HTMLCollectionOf<Element>) {
    const textContent = element.childNodes[2].textContent;
    if (textContent) {
      const documentFragmant = document.createDocumentFragment();
      textContent.split(' ').forEach((className) => {
        documentFragmant.appendChild(
          createSpanClassNameComponent(className, () => onClassNameClick(className, styleNodes)),
        );
        const spaceElement = document.createElement('span');
        spaceElement.textContent = ' ';
        documentFragmant.appendChild(spaceElement);
      });
      const delimiter = element.lastElementChild;
      element.childNodes[2].textContent = ''; // removed text classname
      documentFragmant.removeChild(documentFragmant.lastElementChild!); // remove extra space
      element.appendChild(documentFragmant); // add span elements of classes
      if (delimiter) element.appendChild(delimiter); // move last " to the end
    }
  }

  const [highlighted] = createResource(
    () => ({ language: 'html', code: displayCode, printWidth: 2 }),
    ({ language, code, printWidth }) => beautify(language, code, printWidth).then((code) => highlight(code, language)),
  );

  createEffect(() => {
    if (highlighted()) {
      const styleNodes = document.getElementsByClassName('selector');
      const classNodes = this.document.getElementsByClassName('attr-value');
      for (let element of classNodes) {
        convertToClickableClassName(element, styleNodes);
      }
    }
  });

  render(
    () => (
      <div class={`vs-dark`}>
        <pre
          class={css`
            width: 100%;
            white-space: pre-wrap;
            margin-top: 0px;
          `}
          style={{ width: '100%', whiteSpace: 'pre-wrap', marginTop: '0px' }}
        >
          <code
            class={css`
              white-space: pre;
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
              font-size: 14px;
              line-height: 1.5;
            `}
            innerHTML={highlighted()}
          ></code>
        </pre>
      </div>
    ),
    root,
  );
});
