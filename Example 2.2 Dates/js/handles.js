let startDate;
let endDate;
let includeEndDate;

function handleLoad() {
    let today = new Date();

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    startDateInput.value = toISODate(today);
    endDateInput.value = toISODate(tomorrow);
    includeEndDate = includeEndDateInput.checked;
    handleStartDateChange();
    handleEndDateChange();
    handleIncludeEndDateChange();
}

function handleStartDateChange() {
    if (startDateInput.value == startDate) {
        return;
    }

    startDate = startDateInput.value;
    startDateWeekday.innerText = getRusWeekDay(startDate);
    updatePeriods();
}

function handleEndDateChange() {
    if (endDateInput.value == endDate) {
        return;
    }

    endDate = endDateInput.value;
    endDateWeekday.innerText = getRusWeekDay(endDate);
    updatePeriods();
}

function handleIncludeEndDateChange() {
    if (includeEndDateInput.checked == includeEndDate) {
        return;
    }

    includeEndDate = includeEndDateInput.checked;
    updatePeriods();
}

function updatePeriods() {
    const periods = getPeriodsBetweenDates(startDate, endDate, includeEndDate);

    daysInput.value = periods.days;
    daysLabel.innerText = getRusDays(periods.days);

    weeksInput.value = periods.weeks.weeks;
    weeksLabel.innerText = getRusWeeks(periods.weeks.weeks);
    weekDaysInput.value = periods.weeks.days;
    weekDaysLabel.innerText = getRusDays(periods.weeks.days);

    monthsInput.value = periods.months.months;
    monthsLabel.innerText = getRusMonths(periods.months.months);
    monthDaysInput.value = periods.months.days;
    monthDaysLabel.innerText = getRusDays(periods.months.days);

    yearsInput.value = periods.years.years;
    yearsLabel.innerText = getRusYears(periods.years.years);
    yearMonthsInput.value = periods.years.months;
    yearMonthsLabel.innerText = getRusMonths(periods.years.months);
    yearDaysInput.value = periods.years.days;
    yearDaysLabel.innerText = getRusDays(periods.years.days);
}