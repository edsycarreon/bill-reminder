import { View } from "react-native";
import {
  Button,
  InputLayout,
  ScreenContainer,
  Skeleton,
  TextInput,
  Typography,
  ScreenLoader,
  Collapsible,
  ThemedText,
  ListLoadingItemComponent,
  ListLoadingHorizontalItemComponent,
  KeyboardAwareScrollView,
  BottomSheet,
  useBottomSheet,
} from "../components";
import { tw } from "../tailwind";
export default function Index() {
  return (
    <ScreenContainer style={[tw`w-full`]}>
      <Button title="Hello" />
      <Typography>Hello</Typography>
      <InputLayout label="Hello">
        <TextInput style={[tw`rounded-full`]} />
      </InputLayout>
      <Skeleton isLoading={true}>
        <Typography>Hello</Typography>
      </Skeleton>
      <Collapsible title="Hello">
        <Typography>Hello</Typography>
      </Collapsible>
      <ThemedText type="title">Hello</ThemedText>
      <ThemedText type="subtitle">Hello</ThemedText>
      <ThemedText type="defaultSemiBold">Hello</ThemedText>
      <ThemedText type="link">Hello</ThemedText>
    </ScreenContainer>
  );
}
