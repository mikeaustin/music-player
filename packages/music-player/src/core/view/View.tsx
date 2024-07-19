import { JSX, Component, ComponentProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import styles from './View.module.css';

type ElementType = keyof JSX.IntrinsicElements | Component<any>;

type AlignHorizontal = 'left' | 'center' | 'right';
type AlignVertical = 'top' | 'middle' | 'bottom';
type AlignShorthand = `${AlignVertical} ${AlignHorizontal}`;

type PaddingHorizontal = 'small' | 'medium' | 'large';

type ViewProps<T extends ElementType> = {
  as?: T,
  flex?: boolean;
  horizontal?: boolean;
  align?: AlignShorthand;
  alignHorizontal?: AlignHorizontal;
  alignVertical?: AlignVertical;
  paddingHorizontal?: PaddingHorizontal;
  children?: JSX.Element;
  classList?: ComponentProps<T>['classList'];
};

function View<T extends ElementType = 'div'>(
  props: ViewProps<T> & Omit<ComponentProps<T>, keyof ViewProps<T>>
) {
  const [local, rest] = splitProps(props, [
    'as', 'flex', 'horizontal',
    'align', 'alignHorizontal', 'alignVertical',
    'paddingHorizontal',
    'children', 'classList',
  ]);

  const [alignVertical, alignHorizontal] =
    local.align?.split(' ') ?? [local.alignVertical, local.alignHorizontal];

  const viewClassList = {
    [styles.View]: true,
    [styles.flex]: local.flex,
    [styles.horizontal]: local.horizontal,
    [styles.alignHorizontalLeft]: alignHorizontal === 'left',
    [styles.alignHorizontalCenter]: alignHorizontal === 'center',
    [styles.alignHorizontalRight]: alignHorizontal === 'right',
    [styles.alignVerticalTop]: alignVertical === 'top',
    [styles.alignVerticalCenter]: alignVertical === 'middle',
    [styles.alignVerticalRight]: alignVertical === 'bottom',
    [styles.paddingHorizontalSmall]: local.paddingHorizontal === 'small',
    ...local.classList,
  };

  return (
    <Dynamic component={local.as ?? 'div'} classList={viewClassList} {...rest}>
      {local.children}
    </Dynamic>
  );
}

export default View;
