import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, FormButton } from '~/components/utils/Buttons'
import { DefaultText, HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import {
  CLCurrencyInput,
  CLText,
  FormError,
} from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { FlexColumn, FlexRow } from '~/components/utils/Utils'
import { api } from '~/utils/api'
import { formatPhone } from '~/utils/formating/credentials'

export const Cadastrar: NextPage = () => {
  return (
    <ContentLayout>
      <Header />
      <Form />
    </ContentLayout>
  )
}

export default Cadastrar

const Header: React.FC = () => {
  return (
    <FlexColumn>
      <FlexColumn maxWidth='600px' margin='0 0 30px 0'>
        <BackButton />
        <HeadlineText>Cadastrar novo método de pagamento</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar um novo pagamento. Meios de pagamento serão utilizados
         para calcular as taxas de cada venda.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  const router = useRouter()
  const [paymentInfo, setPaymentInfo] = React.useState({
    name: '',
    value: 0,
  })
  const [creatingPayment, setCreatingPayment] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createPayment = api.payments.createPayment.useMutation({
    onSuccess: () => {
      utils.payments.getAllPayments.invalidate()
      utils.payments.getAvailablePayments.invalidate()
    },
    onError: () => {
      setCreatingPayment(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!paymentInfo.name) return alert('Digite o nome do pagamento.')
      if (typeof paymentInfo.value !== 'number') return alert('Digite a taxa.')
    setCreatingPayment(true)
    await createPayment.mutateAsync({
      name: paymentInfo.name,
      value: paymentInfo.value,
    })
    setCreatingPayment(false)
    setSuccess(true)
    setPaymentInfo({
      name: '',
      value: 0,
    })
    setTimeout(() => {
        setSuccess(false)
    }, 1500)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minWidth: '340px',
        width: '100%',
        maxWidth: '500px',
      }}
    >
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Nome do método de pagamento.'
            placeholder='Nome do método de pagamento.'
            value={paymentInfo.name}
            onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLCurrencyInput
            label='Taxa'
            placeholder='Custo por transação.'
            currencyValue={paymentInfo.value}
            setCurrencyValue={(value) => setPaymentInfo({ ...paymentInfo, value: value })}
          />
        </FlexColumn>
      </FlexRow>
      
      <FormError isError={!!createPayment.error} message={createPayment.error?.message} />
      <FlexRow>
        {creatingPayment ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>
            Pagamento cadastrado com sucesso!
          </DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Pagamento</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
