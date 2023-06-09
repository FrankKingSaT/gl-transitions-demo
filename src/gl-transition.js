import createShader from "gl-shader";

// 一个顶点着色器，用于渲染一个大三角形
const VERT = `attribute vec2 _p;
varying vec2 _uv;
void main() {
gl_Position = vec4(_p,0.0,1.0);
_uv = vec2(0.5, 0.5) * (_p+vec2(1.0, 1.0));
}`;

//计算图像纹理坐标变换的方式
const resizeModes = {
  cover: (r) => `.5+(uv-.5)*vec2(min(ratio/${r},1.),min(${r}/ratio,1.))`,
  contain: (r) => `.5+(uv-.5)*vec2(max(ratio/${r},1.),max(${r}/ratio,1.))`,
  stretch: () => "uv",
};

// 通过传入的 transitionGlsl，构造 frag，片元着色器
const makeFrag = (transitionGlsl, resizeMode) => {
  const rFunc = resizeModes[resizeMode];
  if (!rFunc) throw new Error(`Invalid resizeMode=${resizeMode}`);

  const frag = `
    precision highp float;
    varying vec2 _uv;
    uniform sampler2D from, to;
    uniform float progress, ratio, _fromR, _toR;
  
    vec4 getFromColor(vec2 uv) {
      return texture2D(from, ${rFunc("_fromR")});
    }
  
    vec4 getToColor(vec2 uv) {
      return texture2D(to, ${rFunc("_toR")});
    }
  
    ${transitionGlsl}
  
    void main() {
      gl_FragColor = transition(_uv);
    }
  `;

  return frag;
};

export default (gl, transition, options = {}) => {
  const { resizeMode = "cover" } = options;
  const shader = createShader(gl, VERT, makeFrag(transition.glsl, resizeMode));
  shader.bind();
  shader.attributes._p.pointer();

  return {
    draw(
      progress,
      from,
      to,
      width = gl.drawingBufferWidth,
      height = gl.drawingBufferHeight,
      params = {}
    ) {
      shader.bind();
      shader.uniforms.ratio = width / height;
      shader.uniforms.progress = progress;
      shader.uniforms.from = from.bind(0);
      shader.uniforms.to = to.bind(1);
      shader.uniforms._fromR = from.shape[0] / from.shape[1];
      shader.uniforms._toR = to.shape[0] / to.shape[1];
      let unit = 2;

      for (let key in transition.paramsTypes) {
        const value =
          key in params ? params[key] : transition.defaultParams[key];
          if (transition.paramsTypes[key] === "sampler2D") {
            if (!value) {
              console.warn(`uniform[${key}]: A texture MUST be defined for uniform sampler2D of a texture`);
            } else if (typeof value.bind !== "function") {
              throw new Error(`uniform[${key}]: A gl-texture2d API-like object was expected`);
            } else {
              shader.uniforms[key] = value.bind(unit++);
            }
          } else {
            shader.uniforms[key] = value;
          }
      }

      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    dispose() {
      shader.dispose();
    },
  };
};
