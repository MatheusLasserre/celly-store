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

export const index: NextPage = () => {
  return (
    <ContentLayout>
      <Header />
      <CategoriesList />
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
        <HeadlineText>Adicionar categoria</HeadlineText>
        <SubHeadlineText>
          Adicione quantas categorias desejar.
        </SubHeadlineText>
      </FlexColumn>
      <FlexColumn width='300px'>
        <StateButton
          type='compact'
          onClick={() => {
            router.push('/admin/categorias/cadastrar')
          }}
        >
          Cadastrar Nova Categoria
        </StateButton>
      </FlexColumn>
    </FlexColumn>
  )
}

const CategoriesList: React.FC = () => {
  const categoriesList = api.categories.getAllCategories.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 4, // 1 minute
  })

  const router = useRouter()
  return (
    <FlexColumn>
      <FlexColumn>
        <HeadlineText>Suas categorias</HeadlineText>
        <FormError isError={!!categoriesList.error} message={categoriesList.error?.message} />
      </FlexColumn>
      {categoriesList.data ? (
        <CTable
          data={categoriesList.data}
          header={[
            { dataKey: 'name', label: 'Categoria' },
            { dataKey: 'description', label: 'Descrição' },
            { dataKey: 'productsCount', label: 'N° de produtos' },
            { dataKey: 'public', label: 'Pública' },
            { dataKey: 'id', label: 'Ações' },
          ]}
          actions={[
            {
              action(data: number) {
                router.push(`/admin/categorias/editar/${data}`)
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
              dataKey: 'public',
              format(data: boolean) {
                return data ? 'Sim' : 'Não'
              },
            }
          ]}
          updating={categoriesList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
