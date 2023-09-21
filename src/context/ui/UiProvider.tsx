import { FC, ReactElement, useReducer } from 'react'
import { UiContext, uiReducer } from './'

export interface UiState {
  isMenuOpen: boolean
}

const Ui_INITIAL_STATE: UiState = {
  isMenuOpen: false
}

interface Props {
  children: ReactElement | ReactElement[]
}

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, Ui_INITIAL_STATE)

  const toogleSideMenu = () => {
    dispatch({ type: '[UI] - ToogleMenu' })
  }

  return (
    <UiContext.Provider
      value={{ ...state, toogleSideMenu }}>
      {children}
    </UiContext.Provider>
  )
}