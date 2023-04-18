import transitions from "gl-transitions";
import createTexture from "gl-texture2d";
import createTransition from "./gl-transition";

function drawTranstion(
  container,
  imageFrom,
  imageTo,
  width,
  height,
  transitionName
) {
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  canvas.width = width;
  canvas.height = height;

  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, -1, 4, 4, -1]), // see a-big-triangle
    gl.STATIC_DRAW
  );
  gl.viewport(0, 0, width, height);

  const from = createTexture(gl, imageFrom);
  from.minFilter = gl.LINEAR;
  from.magFilter = gl.LINEAR;

  const to = createTexture(gl, imageTo);
  to.minFilter = gl.LINEAR;
  to.magFilter = gl.LINEAR;

  const transition = createTransition(
    gl,
    transitions.find((t) => t.name === transitionName)
  );

  const loop = (t) => {
    requestAnimationFrame(loop);
    transition.draw((t / 1000) % 1, from, to, canvas.width, canvas.height, {
      persp: 1.5,
      unzoom: 0.6,
    });
  };
  requestAnimationFrame(loop);
}

export default drawTranstion;
