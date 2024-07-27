import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from '../core';

function Dial(props: {
  size: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}) {
  const [value, setValue] = createSignal<number>(props.initialValue ?? 0.5);
  const [firstEvent, setFirstEvent] = createSignal<PointerEvent>();

  let _value: number;

  const handlePointerDown: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    event.currentTarget.setPointerCapture(event.pointerId);

    _value = value();

    setFirstEvent(event);
  };

  const handlePointerMove: JSX.EventHandler<HTMLDivElement, PointerEvent> = (event) => {
    const _firstEvent = firstEvent();

    if (_firstEvent) {
      const value = Math.max(0.0, Math.min(1.0, _value + (_firstEvent.clientY - event.clientY) / 270));

      setValue(value);

      props.onValueChange?.(value);
    }
  };

  const handlePointerUp: JSX.EventHandler<HTMLDivElement, PointerEvent> = () => {
    setFirstEvent(undefined);
  };

  const handleWheel: JSX.EventHandler<HTMLDivElement, WheelEvent> = (event) => {
    // console.log('handleWheel', event);

    _value = value();

    const value2 = Math.max(0.0, Math.min(1.0, _value - -event.deltaY / 500));
    // const value2 = Math.max(0.0, Math.min(1.0, _value - Math.sign(event.wheelDeltaY ?? event.deltaY) / 50));

    setValue(value2);

    props.onValueChange?.(value2);
  };

  return (
    <View>
      <View
        absolute
        style={{
          inset: 0,
          "border-radius": '9999px',
          'box-shadow': '0 5px 10px hsla(0, 0%, 0%, 0.5), 0 0 0 2px hsl(0, 0%, 0%)',
        }}
      />
      <View
        align="top center"
        style={{
          width: `${props.size}px`,
          height: `${props.size}px`,
          border: '1px solid hsl(0, 0%, 10%)',
          "border-radius": '9999px',
          background: 'radial-gradient(hsl(0, 0%, 2%), hsl(0, 0%, 5%))',
          transform: `rotate(${value() * 270 - 135}deg)`
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
      >
        <View style={{ background: 'hsl(200, 90%, 60%)', width: '3px', height: '20px' }} />
      </View>
    </View>
  );
}

export default Dial;
