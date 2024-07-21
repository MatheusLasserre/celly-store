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
      <OrdersList />
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
        <HeadlineText>Gerar Relatório</HeadlineText>
        <SubHeadlineText>
          Gere quantos relatórios quiser baseado nos filtros disponíveis.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const OrdersList: React.FC = () => {
  const router = useRouter()
  const [fromDate, setFromDate] = React.useState<Date>(new Date())
  const [toDate, setToDate] = React.useState<Date>(new Date())
  const [selectedPaymentMethods, setSelectedPaymentMethods] = React.useState<number[]>([])
  const [selectedGroups, setSelectedGroups] = React.useState<number[]>([])
  const ordersList = api.reports.getReports.useQuery(
    {
      from: fromDate,
      to: toDate,
      paymentMethodsIds: selectedPaymentMethods.length > 0 ? selectedPaymentMethods : undefined,
      groupIds: selectedGroups.length > 0 ? selectedGroups : undefined,
      limit: router.query.limit ? Number(router.query.limit) : undefined,
      page: router.query.page ? Number(router.query.page) : undefined,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 4, // 1 minute
    },
  )
  const [timeouts, setTimeouts] = React.useState<NodeJS.Timeout[]>([])
  const [query, setQuery] = React.useState('')
  const [queryTrigger, setQueryTrigger] = React.useState('')
  const handleSetQuery = (text: string) => {
    setQueryTrigger(text)
    timeouts.forEach((timeout) => clearTimeout(timeout))
    const timeOut = setTimeout(() => {
      setQuery(text)
    }, 300)
    setTimeouts([timeOut])
  }
  const groupList = api.groups.getAllGroupsDrySearch.useQuery(
    {
      query: query,
    },
    {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  )
  const handleToggleGroup = (groupId: number) => {
    const group = groupList.data?.find((group) => group.id === groupId)
    if (!group) return
    setSelectedGroups(
      selectedGroups.includes(groupId)
        ? selectedGroups.filter((id) => id !== groupId)
        : [...selectedGroups, groupId],
    )
  }

  const paymentMethodList = api.payments.getAllPayments.useQuery(undefined, {
    refetchOnWindowFocus: false,
  })
  const handleTogglePaymentMethod = (paymentMethodId: number) => {
    const paymentMethod = paymentMethodList.data?.find(
      (paymentMethod) => paymentMethod.id === paymentMethodId,
    )
    if (!paymentMethod) return
    setSelectedPaymentMethods(
      selectedPaymentMethods.includes(paymentMethodId)
        ? selectedPaymentMethods.filter((id) => id !== paymentMethodId)
        : [...selectedPaymentMethods, paymentMethodId],
    )
  }

  return (
    <FlexColumn>
      <FlexColumn>
        <FlexRow maxWidth='1280px' verticalAlign='center'>
          <HeadlineText>Seus Lançamentos</HeadlineText>
          <SelectCustomQuery
            data={groupList.data}
            label='Filtrar por cliente'
            query={queryTrigger}
            setQuery={handleSetQuery}
            labelKey='name'
            valueKey='id'
            setValue={handleToggleGroup}
          />
        </FlexRow>

        <FormError isError={!!ordersList.error} message={ordersList.error?.message} />
      </FlexColumn>
      {ordersList.data ? (
        <CTable
          nextPage={ordersList.data.nextPage}
          data={ordersList.data.orders}
          header={[
            { dataKey: 'groupName', label: 'Cliente' },
            { dataKey: 'paymentMethod', label: 'Forma de Pagamento' },
            { dataKey: 'paid', label: 'Pagamento' },
            { dataKey: 'productsCount', label: 'N° de produtos' },
            { dataKey: 'total', label: 'Valor Bruto' },
            { dataKey: 'profit', label: 'Lucro' },
            { dataKey: 'createdAt', label: 'Data' },
            { dataKey: 'id', label: 'Ações' },
          ]}
          actions={[
            {
              action(data: number) {
                router.push(`/admin/vendas/editar/${data}`)
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
              format(data: number) {
                return FormatNumberMask(data)
              },
              dataKey: 'profit',
            },
            {
              format(data: number) {
                return FormatNumberMask(data)
              },
              dataKey: 'total',
            },
            {
              format(data: boolean) {
                return data ? 'Pago' : 'Pendente'
              },
              dataKey: 'paid',
            },
            {
              format(data: Date) {
                return data.toLocaleDateString('pt-BR')
              },
              dataKey: 'createdAt',
            },
            {
              dataKey: 'groupName',
              format(data: string) {
                return data.length > 90 ? data.slice(0, 90) + '...' : data
              },
            },
          ]}
          updating={ordersList.isFetching}
          color='white-90'
          maxWidth='1280px'
        />
      ) : (
        <LoadingZero />
      )}
    </FlexColumn>
  )
}
