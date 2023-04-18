import transitions from "gl-transitions";
import createTexture from "gl-texture2d";
import createTransition from "./gl-transition";

function drawTranstion(
  container,
  fromArray,
  toArray,
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



  const transition = createTransition(
    gl,
    transitions.find((t) => t.name === transitionName)
  );

  // transition duration in ms, try set it to 5000
  const duration = 5000;

  const loop = (t) => {
    requestAnimationFrame(loop);
    // 如果这里直接读 videoFrom 和 videoTo，过不了多久就会崩溃
    const fromData = document.getElementById("canvasFrom");
    const from = createTexture(gl, fromData);
    from.minFilter = gl.LINEAR;
    from.magFilter = gl.LINEAR;

    const toData = document.getElementById("canvasTo");
    const to = createTexture(gl, toData);
    to.minFilter = gl.LINEAR;
    to.magFilter = gl.LINEAR;


    const progress = (t / duration) % 1;
    transition.draw(progress, from, to, canvas.width, canvas.height, {
      persp: 1.5,
      unzoom: 0.6,
    });
  };
  requestAnimationFrame(loop);
}

export default drawTranstion;
