import { View } from "react-native";
import { Label } from "~/components/ui/label";
import { RadioGroupItem } from "~/components/ui/radio-group";

export function RadioGroupItemWithLabel({
  onLabelPress,
  value,
}: {
  onLabelPress: () => void;
  value: string;
}) {
  return (
    <View className={"flex-row gap-2 items-center"}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}
