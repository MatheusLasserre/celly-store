import { NextPage } from 'next'
import { useRouter } from 'next/router'
import React from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, FormButton } from '~/components/utils/Buttons'
import { SelectIntCustom } from '~/components/utils/CustomInputs'
import { DefaultText, HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import {
  CLabel,
  CLCurrencyInput,
  CLRadio,
  CLSelectString,
  CLText,
  FormError,
} from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { FlexColumn, FlexRow, LoadingWrapper } from '~/components/utils/Utils'
import { api } from '~/utils/api'
import ErrorPage from 'next/error'
import { undefinedIfEqual } from '~/utils/utils'

export const Editar: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  if (typeof id !== 'string' && typeof id !== 'undefined') {
    return <ErrorPage statusCode={404} />
  }

  const productInfo = api.products.getProductById.useQuery(
    { productId: Number(id) },
    {
      enabled: typeof id === 'string',
      refetchOnWindowFocus: false,
    },
  )
  return (
    <ContentLayout>
      <Header />
      <LoadingWrapper loading={productInfo.isFetching || productInfo.isLoading}>
        {productInfo.data && (
          <Form
            description={productInfo.data.description}
            categoryId={productInfo.data.id}
            name={productInfo.data.name}
            available={productInfo.data.available}
            code={productInfo.data.code}
            cost={productInfo.data.cost}
            price={productInfo.data.price}
            quantity={productInfo.data.quantity}
            productId={productInfo.data.id}
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
        <HeadlineText>Editar Produto</HeadlineText>
        <SubHeadlineText>
          Modifique as informações abaixo e clique em salvar para editar sua informações.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}
type FormProps = {
  productId: number
  name: string
  description: string
  price: number
  cost: number
  quantity: number
  code: string
  categoryId: number
  available: boolean
}
const Form: React.FC<FormProps> = ({
  productId,
  description,
  name,
  price,
  cost,
  quantity,
  code,
  categoryId,
  available,
}) => {
  const [productInfo, setProductInfo] = React.useState({
    name: name,
    description: description,
    price: price,
    cost: cost,
    quantity: quantity,
    code: code,
    categoryId: categoryId,
    available: available,
  })
  const [creatingProduct, setCreatingProduct] = React.useState(false)

  const utils = api.useUtils()
  const updateProduct = api.products.updateProduct.useMutation({
    onSuccess: () => {
      utils.products.getAllProducts.invalidate()
      utils.products.getProductById.invalidate({ productId: categoryId })
    },
    onError: () => {
      setCreatingProduct(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!productInfo.name) return alert('Nome da categoria não pode estar vazio.')
    if (!productInfo.description) return alert('Descrição não pode estar vazia.')
    setCreatingProduct(true)
    await updateProduct.mutateAsync({
      name: undefinedIfEqual(productInfo.name, name),
      description: undefinedIfEqual(productInfo.description, description),
      price: undefinedIfEqual(productInfo.price, price),
      cost: undefinedIfEqual(productInfo.cost, cost),
      quantity: undefinedIfEqual(productInfo.quantity, quantity),
      code: undefinedIfEqual(productInfo.code, code),
      categoryId: categoryId,
      available: undefinedIfEqual(productInfo.available, available),
      id: productId,
    })
    setCreatingProduct(false)
  }

  const categories = api.categories.getAllCategories.useQuery(undefined, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  })
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
      }}
    >
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Nome do produto.'
            placeholder='Nome do produto.'
            value={productInfo.name}
            onChange={(e) => setProductInfo({ ...productInfo, name: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Descrição'
            placeholder='Informação extra. Ex: tipos de produtos, etc.'
            value={productInfo.description}
            onChange={(e) => setProductInfo({ ...productInfo, description: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLCurrencyInput
            label='Valor de compra'
            placeholder='Custo do produto.'
            currencyValue={productInfo.cost}
            setCurrencyValue={(value) => setProductInfo({ ...productInfo, cost: value })}
          />
        </FlexColumn>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLCurrencyInput
            label='Valor de venda'
            placeholder='Valor de venda do produto.'
            currencyValue={productInfo.price}
            setCurrencyValue={(value) => setProductInfo({ ...productInfo, price: value })}
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Estoque'>
            <SelectIntCustom
              SelectConfig={{
                options: quantityOptions,
                nameKey: 'value',
                optionValueKey: 'value',
              }}
              setCurrentSelected={(value) => setProductInfo({ ...productInfo, quantity: value })}
              selectedValue={productInfo.quantity}
            />
          </CLabel>
        </FlexColumn>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          {categories.data && (
            <CLabel label='Categoria'>
              <SelectIntCustom
                SelectConfig={{
                  options: categories.data,
                  nameKey: 'name',
                  optionValueKey: 'id',
                }}
                setCurrentSelected={(value) =>
                  setProductInfo({ ...productInfo, categoryId: value })
                }
                selectedValue={productInfo.categoryId}
              />
            </CLabel>
          )}
        </FlexColumn>
      </FlexRow>
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLText
            label='Código'
            placeholder='Código do produto.'
            value={productInfo.code}
            onChange={(e) => setProductInfo({ ...productInfo, code: e.target.value })}
            required
          />
        </FlexColumn>
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Deseja tornar esse produto disponível?'>
            <FlexRow verticalAlign='center' horizontalAlign='center' height='50px' width='180px'>
              <CLRadio
                label='Sim'
                selected={productInfo.available}
                setSelected={() => setProductInfo({ ...productInfo, available: true })}
              />
              <CLRadio
                label='Não'
                selected={!productInfo.available}
                setSelected={() => setProductInfo({ ...productInfo, available: false })}
              />
            </FlexRow>
          </CLabel>
        </FlexColumn>
      </FlexRow>
      <FormError isError={updateProduct.isError} message={updateProduct.error?.message} />
      <FlexRow>
        {creatingProduct ? <LoadingZero /> : <FormButton type='submit'>Salvar</FormButton>}
      </FlexRow>
    </form>
  )
}
