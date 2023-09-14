import { addDays, lastDayOfMonth, setHours, subDays } from 'date-fns'

const getMondayNSaturdayInWeek = (d: Date) => {
  const mon = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay())
  const sat = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate() + (5 - d.getDay() + 1)
  )

  return [mon, sat]
}

const getStartNEndDateOfMonth = (d: Date) => {
  return [new Date(d.getFullYear(), d.getMonth(), 1), lastDayOfMonth(d)]
}

export const to23h59m = (d: Date) => {
  d.setHours(23)
  d.setMinutes(59)
  d.setSeconds(0)
}
export const to00h00m = (d: Date) => {
  d.setHours(-1)
}

type DateStringResult = {
  startDate: Date | null
  endDate: Date | null
}
export const fromDateStringToDateObject = (
  operator: string,
  dateStr: string
): DateStringResult => {
  const config: DateStringResult = { startDate: null, endDate: null }
  const today = new Date()
  to00h00m(today)

  console.log('operator', operator)

  if (dateStr === 'yesterday') {
    if (operator === '=') {
      const yesterday = subDays(new Date(), 1)
      const morningYesterday = setHours(yesterday, -1)
      const lastNight = setHours(yesterday, 23)

      config.startDate = morningYesterday
      config.endDate = lastNight
      // config.startDate = new Date(2023, 7, 21, 0, 0, 0)
      // config.endDate = new Date(2023, 7, 21, 23, 59, 0)
    }
  }

  if (dateStr === 'tomorrow') {
    if (operator === '=') {
      const yesterday = addDays(new Date(), 1)
      const morningYesterday = setHours(yesterday, -1)
      const lastNight = setHours(yesterday, 23)

      config.startDate = morningYesterday
      config.endDate = lastNight
      // config.startDate = new Date(2023, 7, 21, 0, 0, 0)
      // config.endDate = new Date(2023, 7, 21, 23, 59, 0)
    }
  }

  if (dateStr === 'today') {
    if (operator === '=') {
      const endDay = new Date()
      to23h59m(endDay)
      config.startDate = today
      config.endDate = endDay

      console.log('endday', endDay)
    }

    if (operator === '<') {
      // must -- date cuz the query on server side is <=
      const yesterday = subDays(today, 1)
      config.startDate = null
      config.endDate = yesterday
    }

    if (operator === '>') {
      // must +1 date cuz the query on server side is >=
      to23h59m(today)
      config.startDate = today
      config.endDate = null
    }
  }

  if (['week', 'this-week'].includes(dateStr)) {
    const [mon, sat] = getMondayNSaturdayInWeek(new Date())

    if (operator === '=') {
      config.startDate = mon
      config.endDate = sat
    }

    if (operator === '>') {
      to23h59m(sat)
      config.startDate = sat
      config.endDate = null
    }

    if (operator === '<') {
      // must -- date cuz the query on server side is <=
      to00h00m(mon)
      config.startDate = null
      config.endDate = mon
    }
  }

  if (['month', 'this-month'].includes(dateStr)) {
    const [firstDate, lastDate] = getStartNEndDateOfMonth(new Date())

    to00h00m(firstDate)
    to23h59m(lastDate)
    if (operator === '=') {
      config.startDate = firstDate
      config.endDate = lastDate
    }

    if (operator === '>') {
      config.startDate = lastDate
      config.endDate = null
    }

    if (operator === '<') {
      config.startDate = null
      config.endDate = firstDate
    }
  }

  if (['prev-month'].includes(dateStr)) {
    const date = new Date()
    const lastDateOfPrevMonth = new Date(
      date.getFullYear(),
      date.getMonth(),
      1,
      0,
      0,
      0
    )
    lastDateOfPrevMonth.setDate(lastDateOfPrevMonth.getDate() - 1)

    config.startDate = new Date(
      date.getFullYear(),
      date.getMonth() - 1,
      1,
      0,
      0,
      0
    )
    config.endDate = lastDateOfPrevMonth
  }

  return config
}