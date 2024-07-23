import { JSX, ComponentProps, createSignal, createEffect, splitProps } from 'solid-js';

import { View, Button, Text } from '../core';

import styles from '../App.module.css';

function Component(
  props: ComponentProps<typeof View>
) {
  return (
    <View>
      <View fill="gray-0" class={styles.componentBody} {...props}>
        {props.children}
      </View>
      <View horizontal padding="none xlarge">
        <View width="150px" height="20px" class={styles.componentFoot} />
        <View flex />
        <View width="150px" height="20px" class={styles.componentFoot} />
      </View>
    </View>
  );
}

export default Component;
