import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from './core';

import DATPlayer from './components/DATPlayer';
import Receiver from './components/Receiver';

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

  element: JSX.Element;

  constructor(public audioNode: AudioBufferSourceNode, public file: File | null) {
    this.element = <DATPlayer audioNode={audioNode} file={file} />;
  }
}

class ReceiverComponent {
  static async create(audioContext: AudioContext, file: File | null) {
    const audioNode = new GainNode(audioContext);

    return new ReceiverComponent(audioNode, file);
  }

  element: JSX.Element;

  constructor(public audioNode: GainNode, public file: File | null) {
    this.element = <Receiver audioNode={audioNode} file={file} />;
  }
}

//

function App() {
  const [file, setFile] = createSignal<File | null>(null);

  const audioContext = new AudioContext();

  let datplayer: DATPlayerComponent;
  let receiver: ReceiverComponent;

  createEffect(async () => {
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
      <DATPlayer audioNode={datplayer?.audioNode} file={file()} />
      <Receiver audioNode={receiver?.audioNode} file={file()} />
    </View>
  );
}

export default App;
