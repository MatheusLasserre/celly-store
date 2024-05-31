import { type NextPage } from 'next'
import Style from './Index.module.css'
import { Dispatch, SetStateAction, useState } from 'react'
import { Loading } from '~/components/utils/Loading'
import { useRouter } from 'next/router'
import { CLCheckbox, CLText, FormError, FormFlex, FormSuccess } from '~/components/utils/Inputs'
import { FormButton, LIconButton1, MiniLink1, StateButton } from '~/components/utils/Buttons'
import { FormSubtitle, FormTitle } from '~/components/utils/Headers'
import { FlexRow, Spacer } from '~/components/utils/Utils'
import { TextIcon } from '~/components/utils/Icons'
import { api } from '~/utils/api'
import { setCookie } from 'nookies'
import { CustomModal } from '~/components/utils/Modal'
import {
  formatCpf,
  formatPhone,
  validateCPF,
  stripCpf,
  validatePasswordRegex,
} from '~/utils/formating/credentials'
import { z } from 'zod'
import { checkAuth } from '~/utils/auth/client'
import { setUserCookies } from '~/utils/security/cookies'

const Index: NextPage = () => {
  checkAuth()
  const router = useRouter()
  const register = router.query.cadastro
  const [loginForm, setLoginForm] = useState<boolean>(register ? false : true)
  const [forgetPassword, setForgetPassword] = useState<boolean>(false)

  return (
    <div className={Style.pageContainer}>
      {forgetPassword ? (
        <ForgotPasswordForm toggleForgot={setForgetPassword}></ForgotPasswordForm>
      ) : loginForm ? (
        <LoginForm toggleLogin={setLoginForm} toggleForgot={setForgetPassword}></LoginForm>
      ) : (
        <NewRegisterForm toggleLogin={setLoginForm}></NewRegisterForm>
      )}
    </div>
  )
}
export default Index

type LoginProps = {
  toggleLogin: Dispatch<SetStateAction<boolean>>
  toggleForgot: Dispatch<SetStateAction<boolean>>
}

const LoginForm: React.FC<LoginProps> = ({ toggleForgot, toggleLogin }) => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const { mutateAsync: adminMutation, error } = api.auth.loginUser.useMutation()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError(null)
    setLoggingIn(true)
    if (loggingIn || email === '' || password === '') {
      setLoginError('Preencha todos os campos')
      setLoggingIn(false)
      return
    }

    const loginResponse = await adminMutation(
      {
        userEmail: email,
        userPassword: password,
      },
      {
        onError: (error) => {
          setLoginError(error.message)
          setLoggingIn(false)
        },
      },
    )
    if (!loginResponse.cookie) {
      setLoginError(loginResponse.error)
      setLoggingIn(false)
      return
    }
    setUserCookies(loginResponse.cookie)

    router.push('/admin')
    setLoggingIn(false)
  }
  const [rememberMe, setRememberMe] = useState<boolean>(false)

  return (
    <div className={Style.loginFormContainer}>
      <form onSubmit={handleSubmit} className={Style.loginForm}>
        <FormTitle>Login</FormTitle>
        <FormSubtitle>Faça login para continuar. </FormSubtitle>
        <FormFlex>
          <CLText
            label='Email'
            required
            placeholder='Seu Email...'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CLText
            label='Senha'
            required
            placeholder='Sua Senha...'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormButton type='submit' loading={loggingIn}>
            Entrar
          </FormButton>
          <MiniLink1 onClick={() => toggleForgot(true)}>Esqueci minha senha</MiniLink1>
          <CLCheckbox
            checked={rememberMe}
            setChecked={setRememberMe}
            label='Lembrar minhas credenciais'
          />
        </FormFlex>
        <FormError isError={!!loginError} message={loginError} />
      </form>
      <Spacer top='12px' bottom='0'>
        <LIconButton1 label='Primeiro acesso' onClick={() => toggleLogin(false)}>
          <TextIcon />
        </LIconButton1>
      </Spacer>
    </div>
  )
}

type NewRegisterFormProps = {
  toggleLogin: Dispatch<SetStateAction<boolean>>
}

const NewRegisterForm: React.FC<NewRegisterFormProps> = ({ toggleLogin }) => {
  const router = useRouter()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('')
  const [loggingIn, setLoggingIn] = useState<boolean>(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const { mutateAsync: adminMutation, error } = api.auth.createUser.useMutation()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoginError(null)
    setLoggingIn(true)
    if (loggingIn || email === '' || password === '') {
      setLoginError('Preencha todos os campos')
      setLoggingIn(false)
      return
    }

    const loginResponse = await adminMutation(
      {
        email: email,
        password: password,
        name: name,
        confirmPassword: passwordConfirmation,
      },
      {
        onError: (error) => {
          setLoginError(error.message)
          setLoggingIn(false)
        },
      },
    )
    if (!loginResponse.cookie) {
      setLoginError(loginResponse.error)
      setLoggingIn(false)
      return
    }
    setUserCookies(loginResponse.cookie)

    router.push('/admin')
    setLoggingIn(false)
  }

  return (
    <div className={Style.loginFormContainer}>
      <form onSubmit={handleSubmit} className={Style.loginForm}>
        <FormTitle>Criar Conta</FormTitle>
        <FormSubtitle>Crie uma conta para poder acessar o sistema</FormSubtitle>
        <FormFlex>
          <CLText
            label='Nome'
            value={name}
            onChange={(e) => setName(e.target.value)}
            type='text'
            required
            placeholder='Seu nome'
          />
          <CLText
            label='Email'
            required
            placeholder='Seu Email...'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <CLText
            label='Senha'
            required
            placeholder='Sua Senha...'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <CLText
            label='Confirmar Senha'
            required
            placeholder='Confirme sua senha...'
            type='password'
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <FormButton type='submit' loading={loggingIn}>
            Cadastrar
          </FormButton>
          <MiniLink1 onClick={() => toggleLogin(true)}>Fazer login</MiniLink1>
        </FormFlex>
        <FormError isError={!!loginError} message={loginError} />
      </form>
    </div>
  )
}

type ForgotProps = {
  toggleForgot: Dispatch<SetStateAction<boolean>>
}

const ForgotPasswordForm: React.FC<ForgotProps> = ({ toggleForgot }) => {
  // First CPF, then Name, then Email and Password, then Phone
  // check user existance with cpf, if exists, show error and asks for login or password recovery
  // check user existance with email, if exists, show error and asks for login or password recovery

  const [email, setEmail] = useState<string>('')
  const [emailError, setEmailError] = useState<string | null>(null)
  const emailSchema = z.string().email()
  const [password, setPassword] = useState<string>('')
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passwordConfirm, setPasswordConfirm] = useState<string>('')

  const handleEmailAndPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const validEmail = emailSchema.safeParse(email)
    if (!validEmail.success) {
      setEmailError('Email inválido')
      return
    }
    setEmailError(null)
    if (password !== passwordConfirm) {
      setPasswordError('Senhas não coincidem')
      return
    }
    const validPassword = validatePasswordRegex(password)
    if (!validPassword.valid) {
      setPasswordError(validPassword.error!)
      return
    }
    setPasswordError(null)
    handleNewPassword()
  }

  const [registering, setRegistering] = useState<boolean>(false)
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [registerSuccess, setRegisterSuccess] = useState<boolean>(false)

  const updatePassword = api.auth.updateUserPassword.useMutation()

  const handleNewPassword = async () => {
    setRegistering(true)
    setRegisterError(null)
    const data = await updatePassword.mutateAsync({
      userEmail: email,
      userPassword: password,
      userConfirmPassword: passwordConfirm,
    })

    if (data.error) {
      setRegisterError(data.error)
      setRegistering(false)
      return
    }

    setRegisterSuccess(true)
    setRegistering(false)
    setTimeout(() => {
      toggleForgot(false)
    }, 2000)
  }

  return (
    <div className={Style.loginFormContainer}>
      <form onSubmit={handleEmailAndPassword} className={Style.loginForm}>
        <FormTitle>Esqueci Minha Senha</FormTitle>
        <FormSubtitle>Coloque seu email e nova senha</FormSubtitle>

        <FormFlex>
          <CLText
            required
            label='Email'
            placeholder='Seu Email...'
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormError message={emailError} isError={!!emailError} />
          <CLText
            required
            label='Senha'
            placeholder='Sua Senha...'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormError message={passwordError} isError={!!passwordError} />
          <CLText
            required
            label='Confirmar Senha*'
            placeholder='Confirme sua Senha...'
            type='password'
            name='passwordConfirm'
            value={passwordConfirm}
            id='passwordConfirm'
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />
        </FormFlex>

        {registering ? (
          <Loading></Loading>
        ) : (
          <FlexRow
            gap='20px'
            margin='30px auto auto auto'
            horizontalAlign='center'
            verticalAlign='center'
          >
            <FormButton type='submit'>Salvar</FormButton>
          </FlexRow>
        )}
        <FormSuccess message='Senha alterada com sucesso!' isSuccess={!!registerSuccess} />
        <FormError message={registerError} isError={!!registerError} />
        <MiniLink1 onClick={() => toggleForgot(false)}>Fazer Login</MiniLink1>
      </form>
    </div>
  )
}
