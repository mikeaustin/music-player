import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Text } from '../core';

import Dial from '../components/Dial';
import Button from '../components/Button';
import Component from '../components/Component';

function Slider() {
  const [value, setValue] = createSignal<number>(0.5);
  const [firstEvent, setFirstEvent] = createSignal<PointerEvent>();

  let _value: number;

  const height = 150 - 56;

  const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    _value = value();

    setFirstEvent(event);
  };

  const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    const _firstEvent = firstEvent();

    if (_firstEvent) {
      const value = Math.max(0.0, Math.min(1.0, _value + (_firstEvent.clientY - event.clientY) / height));

      setValue(value);

      // props.onValueChange?.(value);
    }
  };

  const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = () => {
    setFirstEvent(undefined);
  };

  return (
    <View height="150px" style={{ xbackground: 'black', xborder: '2px solid black', "border-radius": '4px' }}>
      <View style={{ position: 'absolute', inset: '0 10px 0 9px', background: 'black', "border-radius": '4px' }} />
      <View
        padding="large none"
        style={{ background: 'hsl(0, 0%, 5%)', border: '1px solid hsl(0, 0%, 10%', "border-radius": '4px', top: `${height - value() * height}px`, "box-shadow": '0 0 0 2px black' }}
        // title={`${value()}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <View style={{ background: 'hsl(200, 90%, 60%)', width: '20px', height: '3px' }} />
      </View>
    </View>
  );
}

type EqualizerProps = {
  audioNode: BiquadFilterNode;
  analyserNode: AnalyserNode;
  file: File | null;
};

function Equalizer(props: EqualizerProps) {
  const [frequency, setFrequency] = createSignal(0.5);
  const [waveType, setWaveType] = createSignal('sine');

  let canvasRef: HTMLCanvasElement;

  let frequencies = Array.from({ length: 10 }, () => 1.0);

  createEffect(() => {
    canvasRef.width = canvasRef.parentElement?.offsetWidth - 52;
    canvasRef.height = canvasRef.parentElement?.offsetHeight - 52;

    // props.analyserNode.smoothingTimeConstant = 0.2;

    const dataArray = props.analyserNode && new Uint8Array(props.analyserNode.frequencyBinCount);

    const context = canvasRef.getContext('2d');

    if (context) {
      const offset = 5 + 5 * (canvasRef.height / 5 - Math.floor(canvasRef.height / 5));

      context.fillStyle = '#38BDF8';

      const animationFrame = (timestamp: number) => {
        props.analyserNode.getByteFrequencyData(dataArray);

        for (let i = 0; i < frequencies.length; ++i) {
          // frequencies[i] = (frequencies[i] * 1 + dataArray[Math.floor((2 ** i - 1) * (1 / (41000 / 48000)))] / 255) / 2;
          // frequencies[i] = dataArray[Math.floor(i / 9 * 1024 * (20000 / 96000))] / 255;
          // frequencies[i] = dataArray[2 ** Math.floor(i * 2 * 20000 / 48000) - 2] / 255;
          frequencies[i] = dataArray[Math.floor((2 ** i) * 2 * (20000 / 48000))] / 255;
        }

        // console.log(dataArray);

        context.clearRect(0, 0, 1000, 1000);

        for (let [index, volume] of frequencies.entries()) {
          for (let i = 0; i < volume * canvasRef.height / 5; ++i) {
            context.fillRect(index * 25, canvasRef.height - offset - (i * 5), 20, 3);
          }
        }

        requestAnimationFrame(animationFrame);
      };

      requestAnimationFrame(animationFrame);
    }
  });

  return (
    <Component horizontal>
      <View padding="large xlarge">
        <Button align="top center" width="80px" height="48px" padding="small none" style={{ border: '2px solid black', "border-radius": '4px' }}>
          <View width="20px" height="3px" style={{ background: 'hsl(200, 90%, 60%)' }} />
        </Button>
      </View>
      <View padding="large large" style={{ background: 'black', width: '600px', "flex-shrink": 0, 'border-left': '2px solid black', 'border-right': '2px solid black' }}>
        <View absolute style={{ inset: 0, background: 'linear-gradient(hsl(0, 0%, 0%), hsl(0, 0%, 5%) 50px, hsl(0, 0%, 0%) 150px) 0px 0px / 100% 300px no-repeat' }} />
        <View as="canvas" ref={canvasRef} />
      </View>
      <View horizontal padding="large xlarge" style={{ gap: '24px' }}>
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
        <Slider />
      </View>
      <View flex />
      <View horizontal padding="large xlarge" align="middle left">
      </View>
    </Component>
  );
}

export default Equalizer;
