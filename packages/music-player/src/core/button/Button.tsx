import { JSX, Component, ComponentProps, splitProps } from 'solid-js';

import View from '../view';

import styles from './Button.module.css';

type ButtonProps = {
  style?: JSX.CSSProperties;
  children?: JSX.Element;
  classList?: ComponentProps<typeof View>['classList'];
};

function Button(
  props: ButtonProps & ComponentProps<typeof View> & Omit<ComponentProps<'button'>, keyof ButtonProps>
) {
  const [local, rest] = splitProps(props, [
    'children', 'classList',
  ]);

  const viewClassList = {
    [styles.Button]: true,
    ...local.classList,
  };

  return (
    <View as={'button'} classList={viewClassList} {...rest}>
      {local.children}
    </View>
  );
}

export default Button;
