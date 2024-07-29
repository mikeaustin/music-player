import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';
import { parseBuffer, IAudioMetadata } from 'music-metadata';

import { View, Button as NativeButton, Text } from '../core';

import Component from './Component';
import Button from './Button';

type DATPlayerProps = {
  audioNode: AudioBufferSourceNode;
  file: File | null;
};

function DATPlayer(props: DATPlayerProps) {
  const [metaData, setMetaData] = createSignal<IAudioMetadata>();
  const [pictureUrl, setPictureUrl] = createSignal<string>();
  const [currentTime, setCurrentTime] = createSignal(0);

  createEffect(async () => {
    if (props.file) {
      const metaData = await parseBuffer(new Uint8Array(await props.file.arrayBuffer()));

      setMetaData(metaData);

      console.log(metaData);

      if (metaData.common.picture) {
        const blob = new Blob([metaData.common.picture[0].data]);

        // setPictureUrl(URL.createObjectURL(blob));
      }

      setInterval(() => {
        setCurrentTime(props.audioNode.context.currentTime);
      }, 1000);

      props.audioNode.buffer = await props.audioNode.context.decodeAudioData(await props.file.arrayBuffer());

      props.audioNode.start();
    }
  });

  const handlePlayButtonClick = () => {
    if (props.audioNode) {
      if (props.audioNode.context.state === 'suspended') {
        props.audioNode.context.resume();
      } else {
        props.audioNode.context.suspend();
      }
    }
  };

  const handleStopButtonClick = () => {
    if (props.audioNode) {
      (props.audioNode.context as AudioContext).close();
    }
  };

  return (
    <Component horizontal>
      <View padding="large xlarge">
        <Button align="top center" width="80px" height="48px" padding="small none" style={{ border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <View absolute style={{ inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
        <View horizontal>
          <Text>
            {metaData() && (
              <>
                {metaData()?.format.bitsPerSample} BIT &nbsp; {metaData()?.format.sampleRate / 1000} KHZ
              </>
            )}
          </Text>
          <View flex />
          <Text>
            {metaData()?.format.numberOfChannels === 2 ? 'STEREO' : 'MONO'}
          </Text>
        </View>
        <View flex style={{ 'min-height': '24px' }} />
        <View>
          <Text style={{ "white-space": 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' }}>
            {metaData() ? metaData()?.common.title?.toUpperCase() : <>&nbsp;</>}
          </Text>
          <View height="8px" />
          <Text style={{ "white-space": 'nowrap', overflow: 'hidden', 'text-overflow': 'ellipsis' }}>
            {metaData() ? (
              <>
                {metaData()?.common.artist?.toUpperCase()} — {metaData()?.common.album?.toUpperCase()}
              </>
            ) : (
              <>&nbsp;</>
            )}
          </Text>
        </View>
        <View flex style={{ 'min-height': '24px' }} />
        <View>
          <View horizontal style={{ height: '2px', background: 'hsla(200, 90%, 60%, 0.5)' }}>
            <View width={`${currentTime() / metaData()?.format.duration * 100}%`} style={{ background: 'hsl(200, 90%, 60%)' }} />
          </View>
          <View height="8px" />
          <View horizontal>
            <Text>
              {Math.floor(currentTime() / 60)}:{`${Math.floor(currentTime() % 60)}`.padStart(2, '0')}
            </Text>
            <View flex />
            <Text>
              {metaData() && (
                <>
                  {Math.floor(metaData()?.format.duration / 60)}:{`${Math.floor(metaData()?.format.duration % 60)}`.padStart(2, '0')}
                </>
              )}
            </Text>
          </View>
        </View>
      </View>
      <View padding="large xlarge">
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          <Button align="middle center" width="160px" height="48px" padding="small none" onClick={handlePlayButtonClick}>
            PLAY &nbsp;/&nbsp; PAUSE
          </Button>
          <Button align="middle center" width="80px" height="48px" padding="small none" onClick={handleStopButtonClick}>
            STOP
          </Button>
        </View>
        <View height="8px" />
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          <Button align="middle center" width="120px" height="24px" padding="small none" style={{ "font-size": '8px' }}>
            PREV
          </Button>
          <Button align="middle center" width="120px" height="24px" padding="small none" style={{ "font-size": '8px' }}>
            NEXT
          </Button>
        </View>
      </View>
      <View flex />
      <View padding="large xlarge">
        {pictureUrl() && (
          <View style={{ border: '1px solid black', "xbox-shadow": '0 0 0 0.5px hsla(0, 0%, 100%, 0.1)' }}>
            <View xstyle={{
              position: 'absolute', inset: 0, "z-index": 1, background: `
                0 0 / 100% 3px linear-gradient(0deg, hsla(0, 0%, 0%, 0.0), hsla(0, 0%, 0%, 0.0) 2px, hsla(0, 0%, 0%, 0.5) 2px),
                0 0 / 3px 100% linear-gradient(90deg, hsla(0, 0%, 0%, 0.0), hsla(0, 0%, 0%, 0.0) 2px, hsla(0, 0%, 0%, 0.5) 2px)
              ` }} />
            <img src={pictureUrl()} width="130" height="130" />
            {/* 0 0 / 4px 100% linear-gradient(90deg, hsla(0, 0%, 0%, 0.0), hsla(0, 0%, 0%, 1.0)) */}
          </View>
        )}
      </View>
    </Component>
  );
}

export default DATPlayer;
