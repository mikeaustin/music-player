import View from "../view";

function Text(
  props: {
    children: string;
  }
) {
  return (
    <View>
      {props.children}
    </View>
  );
}

export default Text;
