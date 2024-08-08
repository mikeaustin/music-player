import { JSX, Component, ValidComponent, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { parseBuffer, IAudioMetadata } from 'music-metadata';

import { View, Button, Text } from './core';

import Oscillator from './components/Oscillator';
import DATPlayer from './components/DATPlayer';
import Equalizer from './components/Equalizer';
import Receiver from './components/Receiver';

interface StereoPlugin<T extends AudioNode> {
  shortName: string;
  name: string;
  audioNode: T;
  component: Component<{ audioNode: T, file: File | null; }>;
}

class OscillatorPlugin implements StereoPlugin<OscillatorNode> {
  shortName: string = 'OSC';
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
  shortName: string = 'DAT';
  name: string = 'DAT Player';
  audioNode: AudioBufferSourceNode;
  component = DATPlayer;

  constructor(audioContext: AudioContext) {
    this.audioNode = new AudioBufferSourceNode(audioContext);
  }
}

class EqualizerPlugin {
  shortName: string = 'EQ';
  name: string = 'Equalizer';
  audioNode: BiquadFilterNode;
  component = Equalizer;

  constructor(audioContext: AudioContext) {
    this.audioNode = new BiquadFilterNode(audioContext);
  }
}

class ReceiverController {
  audioNode: GainNode;

  constructor(audioContext: AudioContext) {
    this.audioNode = new GainNode(audioContext);
  }
}

//

function App() {
  const audioContext = new AudioContext();

  const [file, setFile] = createSignal<File | null>(null);
  const [pictureUrl, setPictureUrl] = createSignal<string>();
  const [selectedInput, setSelectedInput] = createSignal('DAT');

  const [oscillatorPlugin, setOscillatorPlugin] = createSignal<OscillatorPlugin>(new OscillatorPlugin(audioContext));
  const [datplayerPlugin, setDatplayerPlugin] = createSignal<DATPlayerPlugin>(new DATPlayerPlugin(audioContext));

  // let oscillatorPlugin: OscillatorPlugin = new OscillatorPlugin(audioContext);
  // let datplayerPlugin: DATPlayerPlugin = new DATPlayerPlugin(audioContext);
  let equalizerPlugin: EqualizerPlugin = new EqualizerPlugin(audioContext);
  let receiverPlugin: ReceiverController = new ReceiverController(audioContext);

  datplayerPlugin().audioNode.start();
  oscillatorPlugin().audioNode.start();

  const inputComponents: () => StereoPlugin<any>[] = () => [datplayerPlugin(), oscillatorPlugin()];

  const handleDragOver: JSX.EventHandler<HTMLDivElement, DragEvent> = (event) => {
    event.preventDefault();
  };

  const handleDrop: JSX.EventHandler<HTMLDivElement, DragEvent> = async (event) => {
    event.preventDefault();

    const file = event.dataTransfer?.items[0]?.getAsFile() ?? null;

    if (file) {
      setFile(file);

      datplayerPlugin().audioNode.stop();
      datplayerPlugin().audioNode.disconnect();
      oscillatorPlugin().audioNode.stop();
      oscillatorPlugin().audioNode.disconnect();

      setOscillatorPlugin(new OscillatorPlugin(audioContext));
      setDatplayerPlugin(new DATPlayerPlugin(audioContext));
      let equalizerPlugin: EqualizerPlugin = new EqualizerPlugin(audioContext);
      let receiverPlugin: ReceiverController = new ReceiverController(audioContext);

      datplayerPlugin().audioNode.buffer = await audioContext.decodeAudioData(await file.arrayBuffer());
      datplayerPlugin().audioNode.start();

      oscillatorPlugin().audioNode.start();

      const component = inputComponents().find(component => component.shortName === selectedInput());

      if (component) {
        component.audioNode
          .connect(receiverPlugin.audioNode)
          .connect(audioContext.destination);
      }

      //

      const metaData = await parseBuffer(new Uint8Array(await file.arrayBuffer()));

      if (metaData.common.picture) {
        const blob = new Blob([metaData.common.picture[0].data]);

        // setPictureUrl(URL.createObjectURL(blob));
      }
    }
  };

  // createEffect(() => {
  //   inputComponents[0].audioNode.disconnect();
  //   inputComponents[1].audioNode.disconnect();

  //   const component = inputComponents.find(component => component.shortName === selectedInput());

  //   if (component) {
  //     component.audioNode
  //       .connect(receiverPlugin.audioNode)
  //       .connect(audioContext.destination);
  //   }
  // });

  const handleInputSelect = (input: string) => {
    setSelectedInput(input);
  };

  const getComponent = () => inputComponents().find(component => component.shortName === selectedInput());

  return (
    <View
      flex
      align="bottom center"
      style={{ position: 'fixed', inset: 0, background: 'radial-gradient(at bottom, hsl(0, 0%, 15%), hsl(0, 0%, 0%) 1500px)' }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {pictureUrl() && (
        <View style={{ xtransform: 'perspective(1000px) rotateX(22deg)', "transform-origin": '50% 100%' }}>
          <View style={{ position: 'absolute', inset: 0, "box-shadow": 'inset 0 0 0 1px hsla(0, 0%, 100%, 0.1)' }} />
          <img src={pictureUrl()} width="300" height="300" />
        </View>
      )}
      <View height="20px" />
      {inputComponents()?.map(component => (
        <Dynamic component={component.component} audioNode={component.audioNode} file={file()} />
      ))}
      <Equalizer
        source={getComponent()?.audioNode}
        audioNode={equalizerPlugin.audioNode}
        file={file()}
      />
      <Receiver
        source={getComponent()?.audioNode}
        audioNode={receiverPlugin?.audioNode}
        inputComponents={inputComponents()}
        selectedInput={selectedInput()}
        onInputSelect={handleInputSelect}
      />
    </View>
  );
}

export default App;
