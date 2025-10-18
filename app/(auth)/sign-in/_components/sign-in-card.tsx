import { Button } from '@/components/ui/button';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldControl, FieldLabel } from '@/components/ui/field';
import { Form } from '@/components/ui/form';

const SignInCard = () => {
  return (
    <Card className="w-full max-w-sm" variant={'ring'}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account.
        </CardDescription>
      </CardHeader>
      <Form>
        <CardPanel>
          <div className="flex flex-col gap-4">
            <Field>
              <FieldLabel>Email</FieldLabel>
              <FieldControl
                type="email"
                placeholder="Enter your email"
                required
              />
            </Field>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <FieldControl
                type="password"
                placeholder="Enter your password"
                required
              />
            </Field>
          </div>
        </CardPanel>
        <CardFooter>
          <Button className="w-full" type="submit">
            Sign In
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
};

export default SignInCard;
