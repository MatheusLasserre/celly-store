import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, FormButton } from '~/components/utils/Buttons'
import { SelectIntCustom } from '~/components/utils/CustomInputs'
import { DefaultText, HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import { CLabel, CLCurrencyInput, CLRadio, CLText, FormError } from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { FlexColumn, FlexRow, LoadingWrapper } from '~/components/utils/Utils'
import { api } from '~/utils/api'
import ErrorPage from 'next/error'
import { undefinedIfEqual } from '~/utils/utils'
import { formatPhone } from '~/utils/formating/credentials'

export const Editar: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  if (typeof id !== 'string' && typeof id !== 'undefined') {
    return <ErrorPage statusCode={404} />
  }

  const paymentInfo = api.payments.getPaymentById.useQuery(
    { paymentId: Number(id) },
    {
      enabled: typeof id === 'string',
      refetchOnWindowFocus: false,
    },
  )
  return (
    <ContentLayout>
      <Header />
      <LoadingWrapper loading={paymentInfo.isFetching || paymentInfo.isLoading}>
        {paymentInfo.data && (
          <Form
            tax={paymentInfo.data.value}
            name={paymentInfo.data.name}
            enabled={paymentInfo.data.enabled}
            paymentId={paymentInfo.data.id}
          />
        )}
      </LoadingWrapper>
    </ContentLayout>
  )
}

export default Editar

const Header: React.FC = () => {
  return (
    <FlexColumn>
      <FlexColumn maxWidth='600px' margin='0 0 30px 0'>
        <BackButton />
        <HeadlineText>Editar Pagamento</HeadlineText>
        <SubHeadlineText>
          Modifique as informações abaixo e clique em salvar para editar sua informações.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}
type FormProps = {
  paymentId: number
  name: string
  tax: number
  enabled: boolean
}
const Form: React.FC<FormProps> = ({ paymentId, tax, name, enabled }) => {
  const [paymentInfo, setPaymentInfo] = React.useState({
    name: name,
    tax: tax,
    paymentId: paymentId,
    enabled: enabled,
  })
  const [creatingPayment, setCreatingPayment] = React.useState(false)

  const utils = api.useUtils()
  const updatePayment = api.payments.updatePayment.useMutation({
    onSuccess: () => {
      utils.payments.getAllPayments.invalidate()
      utils.payments.getAvailablePayments.invalidate()
      utils.payments.getPaymentById.invalidate({ paymentId: paymentId })
    },
    onError: () => {
      setCreatingPayment(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!paymentInfo.name) return alert('Nome do pagamento não pode estar vazio.')
    if (!paymentInfo.tax) return alert('Taxa não pode estar vazia.')

    setCreatingPayment(true)
    await updatePayment.mutateAsync({
      paymentName: undefinedIfEqual(paymentInfo.name, name),
      paymentValue: undefinedIfEqual(paymentInfo.tax, tax),
      paymentId: paymentId,
      enabled: undefinedIfEqual(paymentInfo.enabled, enabled),
    })
    setCreatingPayment(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
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
            currencyValue={paymentInfo.tax}
            setCurrencyValue={(value) => setPaymentInfo({ ...paymentInfo, tax: value })}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLabel label='Método de pagamento ativo?'>
            <FlexRow verticalAlign='center' horizontalAlign='center' height='50px' width='180px'>
              <CLRadio
                label='Sim'
                selected={paymentInfo.enabled ? true : false}
                setSelected={() => setPaymentInfo({ ...paymentInfo, enabled: true })}
              />
              <CLRadio
                label='Não'
                selected={paymentInfo.enabled ? false : true}
                setSelected={() => setPaymentInfo({ ...paymentInfo, enabled: false })}
              />
            </FlexRow>
          </CLabel>
        </FlexColumn>
      </FlexRow>
      <FormError isError={updatePayment.isError} message={updatePayment.error?.message} />
      <FlexRow>
        {creatingPayment ? <LoadingZero /> : <FormButton type='submit'>Salvar</FormButton>}
      </FlexRow>
    </form>
  )
}
