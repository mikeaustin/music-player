import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

interface StereoPlugin<T extends AudioNode> {
  shortName: string;
  name: string;
  audioNode: AudioNode;
}

type ReceiverProps = {
  audioNode: GainNode;
  analyserNode: AnalyserNode;
  components: StereoPlugin<any>[];
};

function Receiver(props: ReceiverProps) {
  const [volume, setVolume] = createSignal(0.5);
  let canvasRef: HTMLCanvasElement;

  const handleInputClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const component = props.components.find(component => component.shortName === event.currentTarget.dataset.name);

    console.log(event.currentTarget.dataset, component);

    if (component) {
      component.audioNode
        .connect(props.audioNode)
        .connect(props.analyserNode)
        .connect(props.audioNode.context.destination);
    }
  };

  const handleVolumeValueChange = (value: number) => {
    if (props.audioNode) {
      setVolume(value);
    }
  };

  createEffect(() => {
    const context = canvasRef.getContext('2d');
    let currentMax = 0.0;

    const dataArray = props.analyserNode && new Uint8Array(props.analyserNode.frequencyBinCount);

    let lastTimestamp = performance.now();

    if (context) {
      canvasRef.width = canvasRef.parentElement?.offsetWidth - 52 ?? 0;
      // canvasRef.width = 548;
      canvasRef.height = 20;

      context.fillStyle = '#38BDF8';

      const animationFrame = (timestamp: number) => {
        if (timestamp - lastTimestamp > 1000 / 30) {
          props.analyserNode.getByteTimeDomainData(dataArray);

          const max = dataArray.reduce((max, value) => Math.max(max, (value - 128) / 64), 0);

          currentMax = (currentMax * 1 + max) / 2;

          context.clearRect(0, 0, canvasRef.offsetWidth, 20);

          for (let volume = 0; volume < currentMax * ((canvasRef.offsetWidth - 32) / 2 / 5); ++volume) {
            context.fillRect(volume * 5, 0, 3, 20);
          }

          for (let volume = 0; volume < currentMax * ((canvasRef.offsetWidth - 24) / 2 / 5); ++volume) {
            context.fillRect((canvasRef.offsetWidth + 24) / 2 + volume * 5, 0, 3, 20);
          }

          lastTimestamp = timestamp;
        }

        requestAnimationFrame(animationFrame);
      };

      requestAnimationFrame(animationFrame);
    }
  });

  createEffect(() => {
    const value = volume();

    if (props.audioNode) {
      props.audioNode.gain.value = value;
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
        <View>
          <Text>DAT PLAYER</Text>
        </View>
        <View flex />
        <View as="canvas" ref={canvasRef} />
      </View>
      <View padding="large xlarge">
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          {props.components.map(component => (
            <Button align="middle center" width="80px" height="48px" padding="small none" data-name={component.shortName} onClick={handleInputClick}>
              {component.shortName}
            </Button>
          ))}
        </View>
      </View>
      <View flex />
      <View horizontal padding="large xlarge">
        <Dial size={150} initialValue={0.5} onValueChange={handleVolumeValueChange} />
      </View>
    </Component>
  );
}

export default Receiver;
