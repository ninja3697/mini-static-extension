import * as CSS from 'csstype';

export type CssClasses = { [k in string]?: Partial<CSS.PropertiesHyphen> };

export type Optional<T> = T | undefined | null;

function makeid(length: number) {
  var result = '';
  var characters = 'abcdefghijklmnopqrstuvqxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function isValueNotNull<K, T>(elem: readonly [K, Optional<T>]): elem is [K, T] {
  return elem[1] !== undefined && elem[1] !== null;
}

function isString(x: any): x is string {
  return typeof x === 'string' || x instanceof String;
}

export function cssClassToString(className: string, css: CSS.PropertiesHyphen): string {
  return `.${className} {\n${Object.entries(css)
    .map(([key, value]) => `${key}: ${value};`)
    .join('\n')} }`;
}

export function cssClassesToString(classes: Map<string, CSS.PropertiesHyphen>): string[] {
  return Array.from(classes.entries()).map(([className, css]) => cssClassToString(className, css));
}

export type ChildTagContent = {
  tagName: string; //'img' | 'button' | 'div' | 'input' | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  css: CssClasses;
  children?: readonly (ChildTagContent | string)[];
  properties?: { [k in string]: string };
};

function outputClassName(classType: string, classSuffix: string, classPrefix: string): string {
  const pseudoElements = classType.split('::');
  const pseudos = pseudoElements[0].split(':');
  if (classPrefix) classPrefix = `${classPrefix}-`;
  if (classSuffix) classSuffix = `-${classSuffix}`;
  const className = `${classPrefix}${pseudos[0]}${classSuffix}`;
  return `${className}${pseudos.length > 1 ? ':' + pseudos.slice(1).join(':') : ''}${
    pseudoElements.length > 1 ? '::' + pseudoElements.slice(1).join('::') : ''
  }`;
}

export function tagToCode(
  tag: any,
  classSuffix: string = '',
  skipClassTypes: string[] = [],
): [string, Map<string, CSS.PropertiesHyphen>] {
  const classes = new Map<string, CSS.PropertiesHyphen>();

  const toHtml = (child: ChildTagContent | string, depth: number, index: number): string => {
    if (!isString(child)) {
      const childClasses = Object.entries(child.css)
        .filter(isValueNotNull)
        .filter((x) => Object.entries(x[1]).length > 0 && !skipClassTypes.includes(x[0]))
        .map(([classType, classProperties]) => {
          return [
            outputClassName(
              classType,
              classSuffix + makeid(4) /*(depth > 0 ? `${depth}_${index}` : '')*/,
              child.tagName,
            ),
            classProperties,
          ] as const;
        });

      childClasses.forEach(([className, classProperties]) => {
        classes.set(className, classProperties);
      });

      const classNames = childClasses.map((x) => x[0]).join(' ');

      const tag = `${child.tagName} ${classNames ? `class="${classNames}"` : ``} ${
        child.properties
          ? Object.entries(child.properties)
              .map(([name, value]) => `${name}="${value}"`)
              .join(' ')
          : ''
      }`;

      if (child.children?.length) {
        return `
          <${tag}> 
            ${child.children?.map((c, index) => toHtml(c, depth + 1, index)).join('\n')}
          </${child.tagName}>`;
      } else return `<${tag}/>`;
    } else return child;
  };

  return [toHtml(tag, 0, 0), classes];
}
