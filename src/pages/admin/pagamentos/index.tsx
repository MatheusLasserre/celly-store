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
import { FormatNumberMask, formatPhone } from '~/utils/formating/credentials'

export const index: NextPage = () => {
  return (
    <ContentLayout>
      <Header />
      <PaymentsList />
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
        <HeadlineText>Adicionar Método de pagamento</HeadlineText>
        <SubHeadlineText>Adicione quantos métodos de pagamento desejar.</SubHeadlineText>
      </FlexColumn>
      <FlexColumn width='300px'>
        <StateButton
          type='compact'
          onClick={() => {
            router.push('/admin/pagamentos/cadastrar')
          }}
        >
          Cadastrar Novo método de pagamento
        </StateButton>
      </FlexColumn>
    </FlexColumn>
  )
}

const PaymentsList: React.FC = () => {
  const paymentsList = api.payments.getAllPayments.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 4, // 1 minute
  })

  const router = useRouter()
  return (
    <FlexColumn>
      <FlexColumn>
        <HeadlineText>Seus métodos de pagamento</HeadlineText>
        <FormError isError={!!paymentsList.error} message={paymentsList.error?.message} />
      </FlexColumn>
      {paymentsList.data ? (
        <CTable
          data={paymentsList.data}
          header={[
            { dataKey: 'name', label: 'Grupo' },
            { dataKey: 'value', label: 'Taxa' },
            { dataKey: 'orders', label: 'N° de vendas' },
            { dataKey: 'id', label: 'Ações' },
          ]}
          actions={[
            {
              action(data: number) {
                router.push(`/admin/pagamentos/editar/${data}`)
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
              dataKey: 'value',
              format(data: number) {
                return FormatNumberMask(data, 'R$')
              },
            }
          ]}
          updating={paymentsList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
