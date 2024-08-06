import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

type OscillatorProps = {
  audioNode: OscillatorNode;
  file: File | null;
};

function Oscillator(props: OscillatorProps) {
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
      <View padding="large large" style={{ background: 'black', width: '572px', 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <View absolute style={{ inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
        <View horizontal>
          <Text>FREQUENCY: {(2 ** (frequency() * 10 + 4.3219281)).toFixed(2)}</Text>
          <View flex />
          <Text>{waveType().toUpperCase()} WAVE</Text>
        </View>
      </View>
      <View padding="large xlarge">
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          <Button align="middle center" width="160px" height="48px" padding="small none" style={{ color: 'hsl(0, 0%, 50%)' }} onClick={handlePlayButtonClick}>
            PLAY
          </Button>
          <Button align="middle center" width="80px" height="48px" padding="small none" style={{ color: 'hsl(0, 0%, 50%)' }} onClick={null}>
            STOP
          </Button>
        </View>
        <View height="8px" />
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          <Button flex align="middle center" height="24px" padding="small none" data-type="sine" style={{ "font-size": '8px' }} onClick={handleWaveTypeButtonClick}>
            SINE WAVE
          </Button>
          <Button flex align="middle center" height="24px" padding="small none" data-type="square" style={{ "font-size": '8px' }} onClick={handleWaveTypeButtonClick}>
            SQUARE
          </Button>
          <Button flex align="middle center" height="24px" padding="small none" data-type="sawtooth" style={{ "font-size": '8px' }} onClick={handleWaveTypeButtonClick}>
            SAWTOOTH
          </Button>
        </View>
      </View>
      <View flex />
      <View horizontal padding="large xlarge" align="middle left">
        <Dial size={86} initialValue={frequency()} onValueChange={handleFrequencyValueChange} />
      </View>
    </Component>
  );
}

export default Oscillator;
