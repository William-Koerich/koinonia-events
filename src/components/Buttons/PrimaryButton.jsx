import { Button, ButtonText } from '@gluestack-ui/themed';

export function PrimaryButton({ children, ...props }) {
  return (
    <Button
      bg="#452E84"
      borderWidth={0}
      rounded="$md"
      // estados de interação (opcional, mas fica mais bonito)
      $hover-bg="#3D2875"
      $pressed-bg="#352163"
      {...props}
    >
      <ButtonText color="#FFFFFF" fontSize={"$lg"}>
        {children}
      </ButtonText>
    </Button>
  );
}