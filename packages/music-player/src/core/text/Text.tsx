import { ComponentProps } from 'solid-js';

import View from "../view";

type TextProps = {
  children: string;
};

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
