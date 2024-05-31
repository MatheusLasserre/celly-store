import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import {
  CardStyle,
  FlexColumn,
  FlexItem,
  FlexRow,
  IconNormalizer,
  LoadingWrapper,
} from '~/components/utils/Utils'
import Style from './Index.module.css'
import { BoldText, CommonText, HighLightText } from '~/components/utils/Headers'
import { api } from '~/utils/api'
import { getSession } from '~/utils/auth/client'
import { ContentLayout } from '~/components/layouts/Layouts'
import { CartIcon2, HomeIcon, ImageIcon, UserIcon } from '~/components/utils/Icons'
import { FormatNumberMask } from '~/utils/formating/credentials'
import { clx } from '~/utils/style'

const Index: NextPage = () => {

  return (
    <ContentLayout>
      <FlexColumn gap='20px' maxWidth='1020px' margin='0'>
        <FlexRow margin='auto auto 20px auto'>
          <CustomerHeader />
        </FlexRow>
        {/* <FlexRow
          verticalAlign='stretch'
          horizontalAlign='space-between'
          flexWrap='wrap'
          flexColumnWidthThreshold={600}
          columnHorizontalAlign='center'
          columnVerticalAlign='flex-start'
          gap='20px'
          width='100%'
        >
          <Cards />
          <Gambles />
        </FlexRow> */}
      </FlexColumn>
    </ContentLayout>
  )
}

export default Index

export const CustomerHeader: React.FC = () => {
  const userData = getSession()

  return (
    <FlexColumn horizontalAlign='flex-start'>
      <FlexItem>
        <CommonText textAlign='left' fontSize='18px' letterSpacing='initial' color='white-80'>
          Bem vindo, <HighLightText fontSize='18px' color='white-80' letterSpacing='initial'>{userData?.data?.user?.name}.</HighLightText>
        </CommonText>
      </FlexItem>
      <FlexItem>
        <CommonText textAlign='left' fontSize='16px' letterSpacing='initial' color='white-80'>
          Abaixo está um sumário de suas últimas atividades.
        </CommonText>
      </FlexItem>
    </FlexColumn>
  )
}

const Cards: React.FC = () => {
  return (
    <CardStyle style={{ width: '100%', padding: '18px 24px', maxWidth: '360px' }}>
      <FlexColumn gap='21px' width='100%'>
        <CommonText
          textAlign='left'
          fontSize='18px'
          lineHeight='17px'
          fontWeight='500'
          color='white-90'
        >
          L&P Mensal - R$2377
        </CommonText>
        <FlexColumn padding='0px 0px' gap='4px' width='100%'>
          <BoxRow label='Sporting Bet' value={1225} />
          <BoxRow label='Betano' value={720} />
          <BoxRow label='bet365' value={432} />
        </FlexColumn>
      </FlexColumn>
    </CardStyle>
  )
}
type BoxRowProps = {
  label: string
  value: number
}
const BoxRow: React.FC<BoxRowProps> = ({ label, value }) => {
  return (
    <FlexRow
      padding='9px 10px'
      horizontalAlign='space-between'
      width='100%'
      className={clx(Style.CartCards)}
    >
      <FlexRow horizontalAlign='flex-start' verticalAlign='center' gap='7px' width='100%'>
        <IconNormalizer width='16px' color='white-70'>
          <HomeIcon width={20} />
        </IconNormalizer>
        <CommonText
          fontSize='14px'
          lineHeight='14px'
          fontWeight='400'
          textAlign='left'
          color='white-70'
          width='fit-content'
        >
          {label}
        </CommonText>
      </FlexRow>
      <CommonText
        fontSize='14px'
        lineHeight='14px'
        fontWeight='400'
        textAlign='left'
        color='white-70'
        width='120px'
      >
        R$ {FormatNumberMask(value)}
      </CommonText>
    </FlexRow>
  )
}

const Gambles: React.FC = () => {
  return (
    <CardStyle style={{ width: '100%', padding: '18px 24px', maxWidth: '480px' }}>
      <FlexColumn gap='21px' width='100%'>
        <CommonText
          textAlign='left'
          fontSize='18px'
          lineHeight='17px'
          fontWeight='500'
          color='white-90'
        >
          Últimas apostas
        </CommonText>
        <FlexColumn padding='0px 0px' gap='4px' width='100%'>
          <BoxRowMulti label='Betano' category='Esportiva' value={720} dateString='15/05/24' />
          <BoxRowMulti
            label='Sporting Bet'
            category='Esportiva'
            value={1225}
            dateString='14/05/24'
          />
          <BoxRowMulti label='bet365' category='Esportiva' value={432} dateString='13/05/24' />
        </FlexColumn>
      </FlexColumn>
    </CardStyle>
  )
}

type BoxRowMultiProps = {
  label: string
  dateString: string
  category: string
  value: number
}
const BoxRowMulti: React.FC<BoxRowMultiProps> = ({ label, value, category, dateString }) => {
  return (
    <FlexRow
      padding='9px 10px'
      horizontalAlign='space-between'
      width='100%'
      className={clx(Style.CartCards)}
    >
      <FlexRow horizontalAlign='flex-start' verticalAlign='center' gap='7px' width='100%'>
        <CommonText
          fontSize='14px'
          lineHeight='14px'
          fontWeight='400'
          textAlign='left'
          color='neutral-300'
          width='100px'
          
        >
          {label}
        </CommonText>
        <CommonText
          fontSize='14px'
          lineHeight='14px'
          fontWeight='400'
          textAlign='left'
          color='neutral-300'
          width='90px'
        >
          {dateString}
        </CommonText>
        <CommonText
          fontSize='14px'
          lineHeight='14px'
          fontWeight='400'
          textAlign='left'
          color='neutral-300'
          width='fit-content'
        >
          {category}
        </CommonText>
      </FlexRow>
      <CommonText
        fontSize='14px'
        lineHeight='14px'
        fontWeight='400'
        textAlign='left'
        color='neutral-300'
        width='120px'
      >
        R$ {FormatNumberMask(value)}
      </CommonText>
    </FlexRow>
  )
}
