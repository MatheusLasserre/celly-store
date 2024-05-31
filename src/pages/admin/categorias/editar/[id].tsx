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

  const categoryInfo = api.categories.getCategoryById.useQuery(
    { categoryId: Number(id) },
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
            categoryId={categoryInfo.data.id}
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
        <HeadlineText>Editar Categoria</HeadlineText>
        <SubHeadlineText>
          Modifique as informações abaixo e clique em salvar para editar sua informações.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}
type FormProps = {
  categoryId: number
  name: string
  description: string
  publicCheckbox: boolean
}
const Form: React.FC<FormProps> = ({ categoryId, description, name, publicCheckbox }) => {
  const [categoryInfo, setCategoryInfo] = React.useState({
    name: name,
    description: description,
    categoryId: categoryId,
    public: publicCheckbox,
  })
  const [creatingCategory, setCreatingCategory] = React.useState(false)

  const utils = api.useUtils()
  const updateCategory = api.categories.updateCategory.useMutation({
    onSuccess: () => {
      utils.categories.getAllCategories.invalidate()
      utils.categories.getCategoryById.invalidate({ categoryId: categoryId })
    },
    onError: () => {
      setCreatingCategory(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!categoryInfo.name) return alert('Nome da categoria não pode estar vazio.')
    if (!categoryInfo.description) return alert('Descrição não pode estar vazia.')
    setCreatingCategory(true)
    await updateCategory.mutateAsync({
      categoryName: undefinedIfEqual(categoryInfo.name, name),
      categoryDescription: undefinedIfEqual(categoryInfo.description, description),
      categoryId: categoryId,
      public: undefinedIfEqual(categoryInfo.public, publicCheckbox),
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
        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLText
            label='Nome da categoria.'
            placeholder='Nome da categoria.'
            value={categoryInfo.name}
            onChange={(e) => setCategoryInfo({ ...categoryInfo, name: e.target.value })}
            required
          />
        </FlexColumn>

        <FlexColumn width='50%' verticalAlign='flex-start'>
          <CLabel label='Deseja tornar essa categoria pública?'>
            <FlexRow verticalAlign='center' horizontalAlign='center' height='50px' width='180px'>
              <CLRadio
                label='Sim'
                selected={categoryInfo.public}
                setSelected={() => setCategoryInfo({ ...categoryInfo, public: true })}
              />
              <CLRadio
                label='Não'
                selected={!categoryInfo.public}
                setSelected={() => setCategoryInfo({ ...categoryInfo, public: false })}
              />
            </FlexRow>
          </CLabel>
        </FlexColumn>
      </FlexRow>

      <FlexRow gap='20px' verticalAlign='flex-start'>
        <FlexColumn width='100%' verticalAlign='flex-start'>
          <CLText
            label='Descrição'
            placeholder='Informação extra. Ex: tipos de produtos, etc.'
            value={categoryInfo.description}
            onChange={(e) => setCategoryInfo({ ...categoryInfo, description: e.target.value })}
            required
          />
        </FlexColumn>
      </FlexRow>
      <FormError isError={updateCategory.isError} message={updateCategory.error?.message} />
      <FlexRow>
        {creatingCategory ? <LoadingZero /> : <FormButton type='submit'>Salvar</FormButton>}
      </FlexRow>
    </form>
  )
}
