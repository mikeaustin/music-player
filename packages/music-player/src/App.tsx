import { JSX, ComponentProps, createSignal, splitProps } from 'solid-js';

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
  const audioContext = new AudioContext();

  const handleDragOver: JSX.EventHandler<HTMLDivElement, DragEvent> = (event) => {
    event.preventDefault();
  };

  const handleDrop: JSX.EventHandler<HTMLDivElement, DragEvent> = async (event) => {
    event.preventDefault();

    const file = event.dataTransfer?.items[0]?.getAsFile();

    if (file) {
      const track = new AudioBufferSourceNode(audioContext, {
        buffer: await audioContext.decodeAudioData(await file.arrayBuffer()),
      });

      track
        .connect(audioContext.destination);

      track.start();
    }
  };

  return (
    <View
      flex
      align="bottom center"
      style={{ position: 'fixed', inset: 0, background: 'radial-gradient(at bottom, hsl(0, 0%, 15%), hsl(0, 0%, 0%) 1500px)' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
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
