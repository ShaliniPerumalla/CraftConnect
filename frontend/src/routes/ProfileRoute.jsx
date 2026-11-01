import useAuth from "../hooks/useAuth";
import CustomerProfile from "../pages/CustomerProfile";
import CreatorProfile from "../pages/CreatorProfile";
import Loader from "../components/Loader";

export default function ProfileRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading profile..." />;
  }

  if (user?.role === "creator") {
    return <CreatorProfile />;
  }

  return <CustomerProfile />;
}
