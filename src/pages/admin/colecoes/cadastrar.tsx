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
        <HeadlineText>Cadastrar nova coleção</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar uma nova categoria. A diferença entre
          categoria e coleção, é que a coleção foi criada para organizar produtos, enquanto a
          categoria é uma categoria de produtos. Ex: coleção de verão, inverno, etc.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  const router = useRouter()
  const [collectionInfo, setCollectionInfo] = React.useState({
    collectionName: '',
    description: '',
  })
  const [creatingCollection, setCreatingCollection] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createCollection = api.collections.createCollection.useMutation({
    onSuccess: () => {
      utils.collections.getAllCollections.invalidate()
    },
    onError: () => {
      setCreatingCollection(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!collectionInfo.collectionName) return alert('Digite o nome da coleção.')
    if (!collectionInfo.description) return alert('Digite a descrição.')
    setCreatingCollection(true)
    await createCollection.mutateAsync({
      name: collectionInfo.collectionName,
      description: collectionInfo.description,
    })
    setCreatingCollection(false)
    setSuccess(true)
    setCollectionInfo({
      collectionName:'',
      description:'',
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
            label='Nome da coleção.'
            placeholder='Nome da coleção.'
            value={collectionInfo.collectionName}
            onChange={(e) =>
              setCollectionInfo({ ...collectionInfo, collectionName: e.target.value })
            }
            required
          />
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Descrição'
            placeholder='Descrição da coleção.'
            value={collectionInfo.description}
            onChange={(e) => setCollectionInfo({ ...collectionInfo, description: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>
      <FormError isError={!!createCollection.error} message={createCollection.error?.message} />
      <FlexRow>
        {creatingCollection ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>
            Coleção cadastrada com sucesso!
          </DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Coleção</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
