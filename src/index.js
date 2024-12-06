import { types } from "@babel/core";

const config = {
  calleeLiteral: "React.createElement",
};

export default (babel) => {
  const createElement = toMemberExpression(config.calleeLiteral, types);
  const getCreateElement = () => types.cloneNode(createElement);
  return {
    visitor: {
      JSXElement(path) {
        const openingElementPath = path.get("openingElement");

        const attributes = buildAttributes(openingElementPath);
        const tag = getTag(openingElementPath);
        let callExpression = types.callExpression(getCreateElement(), [
          tag,
          attributes,
        ]);

        path.replaceWith(types.inherits(callExpression, path.node));
        // log(path.node);
      },
      JSXOpeningElement(path) {
        // log(path.node);
      },
      JSXAttribute(path) {
        // log(path.node);
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

const getTag = (path) => types.stringLiteral(path.node.name.name);

const buildAttributes = (path) => {
  const attrs = path.node.attributes;
  // log(attrs);
  const props = [];

  for (const attr of attrs) {
    let name = attr.name;

    if (types.isJSXIdentifier(name)) {
      name = types.stringLiteral(name.name);
    }
    const objectProperty = types.objectProperty(name, attr.value);
    props.push(objectProperty);
  }

  return types.objectExpression(props);
};
const log = (content) => {
  console.log(content);
};
