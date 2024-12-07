import { types, transformFileSync, transformFileAsync } from "@babel/core";
import fs from "fs";

const { code } = await transformFileAsync("./source.jsx", {
  plugins: ["@babel/plugin-syntax-jsx", "./src/index.js"],
});

fs.writeFileSync("target.js", code);
