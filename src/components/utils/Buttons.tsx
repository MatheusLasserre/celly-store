import { clx } from '~/utils/style'
import Style from './Buttons.module.css'
import { CalendarIcon, LeftArrowIcon, RightArrowIcon, UniversalIconProps } from './Icons'
import { Loading } from './Loading'
import { FlexItem, FlexRow, ImageContainer } from './Utils'
import { CommonText } from './Headers'
import { ReactElement } from 'react'
import Link from 'next/link'
import { BG_COLORS, BG_COLORS_OPTIONS, CSS_VARS_OPTIONS } from './colors'
import { useRouter } from 'next/router'

export const FormButton: React.FC<{
  type: 'submit' | 'reset' | 'button'
  onClick?: React.MouseEventHandler<HTMLButtonElement>
  className?: string
  children: React.ReactNode
  loading?: boolean
}> = ({ type, onClick, className, children, loading }) => {
  if (loading) return <Loading />
  return (
    <button type={type} onClick={onClick} className={className || Style.button}>
      {children}
    </button>
  )
}

export const StateButton: React.FC<{
  onClick: React.MouseEventHandler<HTMLParagraphElement>
  className?: string
  children: React.ReactNode
  type: 'default' | 'outline' | 'compact' | 'outlineCompact'
  loading?: boolean
}> = ({ onClick, className, children, type, loading }) => {
  const typeClasses = {
    default: Style.button,
    outline: Style.outline,
    compact: Style.compact,
    outlineCompact: Style.outlineCompact,
  }

  if (loading) return <Loading />

  return (
    <p onClick={onClick} className={typeClasses[type] + ' ' + className}>
      {children}
    </p>
  )
}

export const MiniLink1: React.FC<{
  onClick: React.MouseEventHandler<HTMLParagraphElement>
  className?: string
  children: React.ReactNode
}> = ({ onClick, className, children }) => {
  return (
    <p onClick={onClick} className={className || Style.miniLink1}>
      {children}
    </p>
  )
}

export const BackButton: React.FC<{
  className?: string
  color?: CSS_VARS_OPTIONS
}> = ({ className, color }) => {
  const router = useRouter()
  return (
    <FlexRow verticalAlign='center' onClick={router.back} className={className || Style.backButton}>
      <LeftArrowIcon width={14} color={color || 'white-60'} />
      <CommonText color={color || 'white-70'} fontWeight='500' fontSize='14px'>Voltar</CommonText>
    </FlexRow>
  )
}

export const IconButton1: React.FC<{
  onClick: React.MouseEventHandler<HTMLDivElement>
  className?: string
  children: React.ReactNode
}> = ({ onClick, className, children }) => {
  return (
    <div onClick={onClick} className={className || Style.iconButton1}>
      {children}
    </div>
  )
}

export const LIconButton1: React.FC<{
  onClick: React.MouseEventHandler<HTMLDivElement>
  className?: string
  children: React.ReactNode
  label: string
}> = ({ onClick, className, children, label }) => {
  return (
    <div className={Style.LIconBox}>
      <IconButton1 onClick={onClick} className={className || Style.iconButton1}>
        {children}
      </IconButton1>
      <p>{label}</p>
    </div>
  )
}

export const BackgroundIconButton: React.FC<{
  onClick?: () => void
  backgroundColor: BG_COLORS_OPTIONS
  icon: React.ReactNode
  width?: string
}> = ({ onClick, backgroundColor, icon, width }) => {
  return (
    <FlexRow
      className={clx(BG_COLORS[backgroundColor], Style.BackgroundIconButton)}
      width={width || '40px'}
      height={width || '40px'}
      horizontalAlign='center'
      verticalAlign='center'
      onClick={onClick}
    >
      {icon}
    </FlexRow>
  )
}

export const BlankLink: React.FC<{
  URL: string
  className?: string
  label: string
}> = ({ URL, className, label }) => {
  return (
    <Link href={URL} className={className || Style.blankLink}>
      <CommonText
        fontSize='14px'
        lineHeight='17px'
        fontWeight='400'
        color='neutral-300'
        className={Style.BlankLink}
      >
        {label} <RightArrowIcon />
      </CommonText>
    </Link>
  )
}
