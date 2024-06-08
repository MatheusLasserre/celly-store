import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, StateButton } from '~/components/utils/Buttons'
import { SelectCustomQuery } from '~/components/utils/CustomInputs'
import { HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import { EditIcon } from '~/components/utils/Icons'
import { CCheckbox, CText, FormError } from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { CTable } from '~/components/utils/Table'
import { FlexColumn, FlexRow } from '~/components/utils/Utils'
import { api } from '~/utils/api'
import { FormatNumberMask } from '~/utils/formating/credentials'

export const index: NextPage = () => {
  return (
    <ContentLayout>
      <Header />
      <ProductsList />
    </ContentLayout>
  )
}

export default index

const Header: React.FC = () => {
  const router = useRouter()
  return (
    <FlexColumn margin='0 0 20px 0'>
      <FlexColumn>
        <BackButton />
        <HeadlineText>Adicionar produto</HeadlineText>
        <SubHeadlineText>Adicione quantos produtos desejar.</SubHeadlineText>
      </FlexColumn>
      <FlexColumn width='300px'>
        <StateButton
          type='compact'
          onClick={() => {
            router.push('/admin/produtos/cadastrar')
          }}
        >
          Cadastrar Novo Produto
        </StateButton>
      </FlexColumn>
    </FlexColumn>
  )
}

const ProductsList: React.FC = () => {
  const router = useRouter()
  const [query, setQuery] = React.useState('')
  const [queryTrigger, setQueryTrigger] = React.useState('')
  const productsList = api.products.getAllProductsSearch.useQuery(
    {
      query: queryTrigger,
      limit: router.query.limit ? Number(router.query.limit) : undefined,
      page: router.query.page ? Number(router.query.page) : undefined,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 4, // 1 minute
    },
  )
  const [timeouts, setTimeouts] = React.useState<NodeJS.Timeout[]>([])
  const handleSetQuery = (text: string) => {
    setQuery(text)
    timeouts.forEach((timeout) => clearTimeout(timeout))
    const timeOut = setTimeout(() => {
      setQueryTrigger(text)
    }, 300)
    setTimeouts([timeOut])
  }
  return (
    <FlexColumn>
      <FlexColumn>
        <FlexRow maxWidth='1280px' verticalAlign='center'>
          <HeadlineText>Seus produtos</HeadlineText>
          <CText
            value={query}
            onChange={(e) => handleSetQuery(e.currentTarget.value)}
            placeholder='Buscar por nome'
          />
        </FlexRow>
        <FormError isError={!!productsList.error} message={productsList.error?.message} />
      </FlexColumn>
      {productsList.data ? (
        <CTable
          nextPage={productsList.data.nextPage}
          data={productsList.data.products}
          header={[
            { dataKey: 'name', label: 'Produto' },
            { dataKey: 'description', label: 'Descrição' },
            { dataKey: 'categoryName', label: 'Categoria' },
            { dataKey: 'price', label: 'Valor Venda' },
            { dataKey: 'cost', label: 'Valor Compra' },
            { dataKey: 'profit', label: 'Lucro' },
            { dataKey: 'quantity', label: 'Estoque' },
            { dataKey: 'code', label: 'Código' },
            { dataKey: 'available', label: 'Disponível' },
            { dataKey: 'id', label: 'Ações' },
          ]}
          actions={[
            {
              action(data: number) {
                router.push(`/admin/produtos/editar/${data}`)
              },
              dataKey: 'id',
            },
          ]}
          linkColor='secondary-orange-300'
          formats={[
            {
              dataKey: 'id',
              format() {
                return <EditIcon width={16} color='white-90' />
              },
            },
            {
              dataKey: 'available',
              format(data: boolean) {
                return data ? 'Sim' : 'Não'
              },
            },
            {
              dataKey: 'cost',
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
              dataKey: 'profit',
              format(data: number) {
                return FormatNumberMask(data)
              },
            },
            {
              dataKey: 'description',
              format(data: string) {
                return data.length > 100 ? data.slice(0, 100) + '...' : data
              },
            },
            {
              dataKey: 'name',
              format(data: string) {
                return data.length > 90 ? data.slice(0, 90) + '...' : data
              },
            },
          ]}
          updating={productsList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
