import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

type ReceiverProps = {
  audioNode: OscillatorNode;
};

function Oscillator(props: ReceiverProps) {
  const [frequency, setFrequency] = createSignal(0.5);

  const handlePlayButtonClick = () => {
    if (props.audioNode) {
      props.audioNode.start();
    }
  };

  const handleFrequencyValueChange = (value: number) => {
    if (props.audioNode) {
      // console.log('here 2', value);
      setFrequency(value);
    }
  };

  createEffect(() => {
    // console.log('here', frequency());

    // const value = 2 ** (frequency() * Math.log2(20000 - 19)) + 19;
    const value = 2 ** (frequency() * 9.965792 + 4.32192);

    // ((2 ** (1.0 * 10)) - 1) * 16

    if (props.audioNode) {
      props.audioNode.frequency.value = value;
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
        <View>
          <Text>FREQ: {(2 ** (frequency() * 9.965792 + 4.32192)).toFixed(2)}</Text>
        </View>
      </View>
      <View padding="large xlarge">
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          <Button align="middle center" width="80px" height="50px" padding="small none" style={{ color: 'hsl(0, 0%, 50%)' }} onClick={handlePlayButtonClick}>
            PLAY
          </Button>
          <Button align="middle center" width="80px" height="50px" padding="small none" style={{ color: 'hsl(0, 0%, 50%)' }} onClick={null}>
            STOP
          </Button>
        </View>
      </View>
      <View flex />
      <View horizontal padding="large xlarge">
        <Dial size={150} initialValue={frequency()} onValueChange={handleFrequencyValueChange} />
      </View>
    </Component>
  );
}

export default Oscillator;
