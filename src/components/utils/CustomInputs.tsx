import { useRef, useState } from 'react'
import { Calendar } from 'react-date-range'
import useTarget from '~/hooks/useTarget'
import {
  FormatNumberMask,
  NumberStringToNumber,
  handleValueInputChange,
  isNumeric,
  padWithLeadingZeros,
} from '~/utils/formating/credentials'
import 'react-date-range/dist/styles.css' // main css file
import 'react-date-range/dist/theme/default.css' // theme css file
import { isValid } from 'date-fns'
import Style from './CustomInputs.module.css'
import { TimePicker } from 'react-time-picker-typescript'
import { pt } from 'date-fns/locale'
import { CFalseText, CFalseTextMini, CFalseTextWithRef, CLText, CText } from './Inputs'
import { AngleUpIcon } from './Icons'
import { CSS_VARS } from './colors'
import { FlexColumn, FlexRow } from './Utils'

type CurrencyInputProps = {
  currencyValue: number
  setCurrencyValue: (currencyValue: number) => void
  styles: string | undefined
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  styles,
  currencyValue,
  setCurrencyValue,
}) => {
  const [editValueString, setEditValueString] = useState(FormatNumberMask(currencyValue))
  const handleEditTransferAmountChange = (value: string) => {
    setEditValueString(handleValueInputChange(value, currencyValue))
    setCurrencyValue(NumberStringToNumber(value))
  }

  return (
    <input
      value={editValueString}
      onChange={(e) => handleEditTransferAmountChange(e.currentTarget.value)}
      required
      type='text'
      name='value'
      id='value'
      className={styles}
    />
  )
}

type DateSelectionProps = {
  date: Date
  setDate: (date: Date) => void
  nextInputRef?: React.RefObject<HTMLInputElement>
}

export const DateSelection: React.FC<DateSelectionProps> = ({ date, setDate }) => {
  const {
    isTarget: showCalendar,
    setIsTarget: setShowCalendar,
    ref: calendarRef,
  } = useTarget(false)

  const [day, setDay] = useState<string>(padWithLeadingZeros(date.getDate(), 2))
  const dayRef = useRef<HTMLInputElement>(null)
  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumeric(e.target.value)) return
    if (e.target.value.length === 2) {
      if (parseInt(e.target.value) > 31) {
        setDay('31')
        monthRef.current?.focus()
        return
      } else {
        setDay(e.target.value)
        monthRef.current?.focus()
        return
      }
    }

    setDay(e.target.value)
    return
  }

  const [month, setMonth] = useState<string>(padWithLeadingZeros(date.getMonth() + 1, 2))
  const monthRef = useRef<HTMLInputElement>(null)
  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumeric(e.target.value)) return
    if (e.target.value.length === 2) {
      if (parseInt(e.target.value) > 12) {
        setMonth('12')
        yearRef.current?.focus()
        return
      } else {
        setMonth(e.target.value)
        yearRef.current?.focus()
        return
      }
    }
    setMonth(e.target.value)
  }

  const [year, setYear] = useState<string>(padWithLeadingZeros(date.getFullYear(), 4))
  const yearRef = useRef<HTMLInputElement>(null)
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNumeric(e.target.value)) return
    if (e.target.value.length === 4) {
      setYear(e.target.value)
      const date = concatDate(day, month, e.target.value)
      if (isValid(date)) {
        directlySetDate(date)
        yearRef.current?.blur()
        return
      } else {
        setDay(padWithLeadingZeros(date.getDate(), 2))
        setMonth(padWithLeadingZeros(date.getMonth() + 1, 2))
        setYear(padWithLeadingZeros(date.getFullYear(), 4))
        dayRef.current?.focus()
        return
      }
    }
    setYear(e.target.value)
    return
  }

  const concatDate = (day: string, month: string, year: string) => {
    return new Date(`${year}-${month}-${day}T12:00:00.000Z`)
  }

  const directlySetDate = (date: Date) => {
    setDay(padWithLeadingZeros(date.getDate(), 2))
    setMonth(padWithLeadingZeros(date.getMonth() + 1, 2))
    setYear(padWithLeadingZeros(date.getFullYear(), 4))
    setDate(date)
  }

  return (
    <div className={Style.inputWrapper}>
      <div className={Style.textInputContainer}>
        <input
          type='text'
          className={Style.textInputDay}
          value={day}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) =>
            e.currentTarget.value.length < 2
              ? setDay(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))
              : null
          }
          onChange={handleDayChange}
          maxLength={2}
          ref={dayRef}
        />
        <p className={Style.textInputDivider}>/</p>
        <input
          type='text'
          className={Style.textInput}
          value={month}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) =>
            e.currentTarget.value.length < 2
              ? setMonth(padWithLeadingZeros(parseInt(e.currentTarget.value), 2))
              : null
          }
          onChange={handleMonthChange}
          maxLength={2}
          ref={monthRef}
        />
        <p className={Style.textInputDivider}>/</p>
        <input
          type='text'
          className={Style.textInputYear}
          value={year}
          max={4}
          onClick={(e) => e.currentTarget.select()}
          onFocus={(e) => e.currentTarget.select()}
          onBlur={(e) =>
            e.currentTarget.value.length < 4
              ? setYear(padWithLeadingZeros(parseInt(e.currentTarget.value), 4))
              : null
          }
          onChange={handleYearChange}
          maxLength={4}
          ref={yearRef}
        />
        <div className={Style.inputIcon} onClick={() => setShowCalendar(!showCalendar)}>
          <svg
            width='18px'
            height='18px'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M18 15.75C16.7574 15.75 15.75 16.7574 15.75 18C15.75 19.2426 16.7574 20.25 18 20.25C19.2426 20.25 20.25 19.2426 20.25 18C20.25 16.7574 19.2426 15.75 18 15.75ZM14.25 18C14.25 15.9289 15.9289 14.25 18 14.25C20.0711 14.25 21.75 15.9289 21.75 18C21.75 18.7643 21.5213 19.4752 21.1287 20.068L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L20.068 21.1287C19.4752 21.5213 18.7643 21.75 18 21.75C15.9289 21.75 14.25 20.0711 14.25 18Z'
              fill='#DCE4EB'
            />
            <path
              d='M7.75 2.5C7.75 2.08579 7.41421 1.75 7 1.75C6.58579 1.75 6.25 2.08579 6.25 2.5V4.07926C4.81067 4.19451 3.86577 4.47737 3.17157 5.17157C2.47737 5.86577 2.19451 6.81067 2.07926 8.25H21.9207C21.8055 6.81067 21.5226 5.86577 20.8284 5.17157C20.1342 4.47737 19.1893 4.19451 17.75 4.07926V2.5C17.75 2.08579 17.4142 1.75 17 1.75C16.5858 1.75 16.25 2.08579 16.25 2.5V4.0129C15.5847 4 14.839 4 14 4H10C9.16097 4 8.41527 4 7.75 4.0129V2.5Z'
              fill='#DCE4EB'
            />
            <path
              d='M22 12V14C22 14.2053 22 14.405 21.9998 14.5992C21.0368 13.4677 19.6022 12.75 18 12.75C15.1005 12.75 12.75 15.1005 12.75 18C12.75 19.6022 13.4677 21.0368 14.5992 21.9998C14.405 22 14.2053 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.8284C2 19.6569 2 17.7712 2 14V12C2 11.161 2 10.4153 2.0129 9.75H21.9871C22 10.4153 22 11.161 22 12Z'
              fill='#DCE4EB'
            />
          </svg>
        </div>
      </div>
      {showCalendar && (
        <div className={Style.calendarContainer} ref={calendarRef}>
          <Calendar
            date={date}
            onChange={(date) => {
              directlySetDate(date)
              setShowCalendar(false)
            }}
          />
        </div>
      )}
    </div>
  )
}

export const DateSelectionAlways: React.FC<DateSelectionProps> = ({ date, setDate }) => {
  const { isTarget: showCalendar, setIsTarget: setShowCalendar, ref: calendarRef } = useTarget(true)

  const directlySetDate = (date: Date) => {
    setDate(date)
  }

  return (
    <div className={Style.calendarWrapper}>
      <div className={Style.calendarContainer2} ref={calendarRef}>
        <Calendar
          date={date}
          onChange={(date) => {
            directlySetDate(date)
            setShowCalendar(false)
          }}
          displayMode='date'
          locale={pt}
          fixedHeight
          weekStartsOn={0}
        />
      </div>
    </div>
  )
}

type SelectConfig = {
  options: Array<{
    [key: string]: any
  }>
  nameKey: string
  optionValueKey: string
}

type SelectIntProps = {
  SelectConfig: SelectConfig
  setCurrentSelected: React.Dispatch<number>
  defaultValue?: number
}

export const SelectInt: React.FC<SelectIntProps> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
}) => {
  return (
    <div className={Style.contentWrapper}>
      <select
        onChange={(e) => {
          setCurrentSelected(Number(e.currentTarget.value))
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
      <div className={Style.svgIcon}>
        <svg width='20px' height='20px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
          <path d='M10 1L5 8h10l-5-7zm0 18l5-7H5l5 7z' />
        </svg>
      </div>
    </div>
  )
}

export const SelectIntCustom: React.FC<
  SelectIntProps & {
    selectedValue?: number | null
  }
> = ({ SelectConfig, setCurrentSelected, defaultValue, selectedValue }) => {
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <div className={Style.contentWrapper} ref={ref}>
      <CFalseText
        text={
          selectedValue
            ? SelectConfig.options.find(
                (option) => Number(option[SelectConfig.optionValueKey]) === selectedValue,
              )?.[SelectConfig.nameKey]
            : SelectConfig.options.find(
                (option) => Number(option[SelectConfig.optionValueKey]) === defaultValue,
              )?.[SelectConfig.nameKey] || 'Selecione'
        }
        onClick={() => setIsTarget(!isTarget)}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '8px',
          transform: 'translateY(-50%)',
        }}
      >
        <AngleUpIcon color={'white-90'} toggle={!isTarget} onClick={() => setIsTarget(!isTarget)} />
      </div>
      {isTarget && (
        <div className={Style.SICOptions}>
          {SelectConfig.options.map((element, index) => {
            return (
              <div
                key={`${element[SelectConfig.optionValueKey]}${index}`}
                onClick={() => {
                  setCurrentSelected(Number(element[SelectConfig.optionValueKey]))
                  setIsTarget(false)
                }}
                className={Style.SICItem}
              >
                <p className={Style.SICItemLabel}>{element[SelectConfig.nameKey]}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export const SelectIntCustomMini: React.FC<
  SelectIntProps & {
    selectedValue?: number | null
  }
> = ({ SelectConfig, setCurrentSelected, defaultValue, selectedValue }) => {
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <div className={Style.contentWrapper} ref={ref}>
      <CFalseTextMini
        text={
          selectedValue
            ? SelectConfig.options.find(
                (option) => Number(option[SelectConfig.optionValueKey]) === selectedValue,
              )?.[SelectConfig.nameKey]
            : SelectConfig.options.find(
                (option) => Number(option[SelectConfig.optionValueKey]) === defaultValue,
              )?.[SelectConfig.nameKey] || 'Selecione'
        }
        onClick={() => setIsTarget(!isTarget)}
      />
      <div
        style={{
          position: 'absolute',
          top: '56%',
          right: '4px',
          transform: 'translateY(-50%)',
        }}
      >
        <AngleUpIcon
          color={'white-90'}
          toggle={!isTarget}
          onClick={() => setIsTarget(!isTarget)}
          width={12}
        />
      </div>
      {isTarget && (
        <div className={Style.SICOptionsMini}>
          {SelectConfig.options.map((element, index) => {
            return (
              <div
                key={`${element[SelectConfig.optionValueKey]}${index}`}
                onClick={() => {
                  setCurrentSelected(Number(element[SelectConfig.optionValueKey]))
                  setIsTarget(false)
                }}
                className={Style.SICItemMini}
              >
                <p className={Style.SICItemLabelMini}>{element[SelectConfig.nameKey]}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type SelectIntStaticProps = {
  SelectConfig: SelectConfig
  setCurrentSelected: React.Dispatch<number>
  defaultValue?: number
}

export const SelectStaticInt: React.FC<SelectIntProps> = ({
  SelectConfig,
  setCurrentSelected,
  defaultValue,
}) => {
  return (
    <div className={Style.contentWrapper}>
      <select
        onChange={(e) => {
          setCurrentSelected(Number(e.currentTarget.value))
        }}
        defaultValue={defaultValue}
        value={0}
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
      <div className={Style.svgIcon}>
        <svg width='20px' height='20px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
          <path d='M10 1L5 8h10l-5-7zm0 18l5-7H5l5 7z' />
        </svg>
      </div>
    </div>
  )
}

type SelectNumberProps = {
  range: [number, number]
  padding?: number
  setCurrentSelected: React.Dispatch<number>
  defaultValue?: number
}

export const SelectNumber: React.FC<SelectNumberProps> = ({
  range,
  padding,
  setCurrentSelected,
  defaultValue,
}) => {
  return (
    <div className={Style.contentWrapper}>
      <select
        onChange={(e) => {
          setCurrentSelected(Number(e.currentTarget.value))
        }}
        defaultValue={defaultValue}
      >
        {Array.from({ length: range[1] - range[0] + 1 }, (_, i) => i + range[0]).map((element) => {
          return (
            <option value={element} key={element}>
              {padWithLeadingZeros(element, padding || element.toString().length)}
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

type SelectIntCardProps = {
  SelectConfig: SelectConfig
  setCurrentSelected: React.Dispatch<number[]>
  defaultValue?: number[]
  currentSelected: number[]
}

export const SelectIntCards: React.FC<SelectIntCardProps> = ({
  SelectConfig,
  setCurrentSelected,
  currentSelected,
  defaultValue,
}) => {
  return (
    <div className={Style.cardsWrapper}>
      <div className={Style.contentWrapper}>
        <select
          onChange={(e) => {
            setCurrentSelected([...currentSelected, Number(e.currentTarget.value)])
            e.currentTarget.value = '0'
          }}
          defaultValue={0}
        >
          <option value={0} disabled>
            Selecione
          </option>
          {SelectConfig.options
            .filter((element) => {
              if (currentSelected.includes(Number(element[SelectConfig.optionValueKey]))) {
                return false
              }
              return true
            })
            .map((element) => {
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
        <div className={Style.svgIcon}>
          <svg width='20px' height='20px' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
            <path d='M10 1L5 8h10l-5-7zm0 18l5-7H5l5 7z' />
          </svg>
        </div>
      </div>
      <div className={Style.selectedCards}>
        {currentSelected.map((element) => {
          const selectedElement = SelectConfig.options.find(
            (option) => Number(option[SelectConfig.optionValueKey]) === element,
          )
          if (!selectedElement) {
            return null
          }
          return (
            <div
              className={Style.selectedCard}
              key={`${selectedElement[SelectConfig.nameKey]}${
                selectedElement[SelectConfig.optionValueKey]
              }`}
            >
              <div className={Style.selectedCardName}>{selectedElement[SelectConfig.nameKey]}</div>
              <div
                className={Style.selectedCardRemove}
                onClick={() => {
                  setCurrentSelected(currentSelected.filter((id) => id !== element))
                }}
              >
                <svg
                  width='12px'
                  height='12px'
                  viewBox='0 0 24 24'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M20.7457 3.32851C20.3552 2.93798 19.722 2.93798 19.3315 3.32851L12.0371 10.6229L4.74275 3.32851C4.35223 2.93798 3.71906 2.93798 3.32854 3.32851C2.93801 3.71903 2.93801 4.3522 3.32854 4.74272L10.6229 12.0371L3.32856 19.3314C2.93803 19.722 2.93803 20.3551 3.32856 20.7457C3.71908 21.1362 4.35225 21.1362 4.74277 20.7457L12.0371 13.4513L19.3315 20.7457C19.722 21.1362 20.3552 21.1362 20.7457 20.7457C21.1362 20.3551 21.1362 19.722 20.7457 19.3315L13.4513 12.0371L20.7457 4.74272C21.1362 4.3522 21.1362 3.71903 20.7457 3.32851Z'
                    fill='#0F0F0F'
                  />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

type QueryInputIntProps = {
  query: string
  setQuery: React.Dispatch<string>
  data:
    | {
        [key: string]: any
      }[]
    | undefined
  labelKey: string
  valueKey: string
  infoKey?: string
  setValue: (value: number) => void
  label: string
}

export const QueryInputInt: React.FC<QueryInputIntProps> = ({
  query,
  setQuery,
  data,
  labelKey,
  setValue,
  valueKey,
  label,
  infoKey,
}) => {
  const { isTarget, ref, setIsTarget } = useTarget(false)
  return (
    <div className={Style.queryInputContainer} ref={ref}>
      <div className={Style.queryInputSearch}>
        <p>{label}</p>
        <input
          type='text'
          placeholder='Buscar por email...'
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onClick={() => setIsTarget(true)}
        />
      </div>
      {isTarget && (
        <div className={Style.queryResults}>
          {data &&
            data.length > 0 &&
            data.map((element) => {
              return (
                <div
                  key={element[valueKey]}
                  onClick={() => setValue(Number(element[valueKey]))}
                  className={Style.queryItem}
                >
                  <p className={Style.queryItemLabel}>{element[labelKey]}</p>
                  {infoKey && element[infoKey] && (
                    <p className={Style.queryItemInfo}>{element[infoKey]}</p>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}

export const SelectCustomQuery: React.FC<QueryInputIntProps> = ({
  query,
  setQuery,
  data,
  labelKey,
  setValue,
  valueKey,
  label,
  infoKey,
}) => {
  const { isTarget, ref, setIsTarget } = useTarget(false)

  return (
    <FlexColumn
      horizontalAlign='flex-start'
      verticalAlign='flex-start'
      styles={{ position: 'relative' }}
      ref={ref}
    >
      <FlexRow horizontalAlign='center' verticalAlign='center' gap='4px'>
        <CText
          type='text'
          placeholder={label}
          value={query}
          onChange={(e) => setQuery(e.currentTarget.value)}
          onClick={() => setIsTarget(true)}
        />
      </FlexRow>
      {isTarget && (
        <div className={Style.SICQOptions}>
          {data &&
            data.length > 0 &&
            data.map((element) => {
              return (
                <div
                  key={element[valueKey]}
                  onClick={() => setValue(Number(element[valueKey]))}
                  className={Style.SICQItem}
                >
                  <p className={Style.SICQItemLabel} title={element[labelKey]}>
                    {typeof element[labelKey] === 'string'
                      ? element[labelKey].length > 80
                        ? element[labelKey].slice(0, 80) + '...'
                        : element[labelKey]
                      : element[labelKey].toString()}
                  </p>
                  {infoKey && element[infoKey] && (
                    <p className={Style.SICQqueryItemInfo} title={element[infoKey]}>
                      {typeof element[infoKey] === 'string'
                        ? element[infoKey].length > 70
                          ? element[infoKey].slice(0, 70) + '...'
                          : element[infoKey]
                        : element[infoKey].toString()}
                    </p>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </FlexColumn>
  )
}
