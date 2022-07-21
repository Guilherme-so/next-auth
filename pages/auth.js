import { useEffect, useState } from "react"
import { useRouter } from "next/router";
import { getSession } from "next-auth/client"
import AuthForm from '../components/auth/auth-form';

function AuthPage() {
  //when hit the login/singup page gonna be loading
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        //if session send to home page
        router.replace("/")

      } else {
        //if not session  keep on login/singup page to auth
        setIsLoading(false)
      }
    })
  }, [])


  if (isLoading) {
    return <p>Loading...</p>
  }

  return <AuthForm />;
}

export default AuthPage;
