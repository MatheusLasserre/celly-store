import { Decimal } from "@prisma/client/runtime/library";

export const validatePasswordRegex = (password: string): { valid: boolean, error?: string } => {
    const minLength = 8;
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numberRegex = /[0-9]/;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    if (password.length < minLength) {
        return { valid: false, error: 'Sua senha deve ter no mínimo 8 caracteres.' };
    }

    if (!lowercaseRegex.test(password)) {
        return { valid: false, error: 'Sua senha precisa conter letras minúsculas, maiúsculas, números e caracteres especiais.(minuscula)' };
    }

    if (!uppercaseRegex.test(password)) {
        return { valid: false, error: 'Sua senha precisa conter letras minúsculas, maiúsculas, números e caracteres especiais.(maiuscula)' };
    }

    if (!numberRegex.test(password)) {
        return { valid: false, error: 'Sua senha precisa conter letras minúsculas, maiúsculas, números e caracteres especiais.(número)' };
    }

    if (!specialCharRegex.test(password)) {
        return { valid: false, error: 'Sua senha precisa conter letras minúsculas, maiúsculas, números e caracteres especiais.(caractere especial)' };
    }

    return { valid: true };
}

export const formatCnpj = (cnpj: string) => {
    const stripedCnpj = cnpj.replace(/[^0-9]/g, '')
    return [...stripedCnpj].map((char, index) => {
        if (index === 1 && stripedCnpj.length >= 3) return `${char}.`
        if (index === 4 && stripedCnpj.length >= 6) return `${char}.`
        if (index === 7 && stripedCnpj.length >= 9) return `${char}/`
        if (index === 11 && stripedCnpj.length >= 13) return `${char}-`
        return char
    }
    ).join('')
}

export const formatPhone = (phone: string) => {
    const stripedPhone = phone.replace(/[^0-9]/g, '')
    return [...stripedPhone].map((char, index) => {
        if (index === 0 && stripedPhone.length >= 3) return `(${char}`
        if (index === 1 && stripedPhone.length >= 3) return `${char}) `
        return char
    }
    ).join('')

}

export const formatCpf = (cnpj: string) => {
    const stripedCpf = cnpj.replace(/[^0-9]/g, '')
    return [...stripedCpf].map((char, index) => {
        if (index === 2 && stripedCpf.length >= 4) return `${char}.`
        if (index === 5 && stripedCpf.length >= 7) return `${char}.`
        if (index === 8 && stripedCpf.length >= 10) return `${char}-`
        return char
    }
    ).join('')
}

export const stripCpf = (cpf: string) => {
    return cpf.replace(/[^0-9]/g, '')
}

export const validateCPF = (cpf: string) => {
    const strippedCpf = stripCpf(cpf)
    if(strippedCpf.length !== 11) return {
        valid: false,
        error: 'O CPF deve ter 14 dígitos'
    }
    const firstDigit = strippedCpf[9]
    const secondDigit = strippedCpf[10]

    const calculateFirstDigit = (cpf: string) => {
        let sum = 0
        for(let i = 0; i < 9; i++) {
            sum += Number(cpf[i]) * (10 - i)
        }
        const rest = sum % 11
        return rest < 2 ? 0 : 11 - rest
    }

    const calculateSecondDigit = (cpf: string) => {
        let sum = 0
        for(let i = 0; i < 10; i++) {
            sum += Number(cpf[i]) * (11 - i)
        }
        const rest = sum % 11
        return rest < 2 ? 0 : 11 - rest
    }

    const firstDigitCalculated = calculateFirstDigit(strippedCpf)
    const secondDigitCalculated = calculateSecondDigit(strippedCpf)
    if(firstDigitCalculated !== Number(firstDigit)) return {
        valid: false,
        error: 'O CPF é inválido'
    }
    if(secondDigitCalculated !== Number(secondDigit)) return {
        valid: false,
        error: 'O CPF é inválido'
    }

    return {
        valid: true,
        error: null
    }
    
}

export const NumberWithoutCommasAndDots = (value: string) => {
    return value.replace(/[^0-9]/g, '')
}


export const FormatNumberMask = (value: number | Decimal, AppendCurrency?:string) => {
    let mystring = NumberWithoutCommasAndDots(parseFloat((Number(value) * 100).toFixed(2)).toString());
    // const last2digits = mystring.length >= 3 ? [',', mystring.slice(-2)].join('') : [mystring].join('');
    const last2digits = mystring.length >= 3 ? [',', mystring.slice(-2)].join('') : mystring.length === 2 ? ['0,', mystring].join('') : ['0,0', mystring].join('');
    mystring = mystring.slice(0, -2);
    const dotsQuantity = Math.floor((mystring.length - 1) / 3);
    for (let i = 1; i < dotsQuantity + 1; i++) {
        const insertPosition = NumberWithoutCommasAndDots(mystring).length - (3 * i);
        mystring = [mystring.slice(0, insertPosition), '.', mystring.slice(insertPosition)].join('');
    }
    const prefix = Number(value) < 0 ? '-' : '';
    mystring = [prefix, mystring, last2digits].join('');
    if(AppendCurrency) {
        mystring = [AppendCurrency, ' ', mystring].join('');
    }
    return mystring;
}

export const NumberStringToNumber = (value: string) => {
    const strippedNumber = value.replace(/[^0-9]/g, '')
    return Number(strippedNumber)/100
}

export const handleValueInputChange = (stringNumber: string, previousValue: string | number) => {
    if (stringNumber === "-") {
        return ''
    }
    if (stringNumber === "") {
        return ''
    }
    if (!isNumeric(stringNumber) || stringNumber === ' ' || stringNumber.includes(' ')) {
        return typeof previousValue === 'string' ? previousValue : FormatNumberMask(previousValue)
    }
   
    let mystring = NumberWithoutCommasAndDots(stringNumber);
    const stringLength = mystring.length;
    if(stringLength > 3) {
        mystring = parseFloat(mystring).toString()
    }
    const last2digits = mystring.length >= 3 ? [',', mystring.slice(-2)].join('') : mystring.length === 2 ? ['0,', mystring].join('') : ['0,0', mystring].join('');
    
    mystring = mystring.slice(0, -2);
    const dotsQuantity = Math.floor((mystring.length - 1) / 3);
    for (let i = 1; i < dotsQuantity + 1; i++) {
        const insertPosition = NumberWithoutCommasAndDots(mystring).length - (3 * i);
        mystring = [mystring.slice(0, insertPosition), '.', mystring.slice(insertPosition)].join('');
    }

    mystring = [mystring, last2digits].join('');
    
    return mystring;
}

export const padWithLeadingZeros = (num: number | string, totalLength: number) => {
    return String(num).padStart(totalLength, '0');
}

export const isNumeric = (num: number | string) => {
    const NumberWithoutCommasAndDots = String(num).replace(/[^0-9]/g, '')
    const number = Number(NumberWithoutCommasAndDots)
    return !isNaN(number)
}

export const minutesToString = (timecost: number) => {
    if (timecost < 60) {
        return `${timecost} minutos`
    }

    const hoursInTimecost = Math.floor(timecost / 60)
    const minutesInTimecost = Math.floor(timecost - (hoursInTimecost * 60));

    const hourString = hoursInTimecost > 1 ? `${hoursInTimecost} horas` : `${hoursInTimecost} hora`

    return `${hourString} e ${minutesInTimecost} minutos`
}

export const minutesToHourString = (minutes: number) => {
    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60
    const hourString = hour < 10 ? `0${hour}` : `${hour}`
    const minuteString = minute < 10 ? `0${minute}` : `${minute}`

    return `${hourString}:${minuteString}`
}