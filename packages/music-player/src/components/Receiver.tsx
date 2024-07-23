import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from '../core';

import Dial from '../components/Dial';
import Component from '../components/Component';

type ReceiverProps = {
  audioNode: GainNode;
  file: File | null;
};

function Receiver(props: ReceiverProps) {
  const handleVolumeValueChange = (volume: number) => {
    if (props.audioNode) {
      props.audioNode.gain.value = volume;
    }
  };

  createEffect(() => {
    if (props.audioNode) {
      props.audioNode.gain.value = 0.5;
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
      </View>
      <View flex horizontal padding="large xlarge">
        <View flex />
        <Dial size={150} initialValue={0.5} onValueChange={handleVolumeValueChange} />
      </View>
    </Component>
  );
}

export default Receiver;
