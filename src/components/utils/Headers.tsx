import React from 'react'
import Style from './Headers.module.css'
import { CSS_VARS, CSS_VARS_OPTIONS, FONT_COLORS, FONT_COLORS_OPTIONS } from './colors'
type FontFamilyOptions = 'Inter' | 'Lato' | 'Jomhuria'
type TextProps = {
  children: React.ReactNode
  className?: string
}
type OnClick = {
  onClick?: () => void
}
type TextPropsWithSizes = TextProps & {
  fontSize?: string
  marginTop?: string
  marginBottom?: string
  marginLeft?: string
  marginRight?: string
  letterSpacing?: string
  textAlign?: React.CSSProperties['textAlign']
  width?: string
  maxWidth?: string
  fontWeight?: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900'
  color?: CSS_VARS_OPTIONS
  fontFamily?: FontFamilyOptions
  link?: boolean
  lineHeight?: string
}
export const FormTitle: React.FC<TextProps> = ({ children, className }) => {
  return <h2 className={`${Style.formTitle} ${className}`}>{children}</h2>
}

export const FormSubtitle: React.FC<TextProps> = ({ children, className }) => {
  return <h3 className={`${Style.formSub} ${className}`}>{children}</h3>
}

export const BoldText: React.FC<TextPropsWithSizes> = ({
  children,
  className,
  fontSize,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  textAlign,
  color,
  link
}) => {
  return (
    <p
      style={{
        fontWeight: '500',
        fontFamily: 'Inter',
        fontSize: fontSize || '2rem',
        letterSpacing: '-1.12px',
        marginTop: marginTop || '4px',
        marginBottom: marginBottom || '4px',
        marginLeft: marginLeft || '0',
        marginRight: marginRight || '0',
        textAlign: textAlign || 'center',
        color: CSS_VARS[color || 'neutral-900'],
        cursor: link ? 'pointer' : 'inherit',
        textDecoration: link ? 'underline' : 'none',
      }}
      className={className}
    >
      {children}
    </p>
  )
}

export const HighLightText: React.FC<TextPropsWithSizes> = ({
  children,
  className,
  fontSize,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  letterSpacing,
  fontWeight,
  color,
  link
}) => {
  return (
    <span
      style={{
        fontWeight: fontWeight || '700',
        fontFamily: 'Inter',
        fontSize: fontSize || '2rem',
        letterSpacing: letterSpacing || '-1.12px',
        marginTop: marginTop || '4px',
        marginBottom: marginBottom || '4px',
        marginLeft: marginLeft || '0',
        marginRight: marginRight || '0',
        color: CSS_VARS[color || 'neutral-900'],
        cursor: link ? 'pointer' : 'inherit',
        textDecoration: link ? 'underline' : 'none',
      }}
      className={className}
    >
      {children}
    </span>
  )
}

export const CommonText: React.FC<TextPropsWithSizes & OnClick> = ({
  children,
  className,
  fontSize,
  marginBottom,
  marginLeft,
  marginRight,
  marginTop,
  textAlign,
  width,
  maxWidth,
  fontWeight,
  color,
  letterSpacing,
  fontFamily,
  lineHeight,
  onClick,
  link
}) => {
  return (
    <p
      style={{
        fontWeight: fontWeight || '400',
        fontFamily: fontFamily || 'Inter',
        fontSize: fontSize || '1.6rem',
        lineHeight: lineHeight || '1.9rem',
        marginTop: marginTop || '4px',
        marginBottom: marginBottom || '4px',
        marginLeft: marginLeft || '0',
        marginRight: marginRight || '0',
        textAlign: textAlign || 'left',
        width: width || '100%',
        maxWidth: maxWidth || '100%',
        padding: '0',
        color: CSS_VARS[color || 'neutral-900'],
        letterSpacing: letterSpacing || 'normal',
        cursor: (onClick || link) ? 'pointer' : 'inherit',
        textDecoration: link ? 'underline' : 'none',
      }}
      className={className}
      onClick={onClick}
    >
      {children}
    </p>
  )
}

type MinorTextProps = {
  children: React.ReactNode
  className?: string
  color?: CSS_VARS_OPTIONS
  textAlign?: React.CSSProperties['textAlign']
}

export const HeadlineText: React.FC<MinorTextProps> = ({ children, className, color, textAlign }) => {
  return (
    <CommonText
      fontSize='2.4rem'
      fontWeight='700'
      color={color || 'white-90'}
      className={className}
      textAlign={textAlign || 'left'}
    >
      {children}
    </CommonText>
  )
}

export const SubHeadlineText: React.FC<MinorTextProps> = ({ children, className, color, textAlign }) => {
  return (
    <CommonText
      fontSize='1.6rem'
      fontWeight='300'
      color={color || 'white-90'}
      className={className}
      textAlign={textAlign || 'left'}
    >
      {children}
    </CommonText>
  )
}

export const DefaultText: React.FC<MinorTextProps> = ({ children, className, color, textAlign }) => {
  return (
    <CommonText
      fontSize='1.4rem'
      fontWeight='400'
      color={color || 'white-90'}
      className={className}
      textAlign={textAlign || 'left'}
    >
      {children}
    </CommonText>
  )
}