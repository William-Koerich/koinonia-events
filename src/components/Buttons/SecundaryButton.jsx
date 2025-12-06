import { Button, ButtonText } from '@gluestack-ui/themed';

export function SecondaryButton({ children, ...props }) {
  return (
    <Button
      bg="$white"
      borderWidth={1}
      borderColor="#C75797"
      rounded="$md"
      $hover-bg="$white"
      $pressed-bg="$white"
      {...props}
    >
      <ButtonText color="#C75797">
        {children}
      </ButtonText>
    </Button>
  );
}
