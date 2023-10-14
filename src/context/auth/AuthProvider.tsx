import { FC, ReactElement, useEffect, useReducer } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Cookies from 'js-cookie'
import axios from 'axios'

import { AuthContext, authReducer } from './'

import tesloApi from '@/api/tesloApi'

import { IUser } from '@/interfaces'

export interface AuthState {
  isLoggedIn: boolean
  user?: IUser
}

const Auth_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined
}

interface Props {
  children: ReactElement | ReactElement[]
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const { data, status } = useSession()

  const [state, dispatch] = useReducer(authReducer, Auth_INITIAL_STATE)

  useEffect(() => {

    if (status === 'authenticated') {
      console.log("🚀 ~ file: AuthProvider.tsx:43 ~ useEffect ~ data.user:", data?.user)
      dispatch({ type: '[Auth] - Login', payload: data?.user as IUser })
    }

  }, [data, status])


  const checkToken = async (): Promise<void> => {
    try {

      if (!Cookies.get('token')) return

      const { data } = await tesloApi.get('/user/validate-token')

      const { token, user } = data

      Cookies.set('token', token)

      dispatch({ type: '[Auth] - Login', payload: user })
    } catch (error) {
      Cookies.remove('token')
    }
  }

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password })

      const { token, user } = data

      Cookies.set('token', token)

      dispatch({ type: '[Auth] - Login', payload: user })

      return true
    } catch (error) {
      return false
    }
  }

  const registerUser = async (name: string, email: string, password: string): Promise<{
    hasError: boolean; message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password })

      const { token, user } = data

      Cookies.set('token', token)

      dispatch({ type: '[Auth] - Login', payload: user })

      return {
        hasError: false
      }
    } catch (error) {

      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message
        }
      }

      return {
        hasError: true,
        message: 'No se pudo crear el usuario - intente de nuevo'
      }
    }
  }

  const logoutUser = () => {
    Cookies.remove('cart')
    Cookies.remove('firstName')
    Cookies.remove('lastName')
    Cookies.remove('address')
    Cookies.remove('address2')
    Cookies.remove('zip')
    Cookies.remove('city')
    Cookies.remove('country')
    Cookies.remove('phone')
    signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,
        // Methods
        loginUser,
        registerUser,
        logoutUser
      }}>
      {children}
    </AuthContext.Provider>
  )
}