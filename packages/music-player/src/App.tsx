import { ComponentProps, createSignal, splitProps } from 'solid-js';

import View from './core/view';

import './App.css';

function Component(
  props: ComponentProps<typeof View>
) {
  return (
    <View>
      <View style={{ background: 'gray', width: '960px', height: '100px' }} {...props}>
        {props.children}
      </View>
      <View horizontal paddingHorizontal="small">
        <View style={{ background: 'gray', width: '100px', height: '20px' }} />
        <View flex />
        <View style={{ background: 'gray', width: '100px', height: '20px' }} />
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
