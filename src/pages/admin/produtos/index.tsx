import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { ContentLayout } from '~/components/layouts/Layouts'
import { BackButton, StateButton } from '~/components/utils/Buttons'
import { HeadlineText, SubHeadlineText } from '~/components/utils/Headers'
import { EditIcon } from '~/components/utils/Icons'
import { CCheckbox, FormError } from '~/components/utils/Inputs'
import { LoadingZero } from '~/components/utils/Loading'
import { CTable } from '~/components/utils/Table'
import { FlexColumn } from '~/components/utils/Utils'
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
  const productsList = api.products.getAllProducts.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 4, // 1 minute
  })

  const router = useRouter()
  return (
    <FlexColumn>
      <FlexColumn>
        <HeadlineText>Seus produtos</HeadlineText>
        <FormError isError={!!productsList.error} message={productsList.error?.message} />
      </FlexColumn>
      {productsList.data ? (
        <CTable
          data={productsList.data}
          header={[
            { dataKey: 'name', label: 'Produto' },
            { dataKey: 'description', label: 'Descrição' },
            { dataKey: 'categoryName', label: 'Categoria' },
            { dataKey: 'price', label: 'V. Venda' },
            { dataKey: 'cost', label: 'V. Compra' },
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
