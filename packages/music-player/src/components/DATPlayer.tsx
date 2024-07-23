
import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';
import { parseBuffer } from 'music-metadata';

import { View, Button, Text } from '../core';

import Component from './Component';

type DATPlayerProps = {
  audioNode: AudioBufferSourceNode;
  file: File | null;
};

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
        <Button align="top center" width="80px" height="50px" padding="small none" style={{ border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <View absolute style={{ inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
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

export default DATPlayer;
