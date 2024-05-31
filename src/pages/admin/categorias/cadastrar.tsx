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
        <HeadlineText>Cadastrar nova categoria</HeadlineText>
        <SubHeadlineText>
          Preencha as informações abaixo para adicionar uma nova categoria. Categorias serão
          exibidas na página inicial do website como um dos filtros na busca por produtos, bem como
          poderão ser usadas para filtrar os produtos.
        </SubHeadlineText>
      </FlexColumn>
    </FlexColumn>
  )
}

const Form: React.FC = () => {
  const router = useRouter()
  const [categoryInfo, setCategoryInfo] = React.useState({
    categoryName: '',
    description: '',
  })
  const [creatingCategory, setCreatingCategory] = React.useState(false)
  const [success, setSuccess] = React.useState(false)

  const utils = api.useUtils()
  const createCategory = api.categories.createCategory.useMutation({
    onSuccess: (data) => {
      utils.categories.getAllCategories.invalidate()
    },
    onError: () => {
      setCreatingCategory(false)
    },
  })
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!categoryInfo.categoryName) return alert('Digite o nome da categoria.')
    if (!categoryInfo.description) return alert('Digite a descrição.')
    setCreatingCategory(true)
    await createCategory.mutateAsync({
      name: categoryInfo.categoryName,
      description: categoryInfo.description,
    })
    setCreatingCategory(false)
    setSuccess(true)
    setTimeout(() => {
      router.push('/admin/categorias')
    }, 3000)
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
            label='Nome da categoria.'
            placeholder='Nome da categoria.'
            value={categoryInfo.categoryName}
            onChange={(e) => setCategoryInfo({ ...categoryInfo, categoryName: e.target.value })}
            required
          />
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
      <FormError isError={!!createCategory.error} message={createCategory.error?.message} />
      <FlexRow>
        {creatingCategory ? (
          <LoadingZero />
        ) : success ? (
          <DefaultText color='primary-500'>
            Categoria cadastrada com sucesso! Redirecionando...
          </DefaultText>
        ) : (
          <FormButton type='submit'>Cadastrar Categoria</FormButton>
        )}
      </FlexRow>
    </form>
  )
}
