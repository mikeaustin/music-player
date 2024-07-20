import { ComponentProps, createSignal, splitProps } from 'solid-js';

import { View, Button } from './core';

function Component(
  props: ComponentProps<typeof View>
) {
  return (
    <View>
      <View fill="gray-0" style={{ width: '1400px', height: '200px', 'border': '1px solid hsl(0, 0%, 0%)', 'border-top': '1px solid hsl(0, 0%, 15%)' }} {...props}>
        {props.children}
      </View>
      <View horizontal paddingHorizontal="large">
        <View width="150px" height="20px" style={{ background: 'hsl(0, 0%, 5%)' }} />
        <View flex />
        <View width="150px" height="20px" style={{ background: 'hsl(0, 0%, 5%)' }} />
      </View>
    </View>
  );
}

function App() {
  const [count, setCount] = createSignal(0);

  return (
    <View as="div" flex align="bottom center" style={{ position: 'fixed', inset: 0, background: 'radial-gradient(at bottom, hsl(0, 0%, 15%), hsl(0, 0%, 0%) 1500px)' }}>
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
