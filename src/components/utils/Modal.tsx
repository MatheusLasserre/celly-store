import { forwardRef } from 'react'
import { StateButton } from './Buttons'
import Style from './Modal.module.css'
import { FlexColumn, IconBackgroundNormalizer } from './Utils'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

export const ModalHelper: React.FC<{
  children: React.ReactNode
  childrenClass?: string
  parentClass?: string
}> = ({ children, childrenClass, parentClass }) => {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--BLACK1-60)',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: '100',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'auto',
      }}
      className={`${parentClass ? parentClass : ''}`}
    >
      <div className={`${childrenClass ? childrenClass : ''}`}>{children}</div>
    </div>
  )
}

type SuccessModalProps = {
  title: string
  message: string
  confirm: () => void
  confirmText?: string
  cancel?: () => void
  cancelText?: string
  visible?: boolean
}

export const CustomModal: React.FC<SuccessModalProps> = ({
  title,
  message,
  confirm,
  cancel,
  cancelText,
  confirmText,
  visible,
}) => {
  if (!visible) return null

  return (
    <ModalHelper>
      <div className={Style.modalBox}>
        <div className={Style.modalTitle}>{title}</div>
        <div className={Style.modalMessage}>{message}</div>
        <div className={Style.modalButtons}>
          {!!cancel ? (
            <StateButton type='outline' onClick={cancel}>
              {cancelText}
            </StateButton>
          ) : null}
          <StateButton type='default' onClick={confirm}>
            {confirmText}
          </StateButton>
        </div>
      </div>
    </ModalHelper>
  )
}

type ContextMenuProps = {
  children: React.ReactNode
  visible: boolean
  close: () => void
  x: number
  y: number
}

export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(
  ({ children, visible, close, x, y }, ref) => {
    visible ? disableBodyScroll(document.body) : enableBodyScroll(document.body)
    if (!visible) return null
    const abc = <p></p>
    return (
      <FlexColumn
        ref={ref}
        className={Style.contextMenuBox}
        styles={{
          top: y + 'px',
          left: x + 'px',
          padding: '4px 0',
          width: 'fit-content',
        }}
      >
        {children}
      </FlexColumn>
    )
  },
)

export const ContextMenuItem: React.FC<{
  onClick: () => void
  text: string
  icon: React.ReactNode
  padding?: string
}> = ({ onClick, text, icon, padding }) => {
  return (
    <div className={Style.contextMenuItem} onClick={onClick}>
      <IconBackgroundNormalizer
        width='16px'
        backgroundColor={'neutral-900'}
        color='neutral-100'
        padding={padding}
      >
        {icon}
      </IconBackgroundNormalizer>
      <p>{text}</p>
    </div>
  )
}

export const ContextMenuDivider: React.FC = () => {
  return <div className={Style.contextMenuDivider}></div>
}
