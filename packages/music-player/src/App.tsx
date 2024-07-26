import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from './core';

import Oscillator from './components/Oscillator';
import DATPlayer from './components/DATPlayer';
import Receiver from './components/Receiver';

class OscillatorComponent {
  static async create(audioContext: AudioContext) {
    const audioNode = new OscillatorNode(audioContext, {
      type: 'sine',
      frequency: 1000
    });

    return new OscillatorComponent(audioNode);
  }

  audioNode: OscillatorNode;
  element: JSX.Element;

  constructor(audioNode: OscillatorNode) {
    this.audioNode = audioNode;
    this.element = <Oscillator audioNode={audioNode} />;
  }
}

class DATPlayerComponent {
  static async create(audioContext: AudioContext, file: File | null) {
    if (file) {
      const audioNode = new AudioBufferSourceNode(audioContext, {
        buffer: await audioContext.decodeAudioData(await file.arrayBuffer()),
      });

      return new DATPlayerComponent(audioNode, file);
    }

    throw Error('Error');
  }

  audioNode: AudioBufferSourceNode;
  element: JSX.Element;

  constructor(audioNode: AudioBufferSourceNode, file: File | null) {
    this.audioNode = audioNode;
    this.element = <DATPlayer audioNode={audioNode} file={file} />;
  }
}

class ReceiverComponent {
  static async create(audioContext: AudioContext, file: File | null) {
    const audioNode = new GainNode(audioContext);

    return new ReceiverComponent(audioNode, file);
  }

  audioNode: GainNode;
  element: JSX.Element;

  constructor(audioNode: GainNode, public file: File | null) {
    this.audioNode = audioNode;
    this.element = <Receiver audioNode={audioNode} file={file} />;
  }
}

//

function App() {
  const [file, setFile] = createSignal<File | null>(null);

  const audioContext = new AudioContext();

  let oscillator: OscillatorComponent;
  let datplayer: DATPlayerComponent;
  let receiver: ReceiverComponent;


  createEffect(async () => {
    oscillator = await OscillatorComponent.create(audioContext);
    receiver = await ReceiverComponent.create(audioContext, file());

    oscillator.audioNode
      .connect(receiver.audioNode)
      .connect(audioContext.destination);
  });

  createEffect(async () => {
    oscillator = await OscillatorComponent.create(audioContext);

    if (file()) {
      datplayer = await DATPlayerComponent.create(audioContext, file());
      receiver = await ReceiverComponent.create(audioContext, file());

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
      <Oscillator audioNode={oscillator?.audioNode} file={file()} />
      <DATPlayer audioNode={datplayer?.audioNode} file={file()} />
      <Receiver audioNode={receiver?.audioNode} file={file()} />
    </View>
  );
}

export default App;
