import resolve from "rollup-plugin-node-resolve"; // 依赖引用插件
import { eslint } from "rollup-plugin-eslint"; // eslint插件
import pkg from "./package.json";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

export default {
  input: "src/index.ts", // 入口文件
  external: ["axios"],
  output: [
    {
      file: pkg.main, // 输出文件名称
      format: "cjs", // 输出模块格式
      sourcemap: false, // 是否输出sourcemap
    },
    {
      file: pkg.module,
      format: "esm",
      sourcemap: false,
    },
    {
      file: "dist/heng-request.min.js",
      format: "umd",
      name: "HengRequest", // umd模块名称，相当于一个命名空间，会自动挂载到window下面
      sourcemap: false,
      plugins: [terser()],
    },
  ],
  plugins: [
    resolve(["ts", "tsx", "js"]),
    eslint({
      throwOnError: true,
      include: ["src/**/*.ts"],
      exclude: ["node_modules/**", "dist/**", "demo", "rollup.config.js"],
    }),
    typescript({
      tsconfigOverride: {
        compilerOptions: {
          module: "ESNext",
        },
      },
      useTsconfigDeclarationDir: true, // 使用tsconfig中的声明文件目录配置
    }),
  ],
};
