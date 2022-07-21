import { useState, useRef } from 'react';
import { signIn } from 'next-auth/client';
import { useRouter } from "next/router"

import classes from './auth-form.module.css';

const createUser = async (email, password) => {
  const response = await fetch("/api/auth/singup", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json"
    },
  })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong")
  }
}

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef()
  const passwordRef = useRef()
  const router = useRouter()

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const submitHandler = async (e) => {
    e.preventDefault()

    const emailValue = emailRef.current.value
    const passwordValue = passwordRef.current.value

    if (isLogin) {
      const result = await signIn("credentials",
        {
          redirect: false,
          email: emailValue,
          password: passwordValue
        },
      )

      if (!result.error) {
        router.replace("/profile")
      }

    } else {
      try {
        const response = await createUser(emailValue, passwordValue)
        console.log(response);
      } catch (error) {
        console.log(error)
      }
    }
  }


  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' ref={passwordRef} required />
        </div>

        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>

          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>

      </form>
    </section>
  );
}

export default AuthForm;
