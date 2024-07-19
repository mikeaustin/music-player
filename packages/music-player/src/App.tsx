import { createSignal, splitProps } from 'solid-js';

import View from './core/view';

import './App.css';

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <View as="div" style={{ background: 'red' }}>
      hello
    </View>
  );
}

export default App;
