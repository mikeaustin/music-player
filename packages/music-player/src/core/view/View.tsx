import { JSX, Component, ComponentProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import styles from './View.module.css';

type ElementType = keyof JSX.IntrinsicElements | Component<any>;

type AlignHorizontal = 'left' | 'center' | 'right';
type AlignVertical = 'top' | 'middle' | 'bottom';
type AlignShorthand = `${AlignVertical} ${AlignHorizontal}`;

type PaddingHorizontal = 'small' | 'medium' | 'large';

// type Values = 10;
type Color = `gray-${number}`;

type ViewProps<T extends ElementType> = {
  as?: T,
  flex?: boolean;
  horizontal?: boolean;
  align?: AlignShorthand;
  alignHorizontal?: AlignHorizontal;
  alignVertical?: AlignVertical;
  paddingHorizontal?: PaddingHorizontal;
  fill?: Color;
  width?: string;
  height?: string;
  children?: JSX.Element;
  classList?: ComponentProps<T>['classList'];
  style?: JSX.CSSProperties;
};

function View<T extends ElementType = 'div'>(
  props: ViewProps<T> & Omit<ComponentProps<T>, keyof ViewProps<T>>
) {
  const [local, rest] = splitProps(props, [
    'as', 'flex', 'horizontal',
    'align', 'alignHorizontal', 'alignVertical',
    'paddingHorizontal',
    'fill',
    'width', 'height',
    'children', 'classList', 'style',
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
    [styles.paddingHorizontalMedium]: local.paddingHorizontal === 'medium',
    [styles.paddingHorizontalLarge]: local.paddingHorizontal === 'large',
    [styles.backgroundGray0]: local.fill === 'gray-0',
    ...local.classList,
  };

  const viewStyle = {
    width: props.width,
    height: props.height,
    ...props.style,
  };
  return (
    <Dynamic component={local.as ?? 'div'} style={viewStyle} classList={viewClassList} {...rest}>
      {local.children}
    </Dynamic>
  );
}

export default View;
