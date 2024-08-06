import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

interface StereoPlugin<T extends AudioNode> {
  shortName: string;
  name: string;
  audioNode: T;
}

type ReceiverProps = {
  source: AudioNode;
  audioNode: GainNode;
  inputComponents: StereoPlugin<any>[];
  selectedInput: string;
  onInputSelect: (input: string) => void;
};

function Receiver(props: ReceiverProps) {
  const [volume, setVolume] = createSignal(0.5);

  let canvasRef: HTMLCanvasElement;

  const handleInputClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const component = props.inputComponents.find(component => component.shortName === event.currentTarget.dataset.name);

    console.log(event.currentTarget.dataset, component);

    if (event.currentTarget.dataset.name) {
      props.onInputSelect(event.currentTarget.dataset.name);
    }
  };

  const handleVolumeValueChange = (value: number) => {
    if (props.audioNode) {
      setVolume(value);
    }
  };

  createEffect(() => {
    let splitterNode = new ChannelSplitterNode(props.audioNode.context, {
      numberOfOutputs: 2,
    });

    const analyserNodeLeft = new AnalyserNode(props.audioNode.context);
    const analyserNodeRight = new AnalyserNode(props.audioNode.context);

    props.source.connect(splitterNode);

    splitterNode.connect(analyserNodeLeft, 0);
    splitterNode.connect(analyserNodeRight, 1);

    const context = canvasRef.getContext('2d');
    let currentMax = 0.0;

    const dataArray = analyserNodeLeft && new Uint8Array(analyserNodeLeft.frequencyBinCount);

    let lastTimestamp = performance.now();

    if (context) {
      canvasRef.width = canvasRef.parentElement?.offsetWidth - 52 ?? 0;
      // canvasRef.width = 548;
      canvasRef.height = 20;

      context.fillStyle = '#38BDF8';

      const animationFrame = (timestamp: number) => {
        if (timestamp - lastTimestamp > 1000 / 30) {
          context.clearRect(0, 0, canvasRef.offsetWidth, 20);

          analyserNodeLeft.getByteTimeDomainData(dataArray);

          let max = dataArray.reduce((max, value) => Math.max(max, (value - 128) / 128), 0);
          currentMax = (currentMax * 1 + max) / 2;

          for (let volume = 0; volume < currentMax * ((canvasRef.offsetWidth - 32) / 2 / 5); ++volume) {
            context.fillRect(volume * 5, 0, 3, 20);
          }

          //

          analyserNodeRight.getByteTimeDomainData(dataArray);

          max = dataArray.reduce((max, value) => Math.max(max, (value - 128) / 128), 0);
          currentMax = (currentMax * 1 + max) / 2;

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

  const selectedInputName = () => {
    const component = props.inputComponents.find(component => component.shortName === props.selectedInput);

    return component?.name.toUpperCase();
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
        <View>
          <Text>{selectedInputName()}</Text>
        </View>
        <View flex />
        <View as="canvas" ref={canvasRef} />
      </View>
      <View padding="large xlarge">
        <View horizontal style={{ gap: '2px', border: '2px solid black', "border-radius": '4px', overflow: 'hidden', background: 'black' }}>
          {props.inputComponents.map(component => (
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
