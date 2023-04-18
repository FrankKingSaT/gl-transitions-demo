import transitions from "gl-transitions";
import createTransition from "gl-transition";
import createTexture from "gl-texture2d";
import "./App.css";

function App() {
  function drawTranstion(container, imageFrom, imageTo, width, height, transitionName) {
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
    ); // https://github.com/gl-transitions/gl-transitions/blob/master/transitions/cube.glsl

    // animates forever!
    const loop = (t) => {
      requestAnimationFrame(loop);
      transition.draw((t / 1000) % 1, from, to, canvas.width, canvas.height, {
        persp: 1.5,
        unzoom: 0.6,
      });
    };
    requestAnimationFrame(loop);
  }

  function onSelectImageFrom(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      // 下面写一段代码，将 e.target.result 赋值给 imgFrom 的 src
      const imgFrom = document.getElementById("imgFrom");
      imgFrom.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function onSelectImageTo(e) {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imgTo = document.getElementById("imgTo");
      imgTo.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function startShow() {
    const container = document.getElementById("transitions-container");
    const imgFrom = document.getElementById("imgFrom");
    const imgTo = document.getElementById("imgTo");
    const select = document.getElementById("transtions-select");
    const transitionName = select.value;
    drawTranstion(container, imgFrom, imgTo, 356, 200,transitionName);
  }

  return (
    <div className="App">
      <div id='transitions-container'></div>
      <div id='operations'>
        {/* <input id="imageFrom" type="file" onChange={onSelectImageFrom} />
        <input id="imageTo" type="file" onChange={onSelectImageTo} /> */}
        <select id="transtions-select">
          {transitions.map((t) => {
            return <option value={t.name}>{t.name}</option>;
          })}
        </select>
        <button onClick={startShow}>add transition</button>
        <div>
          <img id="imgFrom" src='/imageFrom.jpg' />
          <img id="imgTo" src='/imageTo.jpg' />
        </div>
      </div>
    </div>
  );
}

export default App;
