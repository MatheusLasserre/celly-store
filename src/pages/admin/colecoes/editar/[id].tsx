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

export const Editar: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  if (typeof id !== 'string' && typeof id !== 'undefined') {
    return <ErrorPage statusCode={404} />
  }

  const categoryInfo = api.collections.getCollectionById.useQuery(
    { collectionId: Number(id) },
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
            collectionId={categoryInfo.data.id}
            name={categoryInfo.data.name}
            publicCheckbox={categoryInfo.data.public}
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
        <HeadlineText>Editar Coleção</HeadlineText>
        <SubHeadlineText>
          Modifique as informações abaixo e clique em salvar para editar sua informações.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}
type FormProps = {
  collectionId: number
  name: string
  description: string
  publicCheckbox: boolean
}
const Form: React.FC<FormProps> = ({ collectionId, description, name, publicCheckbox }) => {
  const [collectionInfo, setCollectionInfo] = React.useState({
    name: name,
    description: description,
    collectionId: collectionId,
    public: publicCheckbox,
  })
  const [updatingCollection, setUpdatingCollection] = React.useState(false)

  const utils = api.useUtils()
  const updateCollection = api.collections.updateCollection.useMutation({
    onSuccess: () => {
      utils.collections.getAllCollections.invalidate()
      utils.collections.getCollectionById.invalidate({ collectionId: collectionId })
    },
    onError: () => {
      setUpdatingCollection(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!collectionInfo.name) return alert('Nome da coleção não pode estar vazio.')
    if (!collectionInfo.description) return alert('Descrição não pode estar vazia.')
    setUpdatingCollection(true)
    await updateCollection.mutateAsync({
      name: undefinedIfEqual(collectionInfo.name, name),
      description: undefinedIfEqual(collectionInfo.description, description),
      id: collectionId,
      public: undefinedIfEqual(collectionInfo.public, publicCheckbox),
    })
    setUpdatingCollection(false)
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
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLText
            label='Nome da coleção.'
            placeholder='Nome da coleção.'
            value={collectionInfo.name}
            onChange={(e) => setCollectionInfo({ ...collectionInfo, name: e.target.value })}
            required
          />
        </FlexColumn>

        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Deseja tornar essa coleção pública?'>
            <FlexRow verticalAlign='center' horizontalAlign='center' height='50px' width='180px'>
              <CLRadio
                label='Sim'
                selected={collectionInfo.public ? true : false}
                setSelected={() => setCollectionInfo({ ...collectionInfo, public: true })}
              />
              <CLRadio
                label='Não'
                selected={collectionInfo.public ? false : true}
                setSelected={() => setCollectionInfo({ ...collectionInfo, public: false })}
              />
            </FlexRow>
          </CLabel>
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
      <FormError isError={updateCollection.isError} message={updateCollection.error?.message} />
      <FlexRow>
        {updatingCollection ? <LoadingZero /> : <FormButton type='submit'>Salvar</FormButton>}
      </FlexRow>
    </form>
  )
}
