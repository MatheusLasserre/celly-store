import { api } from '~/utils/api'
import { LoadingZero } from './Loading'
import { SelectIntCustom } from './CustomInputs'
import { CLabel } from './Inputs'

type PaymentInput = {
  selectedPaymentId: number
  setSelectedPaymentId: (value: number) => void
  defaultValue?: number
}
export const SelectPayment: React.FC<PaymentInput> = ({
  selectedPaymentId,
  setSelectedPaymentId,
  defaultValue,
}) => {
  const paymentOptions = api.payments.getAvailablePayments.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
  if (!paymentOptions.data) return <LoadingZero />
  return (
    <CLabel label='Forma de Pagamento'>
      <SelectIntCustom
        SelectConfig={{
          nameKey: 'name',
          optionValueKey: 'id',
          options: paymentOptions.data,
        }}
        setCurrentSelected={(value) => {
          setSelectedPaymentId(Number(value))
        }}
        defaultValue={defaultValue || 0}
        selectedValue={selectedPaymentId}
      />
    </CLabel>
  )
}
type CustomerInput = {
  selectedCustomerId: number
  setSelectedCustomerId: (value: number) => void
  defaultValue?: number
}
export const SelectCustomerGroup: React.FC<CustomerInput> = ({
  selectedCustomerId,
  setSelectedCustomerId,
  defaultValue,
}) => {
  const customerOptions = api.groups.getAllGroupsDry.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
  if (!customerOptions.data) return <LoadingZero />
  return (
    <CLabel label='Grupo de Clientes'>
      <SelectIntCustom
        SelectConfig={{
          nameKey: 'name',
          optionValueKey: 'id',
          options: customerOptions.data,
        }}
        setCurrentSelected={(value) => {
          setSelectedCustomerId(Number(value))
        }}
        defaultValue={defaultValue || 0}
        selectedValue={selectedCustomerId}
      />
    </CLabel>
  )
}
type CollectionInput = {
  selectedCollectionId: number
  setSelectedCollectionId: (value: number) => void
  defaultValue?: number
}
export const SelectCollection: React.FC<CollectionInput> = ({
  selectedCollectionId,
  setSelectedCollectionId,
  defaultValue,
}) => {
  const collectionOptions = api.collections.getAllCollectionsDry.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 15, // 15 minutes
  })
  if (!collectionOptions.data) return <LoadingZero />
  return (
    <CLabel label='Coleção'>
      <SelectIntCustom
        SelectConfig={{
          nameKey: 'name',
          optionValueKey: 'id',
          options: collectionOptions.data,
        }}
        setCurrentSelected={(value) => {
          setSelectedCollectionId(Number(value))
        }}
        defaultValue={defaultValue || 0}
        selectedValue={selectedCollectionId}
      />
    </CLabel>
  )
}
