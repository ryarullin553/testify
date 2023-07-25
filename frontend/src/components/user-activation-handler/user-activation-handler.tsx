import { useNavigate, useParams } from "react-router";
import { api } from "../../store";
import { FC, useEffect } from "react";
import { AppRoute } from "../../reusable/const";

export const UserActivationHandler: FC = () => {

  const { uid, token } = useParams();
  const navigate = useNavigate();
  
  const activateUser = async (uid: string, token: string) => {
    await api.post('auth/users/activation/', {token, uid});
  }

  if (uid && token) {
    activateUser(uid, token);
    navigate(AppRoute.Root);
  }

  // useEffect(() => {
  //   activateUser(uid, token);
  //   navigate(AppRoute.Root);
  // }, []);

  return null;
}
