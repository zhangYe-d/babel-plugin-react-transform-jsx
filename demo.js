import { types, transformFileSync, transformFileAsync } from "@babel/core";

const { code } = await transformFileAsync("./source.jsx", {
  plugins: ["@babel/plugin-syntax-jsx", "./src/index.js"],
});

console.log(code);
