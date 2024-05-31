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
      <CollectionList />
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
        <HeadlineText>Adicionar coleção</HeadlineText>
        <SubHeadlineText>
          Adicione quantas coleções desejar.
        </SubHeadlineText>
      </FlexColumn>
      <FlexColumn width='300px'>
        <StateButton
          type='compact'
          onClick={() => {
            router.push('/admin/colecoes/cadastrar')
          }}
        >
          Cadastrar Nova Coleção
        </StateButton>
      </FlexColumn>
    </FlexColumn>
  )
}

const CollectionList: React.FC = () => {
  const collectionList = api.collections.getAllCollections.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 4, // 1 minute
  })

  const router = useRouter()
  return (
    <FlexColumn>
      <FlexColumn>
        <HeadlineText>Suas Coleções</HeadlineText>
        <FormError isError={!!collectionList.error} message={collectionList.error?.message} />
      </FlexColumn>
      {collectionList.data ? (
        <CTable
          data={collectionList.data}
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
                router.push(`/admin/colecoes/editar/${data}`)
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
          updating={collectionList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
