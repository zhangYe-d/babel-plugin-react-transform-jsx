import { types } from "@babel/core";

const config = {
  calleeLiteral: "React.createElement",
};

export default (babel) => {
  const createElement = toMemberExpression(config.calleeLiteral, types);
  const getCreateElement = () => types.cloneNode(createElement);
  return {
    visitor: {
      JSXElement: {
        exit(path) {
          const openingElementPath = path.get("openingElement");
          const attributes = buildAttributes(openingElementPath);
          const tag = getTag(openingElementPath);
          let callExpression = types.callExpression(getCreateElement(), [
            tag,
            attributes,
            ...buildChildren(path),
          ]);

          path.replaceWith(types.inherits(callExpression, path.node));
        },
      },
    },
  };
};

const toMemberExpression = (id) => {
  return id
    .split(".")
    .map((name) => types.identifier(name))
    .reduce((object, property) => types.memberExpression(object, property));
};

const getTag = (path) => {
  const name = path.node.name.name;
  return notOrignalTag(name)
    ? types.identifier(name)
    : types.stringLiteral(name);
};

const buildAttributes = (path) => {
  const attrs = path.node.attributes;
  const props = [];

  for (const attr of attrs) {
    let name = attr.name;

    if (types.isJSXIdentifier(name)) {
      name = types.stringLiteral(name.name);
    }
    const objectProperty = types.objectProperty(name, attr.value);
    props.push(objectProperty);
  }

  return props.length === 0
    ? types.nullLiteral()
    : types.objectExpression(props);
};

const buildChildren = (path) => {
  const { children } = path.node;
  const elements = [];

  for (let child of children) {
    switch (child.type) {
      case "JSXText":
        child = buildChild(child, types);
        break;
      case "JSXExpressionContainer":
        child = child.expression;
      default:
    }
    child.type !== "JSXEmptyExpression" && elements.push(child);
  }

  return elements;
};

const buildChild = (child, { inherits, stringLiteral }) => {
  let str = "";
  const lines = child.value.split(/'\n|\r\n|\r'/);
  let lastNonEmptyLine = 0;
  for (let i = 0; i < lines.length; i++) {
    if (/[^ \t]/.exec(lines[i])) {
      lastNonEmptyLine = i;
    }
  }

  let i = 0;
  while (i <= lastNonEmptyLine) {
    const line = lines[i];
    let trimmedLine = line.replace(/\t/, " ");
    if (i !== 0) {
      trimmedLine = trimmedLine.replace(/^ +/, "");
    }

    if (i !== lastNonEmptyLine) {
      trimmedLine = trimmedLine.replace(/ +$/, "");
    }

    if (trimmedLine) {
      str += trimmedLine;
    }
    i++;
  }

  return inherits(stringLiteral(str), child);
};

const notOrignalTag = (name) => {
  return !!name && !/^[a-z]/.test(name);
};

const log = (content) => {
  console.log(content);
};
