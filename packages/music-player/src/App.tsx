import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from './core';

import Oscillator from './components/Oscillator';
import DATPlayer from './components/DATPlayer';
import Receiver from './components/Receiver';

interface StereoComponent {
  name: string;
  audioNode: AudioNode;
  element: JSX.Element;
}

class OscillatorComponent implements StereoComponent {
  name: string = 'Oscillator';
  audioNode: OscillatorNode;
  element: JSX.Element;

  constructor(audioContext: AudioContext) {
    this.audioNode = new OscillatorNode(audioContext, {
      type: 'sine',
      frequency: 1000
    });
    this.element = <Oscillator audioNode={this.audioNode} />;
  }
}

class DATPlayerComponent {
  name: string = 'DAT Player';
  audioNode: AudioBufferSourceNode;
  element: JSX.Element;

  constructor(audioContext: AudioContext) {
    this.audioNode = new AudioBufferSourceNode(audioContext);
    this.element = <DATPlayer audioNode={this.audioNode} />;
  }
}

class ReceiverComponent {
  audioNode: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioNode = new GainNode(audioContext);
  }
}

//

function App() {
  const [file, setFile] = createSignal<File | null>(null);
  const [components, setComponents] = createSignal<StereoComponent[] | null>(null);

  const audioContext = new AudioContext();

  let oscillator: OscillatorComponent;
  let datplayer: DATPlayerComponent;
  let receiver: ReceiverComponent;

  createEffect(async () => {
    oscillator = new OscillatorComponent(audioContext);
    datplayer = new DATPlayerComponent(audioContext);

    receiver = new ReceiverComponent(audioContext);

    setComponents([oscillator, datplayer]);

    datplayer.audioNode
      .connect(receiver.audioNode)
      .connect(audioContext.destination);
  });

  const handleDragOver: JSX.EventHandler<HTMLDivElement, DragEvent> = (event) => {
    event.preventDefault();
  };

  const handleDrop: JSX.EventHandler<HTMLDivElement, DragEvent> = async (event) => {
    event.preventDefault();

    setFile(event.dataTransfer?.items[0]?.getAsFile() ?? null);
  };

  return (
    <View
      flex
      align="bottom center"
      style={{ position: 'fixed', inset: 0, background: 'radial-gradient(at bottom, hsl(0, 0%, 15%), hsl(0, 0%, 0%) 1500px)' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Oscillator audioNode={oscillator?.audioNode} />
      <DATPlayer audioNode={datplayer?.audioNode} file={file()} />
      <Receiver audioNode={receiver?.audioNode} />
    </View>
  );
}

export default App;
