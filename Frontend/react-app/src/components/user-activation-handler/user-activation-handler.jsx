import { useNavigate, useParams } from "react-router";
import { AppRoute } from "../../const";
import { api } from "../../store";
import { useEffect } from "react";

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

}
