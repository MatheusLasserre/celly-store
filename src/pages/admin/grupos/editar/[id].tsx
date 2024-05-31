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
import { formatPhone } from '~/utils/formating/credentials'

export const Editar: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  if (typeof id !== 'string' && typeof id !== 'undefined') {
    return <ErrorPage statusCode={404} />
  }

  const categoryInfo = api.groups.getGroupById.useQuery(
    { groupId: Number(id) },
    {
      enabled: typeof id === 'string',
      refetchOnWindowFocus: false,
    },
  )
  return (
    <ContentLayout>
      <Header />
      <LoadingWrapper loading={categoryInfo.isFetching || categoryInfo.isLoading}>
        {categoryInfo.data && (
          <Form
            description={categoryInfo.data.description}
            name={categoryInfo.data.name}
            phone={formatPhone(categoryInfo.data.phone)}
            groupId={categoryInfo.data.id}
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
        <HeadlineText>Editar Grupo</HeadlineText>
        <SubHeadlineText>
          Modifique as informações abaixo e clique em salvar para editar sua informações.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}
type FormProps = {
  groupId: number
  name: string
  description: string
  phone: string
}
const Form: React.FC<FormProps> = ({ groupId, description, name, phone }) => {
  const [groupInfo, setGroupInfo] = React.useState({
    name: name,
    description: description,
    groupId: groupId,
    phone: phone,
  })
  const [creatingCategory, setCreatingCategory] = React.useState(false)

  const utils = api.useUtils()
  const updategroup = api.groups.updateGroup.useMutation({
    onSuccess: () => {
      utils.groups.getAllGroups.invalidate()
      utils.groups.getGroupById.invalidate({ groupId: groupId })
    },
    onError: () => {
      setCreatingCategory(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!groupInfo.name) return alert('Nome da categoria não pode estar vazio.')
    if (!groupInfo.description) return alert('Descrição não pode estar vazia.')
    setCreatingCategory(true)
    await updategroup.mutateAsync({
      groupName: undefinedIfEqual(groupInfo.name, name),
      groupDescription: undefinedIfEqual(groupInfo.description, description),
      groupId: groupId,
      groupPhone: undefinedIfEqual(groupInfo.phone, phone),
    })
    setCreatingCategory(false)
  }

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
            label='Nome do cliente.'
            placeholder='Nome do cliente'
            value={groupInfo.name}
            onChange={(e) => setGroupInfo({ ...groupInfo, name: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Descrição'
            placeholder='Informação extra. Ex: tipos de produtos, etc.'
            value={groupInfo.description}
            onChange={(e) => setGroupInfo({ ...groupInfo, description: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>
      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Celular'
            placeholder='número de celular.'
            value={formatPhone(groupInfo.phone)}
            onChange={(e) => setGroupInfo({ ...groupInfo, phone: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>
      <FormError isError={updategroup.isError} message={updategroup.error?.message} />
      <FlexRow>
        {creatingCategory ? <LoadingZero /> : <FormButton type='submit'>Salvar</FormButton>}
      </FlexRow>
    </form>
  )
}
