import { JSX, Component, ComponentProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import styles from './View.module.css';

type ElementType = keyof JSX.IntrinsicElements | Component<any>;

type AlignHorizontal = 'left' | 'center' | 'right';
type AlignVertical = 'top' | 'middle' | 'bottom';
type AlignShorthand = `${AlignVertical} ${AlignHorizontal}`;

type Padding = 'none' | 'small' | 'medium' | 'large' | 'xlarge';
type PaddingShorthand = `${Padding} ${Padding}`;

// type Values = 10;
type Color = `gray-${number}`;

type ViewProps<T extends ElementType> = {
  as?: T,
  flex?: boolean;
  horizontal?: boolean;
  align?: AlignShorthand;
  alignHorizontal?: AlignHorizontal;
  alignVertical?: AlignVertical;
  padding?: PaddingShorthand;
  paddingVertical?: Padding;
  paddingHorizontal?: Padding;
  fill?: Color;
  width?: string;
  height?: string;
  children?: JSX.Element;
  class?: string;
  classList?: ComponentProps<T>['classList'];
  style?: JSX.CSSProperties;
};

function View<T extends ElementType = 'div'>(
  props: ViewProps<T> & Omit<ComponentProps<T>, keyof ViewProps<T>>
) {
  const [local, rest] = splitProps(props, [
    'as', 'flex', 'horizontal',
    'align', 'alignHorizontal', 'alignVertical',
    'padding', 'paddingVertical', 'paddingHorizontal',
    'fill',
    'width', 'height',
    'children', 'class', 'classList', 'style',
  ]);

  const [alignVertical, alignHorizontal] =
    local.align?.split(' ') ?? [local.alignVertical, local.alignHorizontal];
  const [paddingVertical, paddingHorizontal] =
    local.padding?.split(' ') ?? [local.paddingVertical, local.paddingHorizontal];

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

    [styles[`paddingVertical-${paddingVertical}`]]: true,
    [styles[`paddingHorizontal-${paddingHorizontal}`]]: true,
    // [styles.paddingHorizontalSmall]: local.paddingHorizontal === 'small',
    // [styles.paddingHorizontalMedium]: local.paddingHorizontal === 'medium',
    // [styles.paddingHorizontalLarge]: local.paddingHorizontal === 'large',

    [styles.backgroundGray0]: local.fill === 'gray-0',
    ...local.classList,
    [local.class ?? '']: true
  };

  const viewStyle = () => ({
    width: local.width,
    height: local.height,
    ...local.style,
  });

  return (
    <Dynamic component={local.as ?? 'div'} style={viewStyle()} classList={viewClassList} {...rest}>
      {local.children}
    </Dynamic>
  );
}

export default View;
