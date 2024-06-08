import Link from 'next/link'
import Style from './Inputs.module.css'
import { ClassAttributes, forwardRef, InputHTMLAttributes, useEffect, useRef, useState } from 'react'
import { AngleUpIcon, CrossIcon, EyeIcon, UpArrowIcon } from './Icons'
import {
  FormatNumberMask,
  handleValueInputChange,
  isNumeric,
  NumberStringToNumber,
  padWithLeadingZeros,
} from '~/utils/formating/credentials'
import { TimePicker } from 'react-time-picker-typescript'
import 'react-time-picker-typescript/dist/style.css'
import { FlexColumn, FlexRow, HideComponent } from './Utils'
import useTarget from '~/hooks/useTarget'
import { CommonText } from './Headers'
import { CSS_VARS_OPTIONS } from './colors'
import { clx } from '~/utils/style'

type InputProps = {
  type?: InputHTMLAttributes<HTMLInputElement>['type']
  placeholder?: InputHTMLAttributes<HTMLInputElement>['placeholder']
  required?: InputHTMLAttributes<HTMLInputElement>['required']
  onChange?: InputHTMLAttributes<HTMLInputElement>['onChange']
  value?: InputHTMLAttributes<HTMLInputElement>['value']
  maxLength?: InputHTMLAttributes<HTMLInputElement>['maxLength']
  id?: InputHTMLAttributes<HTMLInputElement>['id']
  name?: string
  className?: string
  onKeyDown?: InputHTMLAttributes<HTMLInputElement>['onKeyDown']
  ref?: ClassAttributes<HTMLInputElement>['ref']
  disabled?: boolean
  onClick?: InputHTMLAttributes<HTMLInputElement>['onClick']
}

export const CLabel: React.FC<{
  label: string
  className?: string
  children?: React.ReactNode
}> = ({ label, className, children }) => {
  return (
    <label className={Style.label + ' ' + className}>
      {label}
      {children}
    </label>
  )
}

export const CText = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      onChange,
      placeholder,
      required,
      value,
      className,
      maxLength,
      name,
      id,
      disabled,
      onKeyDown,
      onClick
    },
    ref,
  ) => {
    if (type === 'password')
      return (
        <CPassword
          type={type}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          value={value}
          className={className}
          maxLength={maxLength}
          name={name}
          id={id}
          onKeyDown={onKeyDown}
          ref={ref}
          disabled={disabled}
          onClick={onClick}
        />
      )
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        name={name}
        className={Style.textInput + ' ' + className}
        id={id}
        onKeyDown={onKeyDown}
        ref={ref}
        disabled={disabled}
        onClick={onClick}
      />
    )
  },
)

export const CPassword = forwardRef<HTMLInputElement, InputProps>(
  (
    { type, onChange, placeholder, required, value, className, maxLength, name, id, onKeyDown, onClick },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
      <div className={Style.passwordBox}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          name={name}
          id={id}
          className={Style.textInput + ' ' + className}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />
        <EyeIcon showPassword={showPassword} setShowPassword={setShowPassword} />
      </div>
    )
  },
)

export const CPassword2 = forwardRef<HTMLDivElement, InputProps>(
  (
    { type, onChange, placeholder, required, value, className, maxLength, name, id, onKeyDown , onClick},
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
      <div className={Style.passwordBox}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          maxLength={maxLength}
          name={name}
          id={id}
          className={Style.textInput + ' ' + className}
          onClick={onClick}
          onKeyDown={onKeyDown}
        />
        <EyeIcon showPassword={showPassword} setShowPassword={setShowPassword} />
      </div>
    )
  },
)

export const FormFlex: React.FC<{
  children: React.ReactNode
  className?: string
  maxWidth?: string
}> = ({ children, className, maxWidth }) => {
  return (
    <div className={Style.flex + ' ' + className} style={{ maxWidth: maxWidth || '400px' }}>
      {children}
    </div>
  )
}

export const CLText: React.FC<
  InputProps & {
    label?: string
    labelClassName?: string
  }
> = ({
  type,
  onChange,
  placeholder,
  required,
  value,
  maxLength,
  className,
  label,
  labelClassName,
  name,
  id,
  disabled,
  onKeyDown,
  onClick
}) => {
  return (
    <label className={labelClassName || Style.label}>
      {label}
      <CText
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        name={name}
        id={id}
        className={className}
        disabled={disabled}
        onKeyDown={onKeyDown}
        onClick={onClick}
      />
    </label>
  )
}

export const CLink: React.FC<{
  link: string
}> = ({ link }) => {
  return (
    <Link href={link}>
      <a className={Style.link}>{link}</a>
    </Link>
  )
}

export const CCheckbox: React.FC<{
  checked: boolean
  setChecked: React.Dispatch<boolean>
}> = ({ checked, setChecked }) => {
  return (
    <input
      type='checkbox'
      checked={checked}
      onChange={(e) => setChecked(e.currentTarget.checked)}
      className={Style.checkbox + ' ' + `${checked ? Style.checked : ''}`}
    />
  )
}

export const CLCheckbox: React.FC<{
  checked: boolean
  setChecked: React.Dispatch<boolean>
  label: string
  labelClassName?: string
}> = ({ checked, setChecked, label, labelClassName }) => {
  return (
    <div className={Style.checkBoxContainer}>
      <div
        onClick={() => setChecked(!checked)}
        className={Style.checkbox + ' ' + `${checked ? Style.checked : ''}`}
      >
        <svg width='9' height='6' viewBox='0 0 11 8' fill='none' xmlns='http://www.w3.org/2000/svg'>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M4.65741 7.00019C4.56141 7.00019 4.46541 6.96344 4.39191 6.89069L1.39191 3.89069C1.24566 3.74369 1.24566 3.50669 1.39191 3.35969C1.53891 3.21344 1.77591 3.21344 1.92291 3.35969L4.65741 6.09494L9.64191 1.10969C9.78891 0.963438 10.0259 0.963438 10.1729 1.10969C10.3192 1.25669 10.3192 1.49369 10.1729 1.64069L4.92291 6.89069C4.84941 6.96344 4.75341 7.00019 4.65741 7.00019Z'
            fill='white'
            stroke='white'
          />
        </svg>
      </div>
      <label className={labelClassName || Style.checkBoxlabel}>{label}</label>
    </div>
  )
}

export const FormError: React.FC<{
  message?: string | null
  isError: boolean
}> = ({ message, isError }) => {
  if (!isError) return null
  return <p className={Style.error}>Erro: {message}</p>
}

export const FormSuccess: React.FC<{
  message?: string | null
  isSuccess: boolean
}> = ({ message, isSuccess }) => {
  if (!isSuccess) return null
  return <p className={Style.success}>{message}</p>
}

export const CRadio: React.FC<{
  selected: boolean
  setSelected: () => void
}> = ({ selected, setSelected }) => {
  return (
    <input
      type='radio'
      checked={selected}
      onChange={(e) => setSelected()}
      className={Style.radio + ' ' + `${selected ? Style.selected : ''}`}
    />
  )
}

export const CLRadio: React.FC<{
  selected: boolean
  setSelected: () => void
  label: string
  labelClassName?: string
}> = ({ selected, setSelected, label, labelClassName }) => {
  return (
    <div className={Style.radioContainer}>
      <CRadio selected={selected} setSelected={setSelected} />
      <label onClick={() => setSelected()} className={labelClassName || Style.radioLabel}>
        {label}
      </label>
    </div>
  )
}

export const CTextFilled: React.FC<{
  value: string
  ref?: ClassAttributes<HTMLDivElement>['ref']
}> = ({ value, ref }) => {
  return (
    <div className={Style.textFilled} ref={ref}>
      <p>{value}</p>
    </div>
  )
}

type TextFilterProps = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClear: () => void
  placeholder?: string
  className?: string
} & InputProps
export const CTextFilter: React.FC<TextFilterProps> = ({
  value,
  onChange,
  placeholder,
  className,
  disabled,
  id,
  maxLength,
  name,
  onKeyDown,
  required,
  type,
  onClear,
}) => {
  return (
    <div className={Style.TextFilter}>
      <CText
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={Style.textInput + ' ' + className}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={name}
        onKeyDown={onKeyDown}
        required={required}
      />
      <CrossIcon onClick={() => onClear()} width={24} />
    </div>
  )
}

type CurrencyInputProps = {
  currencyValue: number
  setCurrencyValue: (currencyValue: number) => void
  label: string
  labelClassName?: string
  className?: string
  maxLength?: number
  placeholder?: string
}

export const CLCurrencyInput: React.FC<CurrencyInputProps> = ({
  currencyValue,
  setCurrencyValue,
  label,
  labelClassName,
  className,
  maxLength,
  placeholder,
}) => {
  const [editValueString, setEditValueString] = useState(FormatNumberMask(currencyValue))
  const handleEditTransferAmountChange = (val: string) => {
    // setEditValueString(handleValueInputChange(val, currencyValue))
    setCurrencyValue(NumberStringToNumber(val))
  }

  useEffect(() => {
    setEditValueString(FormatNumberMask(currencyValue))
  }, [currencyValue])

  return (
    <label className={clx(labelClassName || Style.label, Style.currencyBefore)}>
      {label}
      <CText
        value={editValueString}
        onChange={(e) => handleEditTransferAmountChange(e.currentTarget.value)}
        required
        type='text'
        name='value'
        id='value'
        placeholder={placeholder}
        maxLength={maxLength}
        className={clx(className, Style.currencyBeforeInput)}
      />
    </label>
  )
}

type SelectNumberProps = {
  range: [number, number]
  paddingZeros?: number
  setCurrentSelected: React.Dispatch<number>
  defaultValue?: number
  label?: string
}

export const CLSelectNumber: React.FC<SelectNumberProps> = ({
  range,
  paddingZeros,
  setCurrentSelected,
  defaultValue,
  label,
}) => {
  return (
    <div className={Style.contentWrapper}>
      <label className={Style.label}>{label}</label>
      <select
        onChange={(e) => {
          setCurrentSelected(Number(e.currentTarget.value))
        }}
        defaultValue={defaultValue}
      >
        {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]).map((element) => {
          return (
            <option value={element} key={element}>
              {padWithLeadingZeros(element, paddingZeros || element.toString().length)}
            </option>
          )
        })}
      </select>
      <div className={Style.svgIcon}>
        <svg width='20px' height='20px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
          <path d='M10 1L5 8h10l-5-7zm0 18l5-7H5l5 7z' />
        </svg>
      </div>
    </div>
  )
}

type SelectConfig2 = {
  options: Array<{
    [key: string]: any
  }>
  nameKey: string
  optionValueKey: string
}

type SelectIntProps = {
  SelectConfig: SelectConfig2
  setCurrentSelected: React.Dispatch<string>
  defaultValue?: string
  label?: string
}

export const CLSelectString: React.FC<SelectIntProps> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
  label,
}) => {
  return (
    <FlexColumn verticalAlign='flex-start' horizontalAlign='flex-start' gap='4px' margin='auto'>
      <label className={Style.label}>{label}</label>
      <FlexRow margin='auto' horizontalAlign='center'>
        <select
          onChange={(e) => {
            setCurrentSelected(e.currentTarget.value)
          }}
          defaultValue={defaultValue}
        >
          <option value={0} disabled>
            Selecione
          </option>
          {SelectConfig.options.map((element) => {
            return (
              <option
                value={Number(element[SelectConfig.optionValueKey])}
                key={`${element[SelectConfig.nameKey]}${element[SelectConfig.optionValueKey]}`}
              >
                {element[SelectConfig.nameKey]}
              </option>
            )
          })}
        </select>
      </FlexRow>
    </FlexColumn>
  )
}


type TimeSelectionProps = {
  time: string
  setTime: (time: string) => void
  nextInputRef?: React.RefObject<HTMLInputElement>
  startRef?: React.RefObject<HTMLInputElement>
}

export const TimeSelection: React.FC<TimeSelectionProps> = ({
  time,
  setTime,
  nextInputRef,
  startRef,
}) => {
  const [showPicker, setShowPicker] = useState(false)

  const [hours, setHours] = useState<string>(time.split(':')[0] || '00')
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === '') {
      setHours('00')
      concatAndSetTime('00', minutes)
      return
    }
    if (!isNumeric(e.target.value)) return
    if (e.target.value.length === 2) {
      if (parseInt(e.target.value) > 23) {
        setHours('23')
        concatAndSetTime('23', minutes)
        startRef?.current?.blur()
        minutesRef.current?.focus()
        return
      } else {
        setHours(e.target.value)
        concatAndSetTime(e.target.value, minutes)
        minutesRef.current?.focus()
        return
      }
    }

    setHours(e.target.value)
    concatAndSetTime(e.target.value, minutes)
    return
  }

  const [minutes, setMinutes] = useState<string>(time.split(':')[1] || '00')
  const minutesRef = useRef<HTMLInputElement>(null)
  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.value === '') {
      setMinutes('00')
      concatAndSetTime(hours, '00')
      return
    }
    if (!isNumeric(e.target.value)) return
    if (e.target.value.length === 2) {
      if (parseInt(e.target.value) > 59) {
        setMinutes('59')
        concatAndSetTime(hours, '59')
        nextInputRef?.current?.focus()
        return
      } else {
        setMinutes(e.target.value)
        concatAndSetTime(hours, e.target.value)
        nextInputRef?.current?.focus()
        return
      }
    }
    setMinutes(e.target.value)
    concatAndSetTime(hours, e.target.value)
    return
  }

  const concatAndSetTime = (hours: string, minutes: string) => {
    setTime(`${hours}:${minutes}`)
  }

  const directlySetTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    setHours(padWithLeadingZeros(Number(hours), 2))
    setMinutes(padWithLeadingZeros(Number(minutes), 2))
    setTime(time)
  }

  const handleShowPicker = (current: boolean) => {
    if (!current) {
      setTimeout(() => {
        setShowPicker((prev) => !prev)
      }, 10)

      setTimeout(() => {
        setShowPicker((prev) => !prev)
      }, 20)

      setTimeout(() => {
        setShowPicker((prev) => !prev)
      }, 30)
    } else {
      setTimeout(() => {
        setShowPicker((prev) => !prev)
      }, 10)

      setTimeout(() => {
        setShowPicker((prev) => !prev)
      }, 20)
    }
    // setShowPicker(prev => !prev)
  }

  return (
    <div className={Style.inputWrapper}>
      <div className={Style.timeInputContainer}>
        <input
          type='text'
          className={Style.timeInputDay}
          value={hours}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) => {
            e.currentTarget.value.length < 2
              ? setHours(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))
              : null
          }}
          onChange={handleHoursChange}
          maxLength={2}
          ref={startRef}
        />
        <p className={Style.timeInputDivider}>:</p>
        <input
          type='text'
          className={Style.timeInput}
          value={minutes}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) =>
            e.currentTarget.value.length === 1
              ? setMinutes(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))
              : null
          }
          onChange={handleMinutesChange}
          maxLength={2}
          ref={minutesRef}
        />
        <div className={Style.inputIcon2} onClick={() => handleShowPicker(showPicker)}>
          <svg
            width='18px'
            height='18px'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M23 12C23 12.3545 22.9832 12.7051 22.9504 13.051C22.3838 12.4841 21.7204 12.014 20.9871 11.6675C20.8122 6.85477 16.8555 3.00683 12 3.00683C7.03321 3.00683 3.00683 7.03321 3.00683 12C3.00683 16.8555 6.85477 20.8122 11.6675 20.9871C12.014 21.7204 12.4841 22.3838 13.051 22.9504C12.7051 22.9832 12.3545 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12Z'
              fill='gray'
            />
            <path
              d='M13 11.8812L13.8426 12.3677C13.2847 12.7802 12.7902 13.2737 12.3766 13.8307L11.5174 13.3346C11.3437 13.2343 11.2115 13.0898 11.1267 12.9235C11 12.7274 11 12.4667 11 12.4667V6C11 5.44771 11.4477 5 12 5C12.5523 5 13 5.44772 13 6V11.8812Z'
              fill='gray'
            />
            <path
              d='M18 15C17.4477 15 17 15.4477 17 16V17H16C15.4477 17 15 17.4477 15 18C15 18.5523 15.4477 19 16 19H17V20C17 20.5523 17.4477 21 18 21C18.5523 21 19 20.5523 19 20V19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H19V16C19 15.4477 18.5523 15 18 15Z'
              fill='gray'
            />
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M18 24C21.3137 24 24 21.3137 24 18C24 14.6863 21.3137 12 18 12C14.6863 12 12 14.6863 12 18C12 21.3137 14.6863 24 18 24ZM18 22.0181C15.7809 22.0181 13.9819 20.2191 13.9819 18C13.9819 15.7809 15.7809 13.9819 18 13.9819C20.2191 13.9819 22.0181 15.7809 22.0181 18C22.0181 20.2191 20.2191 22.0181 18 22.0181Z'
              fill='gray'
            />
          </svg>
        </div>
      </div>
      {showPicker && (
        <TimePicker
          value={time}
          onChange={(time) => {
            if (time === null) {
              // handleShowPicker(showPicker)
              return
            }
            directlySetTime(time)
          }}
          isOpen={true}
          controllers={false}
          inputClassName={Style.pickerInput}
          popupClassName={Style.pickerPopup}
        />
      )}
    </div>
  )
}

export const CLTimeSelection: React.FC<TimeSelectionProps & { label: string }> = ({
  label,
  setTime,
  time,
  nextInputRef,
  startRef,
}) => {
  return (
    <label className={Style.label}>
      {label}
      <TimeSelection
        time={time}
        setTime={setTime}
        nextInputRef={nextInputRef}
        startRef={startRef}
      />
    </label>
  )
}

type SelectProps = {
  SelectConfig: {
    options: Array<{
      [key: string]: any
    }>
    nameKey: string
    optionValueKey: string
  }
  setCurrentSelected: (value: string) => void
  defaultValue?: string
  label?: string
  filled?: boolean
}

export const CLSelectString2: React.FC<SelectProps & {color?:CSS_VARS_OPTIONS}> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
  label,
  filled,
  color
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || 'Selecione')
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <FlexRow
      verticalAlign='center'
      horizontalAlign='flex-start'
      gap='4px'
      margin='0'
      width='fit-content'
    >
      <CommonText
        className={Style.dropdownLabel}
        fontSize='14px'
        fontWeight='400'
        color={color ||'neutral-300'}
      >
        {label}
      </CommonText>
      <FlexRow margin='auto' horizontalAlign='center' position='relative'>
        <FlexRow onClick={() => setIsTarget(!isTarget)} verticalAlign='center'>
          <CommonText fontSize='14px' width='fit-content'
          color={color ||'neutral-300'}
          >
            {selectedValue}
          </CommonText>
          <AngleUpIcon toggle={!isTarget} />
        </FlexRow>
        <HideComponent visible={isTarget}>
          <div className={Style.dropdownItems} ref={ref}>
            {filled && <p>Selecione</p>}

            {SelectConfig.options.map((element) => {
              return (
                <CommonText
                  key={`${element[SelectConfig.nameKey]}${element[SelectConfig.optionValueKey]}`}
                  onClick={() => {
                    setSelectedValue(element[SelectConfig.optionValueKey])
                    setCurrentSelected(element[SelectConfig.optionValueKey])
                    setIsTarget(false)
                  }}
                  fontSize='14px'
                  fontWeight='400'
                  color='neutral-300'
                  className={Style.dropdownItem}
                  textAlign='left'
                >
                  {element[SelectConfig.nameKey]}
                </CommonText>
              )
            })}
          </div>
        </HideComponent>
      </FlexRow>
    </FlexRow>
  )
}

export const CLSelectString3: React.FC<SelectProps> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
  label,
  filled,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || 'Selecione')
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <FlexRow
      verticalAlign='center'
      horizontalAlign='flex-start'
      gap='4px'
      margin='0'
      width='fit-content'
    >
      {label && (
        <CommonText
          className={Style.dropdownLabel}
          fontSize='14px'
          fontWeight='400'
          color='neutral-300'
        >
          {label}
        </CommonText>
      )}
      <FlexRow margin='auto' horizontalAlign='center' position='relative'>
        <FlexRow onClick={() => setIsTarget(!isTarget)} verticalAlign='center'>
          <CommonText fontSize='14px' width='fit-content'>
            {selectedValue}
          </CommonText>
          <AngleUpIcon toggle={!isTarget} />
        </FlexRow>
        <HideComponent visible={isTarget}>
          <div className={Style.dropdownItems} ref={ref}>
            {filled && <p>Selecione</p>}

            {SelectConfig.options.map((element) => {
              return (
                <CommonText
                  key={`${element[SelectConfig.nameKey]}${element[SelectConfig.optionValueKey]}`}
                  onClick={() => {
                    setSelectedValue(element[SelectConfig.nameKey])
                    setCurrentSelected(element[SelectConfig.optionValueKey])
                    setIsTarget(false)
                  }}
                  fontSize='14px'
                  fontWeight='400'
                  color='neutral-300'
                  className={Style.dropdownItem}
                  textAlign='left'
                >
                  {element[SelectConfig.nameKey]}
                </CommonText>
              )
            })}
          </div>
        </HideComponent>
      </FlexRow>
    </FlexRow>
  )
}

type SelectPropsDouble = {
  SelectConfig: {
    options: Array<{
      [key: string]: any
    }>
    nameKey: string
    optionValueKey: string
    subNameKey: string
  }
  setCurrentSelected: (value: string) => void
  defaultValue?: string
  label?: string
  filled?: boolean
}

export const CLSelectStringDouble: React.FC<SelectPropsDouble> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
  label,
  filled,
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || 'Selecione')
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <FlexRow
      verticalAlign='center'
      horizontalAlign='flex-start'
      gap='4px'
      margin='0'
      width='fit-content'
    >
      <CommonText
        className={Style.dropdownLabel}
        fontSize='14px'
        fontWeight='400'
        color='neutral-300'
      >
        {label}
      </CommonText>
      <FlexRow margin='auto' horizontalAlign='center' position='relative'>
        <FlexRow onClick={() => setIsTarget(!isTarget)} verticalAlign='center'>
          <CommonText fontSize='14px' width='fit-content'>
            {selectedValue}
          </CommonText>
          <AngleUpIcon toggle={!isTarget} />
        </FlexRow>
        <HideComponent visible={isTarget}>
          <div className={Style.dropdownItems} ref={ref}>
            {filled && <p>Selecione</p>}

            {SelectConfig.options.map((element) => {
              return (
                <CommonText
                  key={`${element[SelectConfig.nameKey]}${element[SelectConfig.optionValueKey]}`}
                  onClick={() => {
                    setSelectedValue(element[SelectConfig.optionValueKey])
                    setCurrentSelected(element[SelectConfig.optionValueKey])
                    setIsTarget(false)
                  }}
                  fontSize='14px'
                  fontWeight='400'
                  color='neutral-300'
                  className={Style.dropdownItem}
                  textAlign='left'
                >
                  {element[SelectConfig.nameKey]} <br />
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#8A8A8A',
                    }}
                  >
                    {element[SelectConfig.subNameKey]}
                  </span>
                </CommonText>
              )
            })}
          </div>
        </HideComponent>
      </FlexRow>
    </FlexRow>
  )
}

type SelectPropsDoubleFilter = {
  SelectConfig: {
    options: Array<{
      [key: string]: any
    }>
    nameKey: string
    optionValueKey: string
    subNameKey: string
  }
  setCurrentSelected: (value: string) => void
  query: string
  setQuery: React.Dispatch<string>
  label?: string
  filled?: boolean
}

export const CLSelectStringDoubleFilter: React.FC<SelectPropsDoubleFilter> = ({
  SelectConfig,
  setCurrentSelected,
  label,
  filled,
  query,
  setQuery,
}) => {
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <FlexRow verticalAlign='center' horizontalAlign='flex-start' gap='4px' margin='0' width='200px'>
      {label && (
        <CommonText
          className={Style.dropdownLabel}
          fontSize='14px'
          fontWeight='400'
          color='neutral-300'
        >
          {label}
        </CommonText>
      )}
      <FlexRow margin='auto' horizontalAlign='center' position='relative'>
        <FlexRow verticalAlign='center'>
          <CText
            placeholder='Nome ou Cpf...'
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value)
            }}
          />

          <AngleUpIcon toggle={!isTarget} onClick={() => setIsTarget(!isTarget)} />
        </FlexRow>
        {/* <HideComponent visible={isTarget}>
          <div className={Style.dropdownItems} ref={ref}>
            {filled && <p>Selecione</p>}

            {SelectConfig.options.map((element) => {
              return (
                <CommonText
                  key={`${element[SelectConfig.nameKey]}${element[SelectConfig.optionValueKey]}`}
                  onClick={() => {
                    setCurrentSelected(element[SelectConfig.optionValueKey])
                    setQuery(element[SelectConfig.nameKey])
                    setIsTarget(false)
                  }}
                  fontSize='14px'
                  fontWeight='400'
                  color='#343741'
                  className={Style.dropdownItem}
                  textAlign='left'
                >
                  {element[SelectConfig.nameKey]} <br />
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#8A8A8A',
                    }}
                  >
                    {element[SelectConfig.subNameKey]}
                  </span>
                </CommonText>
              )
            })}
          </div>
        </HideComponent> */}
      </FlexRow>
    </FlexRow>
  )
}
type FalseTextProps = {
  text: string
  className?: string
  onClick?: () => void
}

export const CFalseText: React.FC<FalseTextProps> = ({ text, className, onClick }) => {
  return (
    <p
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      className={Style.falseText + ' ' + className}
    >
      {text}
    </p>
  )
}

export const CFalseTextMini: React.FC<FalseTextProps> = ({ text, className, onClick }) => {
  return (
    <p
      style={{
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
      className={Style.falseTextMini + ' ' + className}
    >
      {text}
    </p>
  )
}

export const CFalseTextWithRef = forwardRef<HTMLParagraphElement, FalseTextProps>(
  ({ text, className, onClick }, ref) => {
    return (
      <p
        style={{
          cursor: onClick ? 'pointer' : 'default',
        }}
        onClick={onClick}
        ref={ref}
        className={Style.falseText + ' ' + className}
      >
        {text}
      </p>
    )
  },
)
