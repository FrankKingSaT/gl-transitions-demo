import transitions from "gl-transitions";
import drawTranstion from "./transition";

import "./App.css";
import { useEffect } from "react";

function App() {
  function startShow() {
    const container = document.getElementById("transitions-container");
    const from = document.getElementById("videoFrom");
    const to = document.getElementById("videoTo");
    const select = document.getElementById("transtions-select");
    const transitionName = select.value;
    drawTranstion(container, from, to, 356, 200, transitionName);
  }

  useEffect(()=>{
    // 将 canvasFrom 和 canvasTo 的宽高设置为 356, 200
    const canvasFrom = document.getElementById("canvasFrom");
    const canvasTo = document.getElementById("canvasTo");
    canvasFrom.width = 356;
    canvasFrom.height = 200;
    canvasTo.width = 356;
    canvasTo.height = 200;

    // 设置动画，分别在 canvasFrom 和 canvasTo 上绘制 videoFrom 和 videoTo 的当前帧
    const videoFrom = document.getElementById("videoFrom");
    const videoTo = document.getElementById("videoTo");
    const ctxFrom = canvasFrom.getContext("2d");
    const ctxTo = canvasTo.getContext("2d");

    const loop = () => {
      requestAnimationFrame(loop);
      ctxFrom.drawImage(videoFrom, 0, 0, 356, 200);
      ctxTo.drawImage(videoTo, 0, 0, 356, 200);
    }
    requestAnimationFrame(loop);

  }, [])

  return (
    <div className="App">
      <div id="transitions-container"></div>
      <div id="operations">
        <select id="transtions-select">
          {transitions.map((t) => {
            return <option value={t.name}>{t.name}</option>;
          })}
        </select>
        <button onClick={startShow}>add transition</button>
        <div>
          <img id="imgFrom" src="/imageFrom.jpg" />
          <img id="imgTo" src="/imageTo.jpg" />
        </div>
        <div>
          <canvas id="canvasFrom" />
          <canvas id="canvasTo" />
        </div>
        <div>
          <video id="videoFrom" loop controls src="cut1.mp4"/>
          <video id="videoTo" loop controls src="cut2.mp4"/>
        </div>
      </div>
    </div>
  );
}

export default App;
