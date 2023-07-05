import { useNavigate, useParams } from "react-router";
import { api } from "../../store";
import { useEffect } from "react";
import { AppRoute } from "../../reusable/const";

export const UserActivationHandler = () => {

  const {uid, token} = useParams();
  const navigate = useNavigate();
  
  const activateUser = async (uid, token) => {
    await api.post('auth/users/activation/', {token, uid});
  }
  
  activateUser(uid, token);
  navigate(AppRoute.Root);

  useEffect(() => {
    activateUser(uid, token);
    navigate(AppRoute.Root);
  }, []);

  return null;
}
