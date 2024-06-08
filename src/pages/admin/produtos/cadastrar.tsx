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
import { FlexColumn, FlexRow } from '~/components/utils/Utils'
import { api } from '~/utils/api'

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
        <HeadlineText>Cadastrar novo produtos</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar um novo produto.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  const router = useRouter()
  const [productInfo, setProductInfo] = React.useState({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    quantity: 0,
    code: '',
    categoryId: 0,
    available: false,
  })
  const [creatingProduct, setCreatingProduct] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createProduct = api.products.createProduct.useMutation({
    onSuccess: (data) => {
      utils.products.getAllProducts.invalidate()
    },
    onError: () => {
      setCreatingProduct(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!productInfo.name) return alert('Digite o nome do produto.')
    if (!productInfo.description) return alert('Digite a descrição.')
    if (!productInfo.price) return alert('Digite o preço.')
    if (!productInfo.cost) return alert('Digite o valor de compra.')
    if (!productInfo.quantity) return alert('Digite o estoque.')
    if (!productInfo.code) return alert('Digite o código.')
    if (!productInfo.categoryId) return alert('Selecione a categoria.')

    setCreatingProduct(true)
    await createProduct.mutateAsync({
      name: productInfo.name,
      description: productInfo.description,
      price: productInfo.price,
      cost: productInfo.cost,
      quantity: productInfo.quantity,
      code: productInfo.code,
      categoryId: productInfo.categoryId,
      available: productInfo.available,
    })
    setCreatingProduct(false)
    setSuccess(true)
    setProductInfo({
      name: '',
      description: '',
      price: 0,
      cost: 0,
      quantity: 0,
      code: '',
      categoryId: 0,
      available: false,
    })
    setTimeout(() => {
      setSuccess(false)
    }, 1500)
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
        minWidth: '340px',
        width: '100%',
        maxWidth: '500px',
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
      <FormError isError={!!createProduct.error} message={createProduct.error?.message} />
      <FlexRow>
        {creatingProduct ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>
            Produto cadastrado com sucesso!
          </DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Produto</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
