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
  static async create(audioContext: AudioContext) {
    const audioNode = new OscillatorNode(audioContext, {
      type: 'sine',
      frequency: 1000
    });

    return new OscillatorComponent(audioNode);
  }

  name: string = 'Oscillator';
  audioNode: OscillatorNode;
  element: JSX.Element;

  constructor(audioNode: OscillatorNode) {
    this.audioNode = audioNode;
    this.element = <Oscillator audioNode={audioNode} />;
  }
}

class DATPlayerComponent {
  static async create(audioContext: AudioContext) {
    const audioNode = new AudioBufferSourceNode(audioContext);

    return new DATPlayerComponent(audioNode);
  }

  name: string = 'DAT Player';
  audioNode: AudioBufferSourceNode;
  element: JSX.Element;

  constructor(audioNode: AudioBufferSourceNode) {
    this.audioNode = audioNode;
    this.element = <DATPlayer audioNode={audioNode} />;
  }
}

class ReceiverComponent {
  static async create(audioContext: AudioContext) {
    const audioNode = new GainNode(audioContext);

    return new ReceiverComponent(audioNode);
  }

  audioNode: GainNode;
  // element: JSX.Element;

  constructor(audioNode: GainNode) {
    this.audioNode = audioNode;
    // this.element = <Receiver audioNode={audioNode} file={file} />;
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
    oscillator = await OscillatorComponent.create(audioContext);
    datplayer = await DATPlayerComponent.create(audioContext);

    receiver = await ReceiverComponent.create(audioContext);

    setComponents([oscillator, datplayer]);

    datplayer.audioNode
      .connect(receiver.audioNode)
      .connect(audioContext.destination);
  });

  createEffect(async () => {
    oscillator = await OscillatorComponent.create(audioContext);

    if (file()) {
      datplayer = await DATPlayerComponent.create(audioContext);
      receiver = await ReceiverComponent.create(audioContext);

      datplayer.audioNode
        .connect(receiver.audioNode)
        .connect(audioContext.destination);

      datplayer.audioNode.start();
    }
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
