import { JSX, ComponentProps, createSignal, splitProps } from 'solid-js';

import { View, Button, Text } from './core';

import styles from './App.module.css';

function Component(
  props: ComponentProps<typeof View>
) {
  return (
    <View>
      <View fill="gray-0" class={styles.componentBody} {...props}>
        {props.children}
      </View>
      <View horizontal padding="none xlarge">
        <View width="150px" height="20px" class={styles.componentFoot} />
        <View flex />
        <View width="150px" height="20px" class={styles.componentFoot} />
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
        <View padding="large xlarge">
          <Button align="top center" width="80px" height="50px" padding="small none" style={{ appearance: 'none', background: 'none', border: '2px solid black', "border-radius": '4px' }}>
            <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
          </Button>
        </View>
        <View padding="large xlarge" style={{ background: 'black', width: '600px' }}>
          <Text>24 BIT &nbsp; 96 KHZ</Text>
        </View>
      </Component>
      <Component horizontal>
        <View>hello</View>
        <View>hello</View>
      </Component>
    </View>
  );
}

export default App;
