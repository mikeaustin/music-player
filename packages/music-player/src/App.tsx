import { ComponentProps, createSignal, splitProps } from 'solid-js';

import { View, Button } from './core';

import './App.css';

function Component(
  props: ComponentProps<typeof View>
) {
  return (
    <View>
      <View style={{ background: 'hsl(0, 0%, 10%)', width: '960px', height: '150px', 'border-top': '1px solid hsl(0, 0%, 20%)' }} {...props}>
        {props.children}
      </View>
      <View horizontal paddingHorizontal="small">
        <View style={{ background: 'hsl(0, 0%, 10%)', width: '100px', height: '20px' }} />
        <View flex />
        <View style={{ background: 'hsl(0, 0%, 10%)', width: '100px', height: '20px' }} />
      </View>
    </View>
  );
}

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <View as="div" flex align="bottom center" style={{ background: 'black', position: 'fixed', inset: 0 }}>
      <Component horizontal>
        <View>hello</View>
        <View>hello</View>
      </Component>
      <Component horizontal>
        <View>hello</View>
        <View>hello</View>
      </Component>
    </View>
  );
}

export default App;
