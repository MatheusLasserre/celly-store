import React from 'react'
import Style from './Sidebar.module.css'
import Link from 'next/link'
import useTarget from '~/hooks/useTarget'
import { useRouter } from 'next/router'
import { destroyCookie } from 'nookies'
import { api } from '~/utils/api'
import Image from 'next/image'
import placeholder from 'public/assets/profile-placeholder.png'
import { BoldText, CommonText, HighLightText } from '../utils/Headers'
import { FlexColumn, FlexRow, HideComponent, IconNormalizer, Spacer } from '../utils/Utils'
import { clx } from '~/utils/style'
import {
  AngleUpIcon,
  CardIcon,
  ChatIcon,
  DataIcon,
  HomeIcon,
  ReceiptIcon,
  ReceiptIcon2,
  SettingsIcon,
} from '../utils/Icons'
import { getSession } from '~/utils/auth/client'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { BG_COLORS, CSS_VARS, FONT_COLORS } from '../utils/colors'
import { deleteUserCookies } from '~/utils/security/cookies'

export const SidebarDesktop: React.FC = () => {
  return (
    <div className={Style.sidebarContainerWrapper}>
      <SidebarDesktopContent></SidebarDesktopContent>
    </div>
  )
}

const SidebarDesktopContent: React.FC = () => {
  const router = useRouter()
  const user = getSession()
  const basePath = '/admin'

  const handleLogout = () => {
    deleteUserCookies()
    setTimeout(() => {
      router.reload()
    }, 100)
  }

  return (
    <FlexColumn
      horizontalAlign='center'
      //   verticalAlign='center'
      gap='20px'
      padding='16px 0px 40px 0px'
      verticalAlign='space-between'
      height='100vh'
    >
      <FlexColumn horizontalAlign='center' gap='8px'>
        <FlexColumn padding='0 16px 0 16px' horizontalAlign='center'>
          <CommonText
            textAlign='center'
            fontFamily='Jomhuria'
            fontSize='46px'
            lineHeight='46px'
            color='primary-400'
            marginBottom='20px'
            marginTop='6px'
          >
            CellyStore
          </CommonText>
        </FlexColumn>

        <LinkSingle label='Dashboard' href='/admin' active={router.pathname === '/admin'} />

        <LinkGroup
          label='Configurações'
          includedPaths={[
            `${basePath}/categorias`,
            `${basePath}/colecoes`,
            `${basePath}/grupos`,
            `${basePath}/produtos`,
            `${basePath}/pagamentos`,
          ]}
        >
          <MenuLink
            href={`${basePath}/categorias`}
            label='Categorias'
            icon={<HomeIcon />}
            active={router.pathname.includes(`${basePath}/categorias`)}
          />
          <MenuLink
            href={`${basePath}/colecoes`}
            label='Coleções'
            icon={<ChatIcon />}
            active={router.pathname.includes(`${basePath}/colecoes`)}
          />

          <MenuLink
            href={`${basePath}/grupos`}
            label='Clientes'
            icon={<CardIcon />}
            active={router.pathname.includes(`${basePath}/grupos`)}
          />

          <MenuLink
            href={`${basePath}/produtos`}
            label='Produtos'
            icon={<CardIcon />}
            active={router.pathname.includes(`${basePath}/produtos`)}
          />

          <MenuLink
            href={`${basePath}/pagamentos`}
            label='Pagamentos'
            icon={<CardIcon />}
            active={router.pathname.includes(`${basePath}/pagamentos`)}
          />
        </LinkGroup>

        <LinkGroup
          label='Lançamentos'
          includedPaths={[`${basePath}/vendas`, `${basePath}/relatorios`]}
        >
          <MenuLink
            href={`${basePath}/vendas`}
            label='Vendas'
            icon={<HomeIcon />}
            active={router.pathname === `${basePath}/vendas`}
          />
          <MenuLink
            href={`${basePath}/relatorios`}
            label='Relatórios'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/relatorios`)}
          />
        </LinkGroup>

        {/* <LinkGroup
          label='Ferramentas'
          includedPaths={[`${basePath}/geracao-guia`, `${basePath}/demonstrativo-imposto-renda`]}
        >
          <MenuLink
            href={`${basePath}/geracao-guia`}
            label='Geração de Guia'
            icon={<HomeIcon />}
            active={router.pathname.includes(`${basePath}/geracao-guia`)}
          />
          <MenuLink
            href={`${basePath}/demonstrativo-imposto-renda`}
            label='Dem. Imp. de Renda'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/demonstrativo-imposto-renda`)}
          />
        </LinkGroup>

        <LinkGroup
          label='Dados Pessoais'
          includedPaths={[`${basePath}/perfil`, `${basePath}/seguranca`]}
        >
          <MenuLink
            href={`${basePath}/perfil`}
            label='Perfil'
            icon={<HomeIcon />}
            active={router.pathname.includes(`${basePath}/perfil`)}
          />
          <MenuLink
            href={`${basePath}/seguranca`}
            label='Login/Segurança'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/seguranca`)}
          />
        </LinkGroup>

        <LinkGroup
          label='Assinatura'
          includedPaths={[`${basePath}/assinatura`, `${basePath}/planos`]}
        >
          <MenuLink
            href={`${basePath}/assinatura`}
            label='Minha Assinatura'
            icon={<HomeIcon />}
            active={router.pathname.includes(`${basePath}/assinatura`)}
          />
          <MenuLink
            href={`${basePath}/planos`}
            label='Planos'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/planos`)}
          />
        </LinkGroup>

        <LinkGroup
          label='Cadastros'
          includedPaths={[
            `${basePath}/contas`,
            `${basePath}/casas-de-aposta`,
            `${basePath}/categorias`,
          ]}
        >
          <MenuLink
            href={`${basePath}/contas`}
            label='Contas Bancárias'
            icon={<HomeIcon />}
            active={router.pathname.includes(`${basePath}/contas`)}
          />
          <MenuLink
            href={`${basePath}/casas-de-aposta`}
            label='Casas de Apostas'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/casas-de-aposta`)}
          />

          <MenuLink
            href={`${basePath}/categorias`}
            label='Categorias de Apostas'
            icon={<ReceiptIcon2 />}
            active={router.pathname.includes(`${basePath}/categorias`)}
          />
        </LinkGroup> */}
      </FlexColumn>
      <FlexColumn horizontalAlign='center'>
        <MenuAction label='Sair' icon={<SettingsIcon />} onClick={() => handleLogout()} />
      </FlexColumn>
    </FlexColumn>
  )
}

export const SidebarDesktopLinks: React.FC = () => {
  // const { ref: menuRef, isTarget: toggle, setIsTarget: setToggle } = useTarget(true)
  // ref={menuRef}
  return (
    <div
      className={
        Style.iconsContainer + ' ' + 'desktopView' + ' '
        //  + ' ' + `${toggle ? Style.opened : ''}`
      }
    >
      {/* <svg
        onClick={() => setToggle(!toggle)}
        width='28'
        height='28'
        viewBox='0 0 100 100'
        className={Style.hamburguerMenu}
      >
        <path
          className={Style.line + ' ' + Style.line1}
          d='M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058'
        />
        <path className={Style.line + ' ' + Style.line2} d='M 20,50 H 80' />
        <path
          className={Style.line + ' ' + Style.line3}
          d='M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942'
        />
      </svg> */}
      {/* <CommonText
        textAlign='center'
        fontFamily='Jomhuria'
        fontSize='46px'
        lineHeight='46px'
        color='#44174A'
        marginBottom='0'
        marginTop='6px'
      >
        TaxOnline
      </CommonText> */}
      <div
        className={
          Style.toggleContainer + ' ' + Style.MenuOn
          //  `${toggle ? Style.MenuOn : Style.MenuOff}`
        }
      >
        <SidebarDesktop />
      </div>
    </div>
  )
}

export const SidebarMobile: React.FC = () => {
  const { ref: menuRef, isTarget: toggle, setIsTarget: setToggle } = useTarget(true)

  return (
    <div
      className={Style.iconsContainer + ' ' + 'mobileView' + ' ' + `${toggle ? Style.opened : ''}`}
      ref={menuRef}
    >
      <svg
        onClick={() => setToggle(!toggle)}
        width='28'
        height='28'
        viewBox='0 0 100 100'
        className={Style.hamburguerMenu}
      >
        <path
          className={Style.line + ' ' + Style.line1}
          d='M 20,29.000046 H 80.000231 C 80.000231,29.000046 94.498839,28.817352 94.532987,66.711331 94.543142,77.980673 90.966081,81.670246 85.259173,81.668997 79.552261,81.667751 75.000211,74.999942 75.000211,74.999942 L 25.000021,25.000058'
        />
        <path className={Style.line + ' ' + Style.line2} d='M 20,50 H 80' />
        <path
          className={Style.line + ' ' + Style.line3}
          d='M 20,70.999954 H 80.000231 C 80.000231,70.999954 94.498839,71.182648 94.532987,33.288669 94.543142,22.019327 90.966081,18.329754 85.259173,18.331003 79.552261,18.332249 75.000211,25.000058 75.000211,25.000058 L 25.000021,74.999942'
        />
      </svg>
      <CommonText
        textAlign='center'
        fontFamily='Jomhuria'
        fontSize='46px'
        lineHeight='46px'
        color='primary-300'
        marginBottom='0'
        marginTop='6px'
      >
        TaxOnline
      </CommonText>
      <div className={Style.toggleContainer + ' ' + `${toggle ? Style.MenuOn : Style.MenuOff}`}>
        <SidebarDesktop />
      </div>
    </div>
  )
}

const MenuLink: React.FC<{
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
}> = ({ icon, label, href, active }) => {
  return (
    <Link href={href} style={{ width: '100%' }}>
      <FlexRow
        width='100%'
        height='40px'
        padding='0px 16px 0px 16px'
        horizontalAlign='flex-start'
        verticalAlign='center'
        gap='7px'
        className={clx(Style.menuLink)}
      >
        <IconNormalizer width='20px' color={active ? 'primary-500' : 'white-70'}>
          {icon}
        </IconNormalizer>
        <CommonText
          fontSize='16px'
          lineHeight='40px'
          color={active ? 'primary-500' : 'white-70'}
          fontWeight={active ? '700' : '500'}
          textAlign='left'
          width='100%'
        >
          {label}
        </CommonText>
      </FlexRow>
    </Link>
  )
}

const MenuAction: React.FC<{
  icon: React.ReactNode
  label: string
  onClick: () => void
}> = ({ icon, label, onClick }) => {
  return (
    <FlexRow
      width='fit-content'
      height='40px'
      padding='0px 16px 0px 16px'
      horizontalAlign='flex-start'
      verticalAlign='center'
      gap='7px'
      className={clx(Style.menuLinkRed, BG_COLORS['transparent'])}
      onClick={onClick}
    >
      <IconNormalizer width='24px' color='white-90'>
        {icon}
      </IconNormalizer>
      <CommonText
        fontSize='16px'
        lineHeight='14.16px'
        color='white-90'
        fontWeight='600'
        textAlign='left'
      >
        {label}
      </CommonText>
    </FlexRow>
  )
}
type LinkGroupProps = {
  children: React.ReactNode
  label: string
  includedPaths?: string[]
}
const LinkGroup: React.FC<LinkGroupProps> = ({ children, label, includedPaths }) => {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(
    includedPaths?.some((path) => router.pathname.includes(path)) || false,
  )
  const [animateRef] = useAutoAnimate({ duration: 200 })
  return (
    <FlexColumn
      margin='auto'
      horizontalAlign='center'
      gap='0'
      padding='4px 12px'
      width='90%'
      className={clx(Style.linkGroup)}
    >
      <FlexRow
        width='100%'
        height='40px'
        horizontalAlign='flex-start'
        verticalAlign='center'
        gap='7px'
        onClick={() => setIsOpen(!isOpen)}
      >
        <CommonText
          fontSize='18px'
          lineHeight='14.16px'
          color='white-90'
          fontWeight='600'
          textAlign='left'
        >
          {label}
        </CommonText>
        <AngleUpIcon toggle={!isOpen} />
      </FlexRow>
      <FlexColumn ref={animateRef} horizontalAlign='center' padding={`0 4px 0 4px`}>
        <HideComponent visible={isOpen}>{children}</HideComponent>
      </FlexColumn>
    </FlexColumn>
  )
}

type LinkSingleProps = {
  label: string
  href: string
  active?: boolean
}
const LinkSingle: React.FC<LinkSingleProps> = ({ label, href, active }) => {
  return (
    <Link href={href} style={{ width: '100%' }}>
      <FlexColumn
        margin='auto'
        horizontalAlign='center'
        gap='0'
        padding='4px 12px'
        width='90%'
        className={Style.linkSingle}
      >
        <FlexRow
          width='100%'
          height='40px'
          horizontalAlign='flex-start'
          verticalAlign='center'
          gap='7px'
        >
          <CommonText
            fontSize='18px'
            lineHeight='14.16px'
            color={active ? 'primary-500' : 'white-90'}
            fontWeight='600'
            textAlign='left'
          >
            {label}
          </CommonText>
        </FlexRow>
      </FlexColumn>
    </Link>
  )
}
