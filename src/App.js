import transitions from "gl-transitions";
import drawTranstion from "./transition";

import "./App.css";

function App() {

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
