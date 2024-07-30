import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

type EqualizerProps = {
  audioNode: BiquadFilterNode;
  file: File | null;
};

function Equalizer(props: EqualizerProps) {
  const [frequency, setFrequency] = createSignal(0.5);
  const [waveType, setWaveType] = createSignal('sine');

  const handlePlayButtonClick = () => {
    if (props.audioNode) {
      props.audioNode.start();
    }
  };

  const handleFrequencyValueChange = (value: number) => {
    if (props.audioNode) {
      setFrequency(value);
    }
  };

  const handleWaveTypeButtonClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    console.log(event.currentTarget.dataset.type);

    setWaveType(event.currentTarget.dataset.type ?? 'sine');
  };

  createEffect(() => {
    const value = waveType();

    if (props.audioNode) {
      props.audioNode.type = value;
    }
  });

  createEffect(() => {
    const value = 2 ** (frequency() * 10 + 4.3219281);

    if (props.audioNode) {
      props.audioNode.frequency.value = value;
    }
  });

  return (
    <Component horizontal>
      <View padding="large xlarge">
        <Button align="top center" width="80px" height="48px" padding="small none" style={{ border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <View absolute style={{ inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
      </View>
      <View padding="large xlarge">
      </View>
      <View flex />
      <View horizontal padding="large xlarge" align="middle left">
      </View>
    </Component>
  );
}

export default Equalizer;
