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
import { formatPhone } from '~/utils/formating/credentials'

export const index: NextPage = () => {
  return (
    <ContentLayout>
      <Header />
      <GroupsList />
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
        <HeadlineText>Adicionar Clientes</HeadlineText>
        <SubHeadlineText>Adicione quantos clientes desejar.</SubHeadlineText>
      </FlexColumn>
      <FlexColumn width='300px'>
        <StateButton
          type='compact'
          onClick={() => {
            router.push('/admin/grupos/cadastrar')
          }}
        >
          Cadastrar Novo cliente
        </StateButton>
      </FlexColumn>
    </FlexColumn>
  )
}

const GroupsList: React.FC = () => {
  const groupsList = api.groups.getAllGroups.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 4, // 1 minute
  })

  const router = useRouter()
  return (
    <FlexColumn>
      <FlexColumn>
        <HeadlineText>Seus clientes</HeadlineText>
        <FormError isError={!!groupsList.error} message={groupsList.error?.message} />
      </FlexColumn>
      {groupsList.data ? (
        <CTable
          data={groupsList.data}
          header={[
            { dataKey: 'name', label: 'Grupo' },
            { dataKey: 'description', label: 'Descrição' },
            { dataKey: 'phone', label: 'Número' },
            { dataKey: 'orders', label: 'N° de vendas' },
            { dataKey: 'id', label: 'Ações' },
          ]}
          actions={[
            {
              action(data: number) {
                router.push(`/admin/grupos/editar/${data}`)
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
              dataKey: 'phone',
              format(data: string) {
                return formatPhone(data)
              },
            },
          ]}
          updating={groupsList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
