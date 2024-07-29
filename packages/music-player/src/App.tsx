import { JSX, Component, ValidComponent, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { parseBuffer, IAudioMetadata } from 'music-metadata';

import { View, Button, Text } from './core';

import Oscillator from './components/Oscillator';
import DATPlayer from './components/DATPlayer';
import Receiver from './components/Receiver';

interface StereoPlugin<T extends AudioNode> {
  name: string;
  audioNode: AudioNode;
  component: Component<{ audioNode: T, file: File | null; }>;
}

class OscillatorPlugin implements StereoPlugin<OscillatorNode> {
  name: string = 'Oscillator';
  audioNode: OscillatorNode;
  component = Oscillator;

  constructor(audioContext: AudioContext) {
    this.audioNode = new OscillatorNode(audioContext, {
      type: 'sine',
      frequency: 1000
    });
  }
}

class DATPlayerPlugin implements StereoPlugin<AudioBufferSourceNode> {
  name: string = 'DAT Player';
  audioNode: AudioBufferSourceNode;
  component = DATPlayer;

  constructor(audioContext: AudioContext) {
    this.audioNode = new AudioBufferSourceNode(audioContext);
  }
}

class ReceiverController {
  audioNode: GainNode;
  analyserNode: AnalyserNode;

  constructor(audioContext: AudioContext) {
    this.audioNode = new GainNode(audioContext);
    this.analyserNode = new AnalyserNode(audioContext);
  }
}

//

function App() {
  const [file, setFile] = createSignal<File | null>(null);
  const [pictureUrl, setPictureUrl] = createSignal<string>();
  const [components, setComponents] = createSignal<StereoPlugin<any>[] | null>(null);

  const audioContext = new AudioContext();

  let oscillatorPlugin: OscillatorPlugin;
  let datplayerPlugin: DATPlayerPlugin;
  let receiverPlugin: ReceiverController;

  createEffect(async () => {
    oscillatorPlugin = new OscillatorPlugin(audioContext);
    datplayerPlugin = new DATPlayerPlugin(audioContext);

    receiverPlugin = new ReceiverController(audioContext);

    setComponents([oscillatorPlugin, datplayerPlugin]);

    // oscillatorPlugin.audioNode
    datplayerPlugin.audioNode
      .connect(receiverPlugin.audioNode)
      .connect(receiverPlugin.analyserNode)
      .connect(audioContext.destination);
  });

  const handleDragOver: JSX.EventHandler<HTMLDivElement, DragEvent> = (event) => {
    event.preventDefault();
  };

  const handleDrop: JSX.EventHandler<HTMLDivElement, DragEvent> = async (event) => {
    event.preventDefault();

    const file = event.dataTransfer?.items[0]?.getAsFile() ?? null;

    if (file) {
      setFile(file);

      const metaData = await parseBuffer(new Uint8Array(await file.arrayBuffer()));

      if (metaData.common.picture) {
        const blob = new Blob([metaData.common.picture[0].data]);

        setPictureUrl(URL.createObjectURL(blob));
      }
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
      {pictureUrl() && (
        <View style={{ "box-shadow": '0 0 0 0.5px hsla(0, 0%, 100%, 0.1)' }}>
          <img src={pictureUrl()} width="400" height="400" />
        </View>
      )}
      <View height="20px" />
      {components()?.map(component => (
        <Dynamic component={component.component} audioNode={component.audioNode} file={file()} />
      ))}
      <Receiver audioNode={receiverPlugin?.audioNode} analyserNode={receiverPlugin.analyserNode} />
    </View>
  );
}

export default App;
