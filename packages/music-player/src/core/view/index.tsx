import { JSX, Component, ComponentProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

type ElementType = keyof JSX.IntrinsicElements | Component<any>;

type ViewProps<T extends ElementType> = {
  as?: T,
  children?: JSX.Element;
};

function View<T extends ElementType = 'div'>(props: ViewProps<T> & Omit<ComponentProps<T>, keyof ViewProps<T>>) {
  const [local, rest] = splitProps(props, ['as', 'children']);

  return (
    <Dynamic component={local.as ?? 'div'} {...rest}>
      {local.children}
    </Dynamic>
  );
}

export default View;
