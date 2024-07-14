import { NextPage } from 'next'
import React from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, FormButton } from '~/components/utils/Buttons'
import {
  DateSelection,
  SelectCustomQuery,
  SelectIntCustom,
} from '~/components/utils/CustomInputs'
import { DefaultText, HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import { CrossIcon } from '~/components/utils/Icons'
import {
  CFalseText,
  CLabel,
  FormError,
} from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { CTable } from '~/components/utils/Table'
import { FlexColumn, FlexRow } from '~/components/utils/Utils'
import { api } from '~/utils/api'
import { FormatNumberMask } from '~/utils/formating/credentials'

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
        <HeadlineText>Cadastrar nova venda</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar uma nova venda.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  
  const [creatingOrder, setCreatingOrder] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createOrder = api.orders.createOrder.useMutation({
    onSuccess: (data) => {
      utils.orders.getAllOrders.invalidate()
      utils.orders.getAllOrdersSearch.invalidate()
    },
    onError: () => {
      setCreatingOrder(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    

    setCreatingOrder(true)
    await createOrder.mutateAsync({
      groupId: Number(groupInfo.id),
      paymentMethodId: Number(paymentMethodId),
      date: date,
      products: productArray,
    })
    setCreatingOrder(false)
    setSuccess(true)
    handleReset()
    setTimeout(() => {
      setSuccess(false)
    }, 1500)
  }

  const handleReset = () => {
    setCreatingOrder(false)
    setGroupInfo({
      id: 0,
      name: '',
    })
    setPaymentMethodId(0)
    setDate(new Date())
    setProductsArray([])
  }

  // Select Group
  const [groupInfo, setGroupInfo] = React.useState<{
    id: number
    name: string
  }>({
    id: 0,
    name: '',
  })
  const [query, setQuery] = React.useState('')
  const [queryTrigger, setQueryTrigger] = React.useState('')
  const groupList = api.groups.getAllGroupsDrySearch.useQuery(
    {
      query: query,
    },
    {
      refetchOnWindowFocus: false,
    },
  )
  const [timeouts, setTimeouts] = React.useState<NodeJS.Timeout[]>([])
  const handleSetQuery = (text: string) => {
    setQueryTrigger(text)
    timeouts.forEach((timeout) => clearTimeout(timeout))
    const timeOut = setTimeout(() => {
      setQuery(text)
    }, 300)
    setTimeouts([timeOut])
  }
  const handleSetGroupById = (id: number) => {
    const group = groupList.data?.find((group) => group.id === id)
    if (!group) return
    setGroupInfo({
      id: group.id,
      name: group.name,
    })
  }

  //Select PaymentMethod
  const [paymentMethodId, setPaymentMethodId] = React.useState<number>(0)
  const paymentMethods = api.payments.getAvailablePayments.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })

  // Select Date
  const [date, setDate] = React.useState<Date>(new Date())

  // Select Products
  type Product = {
    id: number
    name: string
    price: number
    cost: number
    code: string
    quantity: number
    profit: number
  }
  const [productsQuery, setProductsQuery] = React.useState('')
  const [productsQueryTrigger, setProductsQueryTrigger] = React.useState('')
  const [productArray, setProductsArray] = React.useState<Product[]>([])
  const productsList = api.products.getAllProductsByCodeSearch.useQuery(
    {
      query: productsQuery,
    },
    {
      refetchOnWindowFocus: false,
    },
  )
  const [productsTimeouts, setProductsTimeouts] = React.useState<NodeJS.Timeout[]>([])
  const handleSetProductsQuery = (text: string) => {
    setProductsQueryTrigger(text)
    productsTimeouts.forEach((timeout) => clearTimeout(timeout))
    const timeOut = setTimeout(() => {
      setProductsQuery(text)
    }, 300)
    setProductsTimeouts([timeOut])
  }
  const handleSetProductById = (id: number) => {
    const product = productsList.data?.products.find((product) => product.id === id)
    if (!product) return
    console.log('product', product)
    setProductsArray([
      ...productArray,
      {
        id: product.id,
        name: product.name,
        price: product.price,
        cost: product.cost,
        code: product.code,
        profit: product.profit,
        quantity: 1,
      },
    ])
  }
  const handleRemoveProduct = (id: number) => {
    const product = productArray.find((product) => product.id === id)
    if (!product) return
    setProductsArray(productArray.filter((product) => product.id !== id))
  }

  const handleSetProductQuantity = (index: number, quantity: number) => {
    const product = productArray[index]
    if (!product) {
      console.log('Erro ao alterar quantidade', index, quantity, productArray)
      return
    }
    console.log('product', productArray)
    setProductsArray((prev) =>
      prev.map((product, idx) => {
        if (idx === index) {
          return {
            ...product,
            quantity: quantity,
          }
        }
        return product
      }),
    )
  }
  const quantityOptions = Array.from({ length: 100 }, (_, i) => {
    return { value: i + 1 }
  })

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        minWidth: '340px',
        width: '100%',
        maxWidth: '800px',
      }}
    >
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Cliente'>
            {groupInfo.id > 0 ? (
              <CFalseText text={groupInfo.name} onClick={() => setGroupInfo({ id: 0, name: '' })} />
            ) : (
              <SelectCustomQuery
                data={groupList.data}
                labelKey='name'
                label='Buscar'
                query={queryTrigger}
                setQuery={handleSetQuery}
                setValue={handleSetGroupById}
                valueKey='id'
              />
            )}
          </CLabel>
        </FlexColumn>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Meio de Pagamento'>
            <SelectIntCustom
              SelectConfig={{
                options: paymentMethods.data || [],
                nameKey: 'name',
                optionValueKey: 'id',
              }}
              setCurrentSelected={(value) => setPaymentMethodId(value)}
              defaultValue={0}
              selectedValue={paymentMethodId}
            />
          </CLabel>
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLabel label='Data da venda'></CLabel>
          <DateSelection date={date} setDate={setDate} />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLabel label='Produtos'>
            <SelectCustomQuery
              data={productsList.data?.products.filter(product => !productArray.some(p => p.id === product.id))}
              labelKey='name'
              label='Buscar por código'
              query={productsQueryTrigger}
              setQuery={handleSetProductsQuery}
              setValue={handleSetProductById}
              valueKey='id'
              infoKey='code'
            />
          </CLabel>
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CTable
            data={productArray}
            header={[
              { dataKey: 'name', label: 'Produto' },
              { dataKey: 'code', label: 'Código' },
              { dataKey: 'price', label: 'Preço' },
              { dataKey: 'profit', label: 'Lucro' },
              { dataKey: 'quantity', label: 'Quantidade' },
              { dataKey: 'id', label: 'Ações' },
            ]}
            formats={[
              {
                dataKey: 'name',
                format(data: string) {
                  return data.length > 60 ? data.slice(0, 60) + '...' : data
                },
              },
              {
                dataKey: 'quantity',
                format(data: number, rowIndex) {
                  return (
                    <SelectIntCustom
                      SelectConfig={{
                        options: quantityOptions,
                        nameKey: 'value',
                        optionValueKey: 'value',
                      }}
                      setCurrentSelected={(value) => handleSetProductQuantity(rowIndex, value)}
                      defaultValue={0}
                      selectedValue={data}
                    />
                  )
                },
              },
              {
                dataKey: 'profit',
                format(data: number) {
                  return FormatNumberMask(data)
                },
              },
              {
                dataKey: 'price',
                format(data: number) {
                  return FormatNumberMask(data)
                },
              },
              {
                dataKey: 'id',
                format() {
                  return <CrossIcon width={16} color='white-90' />
                },
              },
            ]}
            actions={[
              {
                action(data: number) {
                  handleRemoveProduct(data)
                },
                dataKey: 'id',
              },
            ]}
          />
        </FlexColumn>
      </FlexRow>

      <FormError isError={!!createOrder.error} message={createOrder.error?.message} />
      <FlexRow>
        {creatingOrder ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>Venda cadastrada com sucesso!</DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Venda</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
