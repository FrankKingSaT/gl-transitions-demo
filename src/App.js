import transitions from "gl-transitions";
import drawTranstion from "./transition";

import "./App.css";

function App() {
  function startShow() {
    const container = document.getElementById("transitions-container");
    const from = document.getElementById("imgFrom");
    const to = document.getElementById("imgTo");
    const select = document.getElementById("transtions-select");
    const transitionName = select.value;
    drawTranstion(container, from, to, 356, 200, transitionName);
  }

  return (
    <div className="App">
      <div id='transitions-container'></div>
      <div id='operations'>
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
