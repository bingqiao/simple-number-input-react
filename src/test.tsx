import React from 'react';
import ReactDOM from 'react-dom';
import { NumberInput } from './components/number-input';
import './test.sass';

ReactDOM.render(
  <div className="App">
    <div className='container'>
      <div>
        <NumberInput separator={':'} handleChange={(value) => console.log(value)} max={23} verticalAngles={true} />
        <NumberInput separator={'-'} max={59} initValue={5} verticalAngles={true} />
        <NumberInput separator={''} min={10} max={59} initValue={9} verticalAngles={true} />
      </div>
      <hr />
      <div>
        <NumberInput separator={':'} initValue={0} handleChange={(value) => console.log(value)} max={23} />
        <NumberInput max={59} initValue={5} />
      </div>
      <hr />
      <div>
        <NumberInput handleChange={(value) => console.log(value)} size={'large'} />
      </div>
    </div>
  </div>,
  document.getElementById("root")
);