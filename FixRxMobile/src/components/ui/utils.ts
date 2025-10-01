import { StyleProp, ViewStyle, TextStyle, ImageStyle } from "react-native";

type NamedStyles = ViewStyle | TextStyle | ImageStyle;

export function cn(
  ...inputs: Array<StyleProp<NamedStyles> | false | null | undefined>
): StyleProp<NamedStyles> {
  return inputs.filter(Boolean) as StyleProp<NamedStyles>;
}
