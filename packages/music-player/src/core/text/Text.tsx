import { JSX, ComponentProps } from 'solid-js';

import View from "../view";

type TextProps = {
  children?: JSX.Element;
  // children?: Omit<JSX.Element, 'Node'>;
};

type ExpandRecursively<T> = T extends object
  ? T extends infer O ? { [K in keyof O]: ExpandRecursively<O[K]> } : never
  : T;

type XXX = ExpandRecursively<JSX.Element>;

function Text(
  props: TextProps & ComponentProps<typeof View>
) {
  return (
    <View style={{ "font-size": '20px' }}>
      <span style={{ display: 'inline-block', 'margin-top': '-6px', "margin-bottom": '-8px' }}>
        {props.children}
      </span>
    </View>
  );
}

export default Text;
