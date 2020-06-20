import React from 'react';
import './App.css';
import axios from 'axios';

function App() {
	
  const handleClick = async (e) => {
    const a = document.getElementById("a").value;
    const b = document.getElementById("b").value;
	const c = document.getElementById("c").value;


    const response = await axios.get(`api/delta/${a}/${b}/${c}`);
    document.getElementById("result").innerText = `Wyliczona delta: ${response.data.wyliczonaDelta}`;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div>
          <form>
            <div>
				<label>Podaj a</label>
				<input type="text'" id="a"/>
			</div>
			<div>
				<label>Podaj b</label>
				<input type="text" id="b"/>
			</div>
			<div>
				<label>Podaj c</label>
				<input type="text" id="c"/>
			</div>
            <button type="button" onClick={handleClick}>Oblicz delte!</button>
          </form>
		  <div id="result">
	      </div>
		</div>
      </header>
    </div>
  );
}

export default App;