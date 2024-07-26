
import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button as NativeButton, Text } from '../core';

type ButtonProps = {
  style?: JSX.CSSProperties;
};

function Button(
  props: ButtonProps & ComponentProps<typeof NativeButton> & Omit<ComponentProps<typeof NativeButton>, keyof ButtonProps>
) {
  const [local, rest] = splitProps(props, [
    'children', 'style',
  ]);

  const buttonStyle = () => ({
    background: 'linear-gradient(hsl(0, 0%, 6%), hsl(0, 0%, 4%))',
    color: 'hsl(0, 0%, 50%)',
    ...local.style
  });

  return (
    <NativeButton style={buttonStyle()} {...rest}>
      {local.children}
    </NativeButton>
  );
}

export default Button;
