import { useUser } from '../../_layers/_providers/user-provider';

const HomeHeader = () => {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-semibold">
        Welcome back, {user?.first_name}!
      </h1>
      <p className="text-muted-foreground text-sm">
        Here you can manage your locations, items, and more.
      </p>
    </div>
  );
};

export default HomeHeader;
