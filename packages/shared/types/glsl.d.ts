/**
 * [GLSL shader module declarations]
 * TypeScript support for importing shader files
 */

/** GLSL shader file module */
declare module '*.glsl' {
  const value: string;
  export default value;
}

/** Vertex shader file module */
declare module '*.vert' {
  const value: string;
  export default value;
}

/** Fragment shader file module */
declare module '*.frag' {
  const value: string;
  export default value;
}
