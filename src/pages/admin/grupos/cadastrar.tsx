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
import { formatPhone } from '~/utils/formating/credentials'

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
        <HeadlineText>Cadastrar novo cliente</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar um novo cliente. Grupos serão utilizados
          apenas para organização interna das vendas e relatórios.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  const router = useRouter()
  const [groupInfo, setGroupInfo] = React.useState({
    groupName: '',
    description: '',
    phone: '',
  })
  const [creatingGroup, setCreatingGroup] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createGroup = api.groups.createGroup.useMutation({
    onSuccess: (data) => {
      utils.groups.getAllGroups.invalidate()
    },
    onError: () => {
      setCreatingGroup(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!groupInfo.groupName) return alert('Digite o nome do cliente.')
    setCreatingGroup(true)
    await createGroup.mutateAsync({
      name: groupInfo.groupName,
      description: groupInfo.description,
      phone: groupInfo.phone,
    })
    setCreatingGroup(false)
    setSuccess(true)
    setGroupInfo({
      groupName: '',
      description: '',
      phone: '',
    })
    setTimeout(() => {
      setSuccess(false)
    }, 1500)
  }

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
            label='Nome do cliente.'
            placeholder='Nome do cliente.'
            value={groupInfo.groupName}
            onChange={(e) => setGroupInfo({ ...groupInfo, groupName: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Descrição'
            placeholder='Informação extra. Ex: Quais pessoas ou locais envolvem o cliente?'
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
            
          />
        </FlexColumn>
      </FlexRow>
      <FormError isError={!!createGroup.error} message={createGroup.error?.message} />
      <FlexRow>
        {creatingGroup ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>
            Cliente cadastrado com sucesso!
          </DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Cliente</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
