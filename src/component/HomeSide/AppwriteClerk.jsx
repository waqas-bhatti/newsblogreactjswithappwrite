import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

function AppwriteClerk() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  if (!user) {
    return <RedirectToSignIn />;
  }
  return (
    <div>
      {" "}
      <h1>Hello, {user.firstName}</h1>
    </div>
  );
}

export default AppwriteClerk;
