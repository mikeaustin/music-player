import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';
import { parseBuffer } from 'music-metadata';

import { View, Button, Text } from './core';
import Dial from './components/Dial';

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

type DATPlayerProps = {
  audioNode: AudioBufferSourceNode;
  file: File | null;
};

//

function DATPlayer(props: DATPlayerProps) {
  const [songTitle, setSongTitle] = createSignal('');
  const [albumTitle, setAlbumTitle] = createSignal('');
  const [artistName, setArtistName] = createSignal('');
  const [songLength, setSongLength] = createSignal(0);
  const [bitsPerSample, setBitsPerSample] = createSignal(0);
  const [sampleRate, setSampleRate] = createSignal(0);
  const [channelsCount, setChannelsCount] = createSignal(0);
  const [currentTime, setCurrentTime] = createSignal(0);

  createEffect(async () => {
    if (props.file) {
      const metadata = await parseBuffer(new Uint8Array(await props.file.arrayBuffer()));

      console.log(metadata);

      setInterval(() => {
        setCurrentTime(props.audioNode.context.currentTime);
      }, 1000);

      metadata.common.title && setSongTitle(metadata.common.title);
      metadata.common.album && setAlbumTitle(metadata.common.album);
      metadata.common.artist && setArtistName(metadata.common.artist);
      metadata.format.duration && setSongLength(metadata.format.duration);
      metadata.format.bitsPerSample && setBitsPerSample(metadata.format.bitsPerSample);
      metadata.format.sampleRate && setSampleRate(metadata.format.sampleRate);
      metadata.format.numberOfChannels && setChannelsCount(metadata.format.numberOfChannels);
    }
  });

  return (
    <Component horizontal>
      <View padding="large xlarge">
        <Button align="top center" width="80px" height="50px" padding="small none" style={{ appearance: 'none', background: 'none', border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', 'border-left': '1px solid black', 'border-right': '1px solid black' }}>
        <View style={{ position: 'absolute', inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
        <View horizontal>
          <Text>
            {bitsPerSample()} BIT &nbsp; {sampleRate() / 1000} KHZ
          </Text>
          <View flex />
          <Text>
            {channelsCount() === 2 ? 'STEREO' : 'MONO'}
          </Text>
        </View>
        <View flex />
        <View>
          <Text>
            {songTitle().toUpperCase()}
          </Text>
          <View height="8px" />
          <Text>
            {artistName() && (
              <>
                {artistName().toUpperCase()} — {albumTitle().toUpperCase()}
              </>
            )}
          </Text>
        </View>
        <View flex />
        <View>
          <View horizontal style={{ height: '2px', background: 'hsla(200, 90%, 60%, 0.5)' }}>
            <View width={`${currentTime() / songLength() * 100}%`} style={{ background: 'hsl(200, 90%, 60%)' }} />
          </View>
          <View height="8px" />
          <View horizontal>
            <Text>
              {Math.floor(currentTime() / 60)}:{`${Math.floor(currentTime() % 60)}`.padStart(2, '0')}
            </Text>
            <View flex />
            <Text>
              {Math.floor(songLength() / 60)}:{`${Math.floor(songLength() % 60)}`.padStart(2, '0')}
            </Text>
          </View>
        </View>
      </View>
    </Component>
  );
}

//

type ReceiverProps = {
  audioNode: GainNode;
  file: File | null;
};

function Receiver(props: ReceiverProps) {
  const handleVolumeValueChange = (volume: number) => {
    props.audioNode.gain.value = volume;
  };

  return (
    <Component horizontal>
      <View padding="large xlarge">
        <Button align="top center" width="80px" height="50px" padding="small none" style={{ appearance: 'none', background: 'none', border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', 'border-left': '1px solid black', 'border-right': '1px solid black' }}>
        <View style={{ position: 'absolute', inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
      </View>
      <View flex horizontal padding="large xlarge">
        <View flex />
        <Dial size={150} initialValue={0.5} onValueChange={handleVolumeValueChange} />
      </View>
    </Component>
  );
}

//

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

    const file = event.dataTransfer?.items[0]?.getAsFile() ?? null;

    setFile(file);
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
