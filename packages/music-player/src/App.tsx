import { JSX, ComponentProps, createSignal, splitProps } from 'solid-js';
import { parseBuffer } from 'music-metadata';

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

      const metadata = await parseBuffer(new Uint8Array(await file.arrayBuffer()));

      console.log(metadata);

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
        <View padding="large xlarge" style={{ background: 'black', width: '600px', 'border-left': '1px solid black', 'border-right': '1px solid black' }}>
          <View style={{ position: 'absolute', inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
          <View horizontal>
            <Text>24 BIT &nbsp; 96 KHZ</Text>
            <View flex />
            <Text>STEREO</Text>
          </View>
          <View flex />
          <View>
            <Text>LA GRANGE</Text>
            <View height="8px" />
            <Text>ZZ TOP - TRES HOMBRES</Text>
          </View>
          <View flex />
          <View horizontal>
            <Text>0:00</Text>
            <View flex />
            <Text>3:52</Text>
          </View>
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
