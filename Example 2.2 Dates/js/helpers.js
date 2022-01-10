function toISODate(datetime) {
    return datetime.toISOString().substring(0, 10);
}

function getRusEnding(value, wordSingle, wordFew, wordMany) {
    value = +value;
    if (isNaN(value)) return wordMany;
    const lastDigit = value % 10;
    const lastTwoDigits = value % 100;
    if (lastDigit === 1 && lastTwoDigits !== 11) {
        return wordSingle;
    }
    if (between(lastDigit, 2, 4) && !between(lastTwoDigits, 12, 14)) {
        return wordFew;
    }
    return wordMany;
}

function getRusDays(value) {
    return getRusEnding(value, "день", "дня", "дней");
}

function getRusWeeks(value) {
    return getRusEnding(value, "неделя", "недели", "недель");
}

function getRusMonths(value) {
    return getRusEnding(value, "месяц", "месяца", "месяцев");
}

function getRusYears(value) {
    return getRusEnding(value, "год", "года", "лет");
}

function getRusWeekDay(date) {
    return new Date(date).toLocaleString("ru-RU", { weekday: "long" });
}

function getPeriodsBetweenDates(startDate, endDate, includeEndDate) {
    if (!(startDate instanceof Date)) {
        startDate = new Date(startDate);
    }
    if (!(endDate instanceof Date)) {
        endDate = new Date(endDate);
    }
    includeEndDate = !!includeEndDate;
    if (!endDate || !startDate) {
        console.error(
            "getPeriodsBetweenDates: Входные данные не сводятся к датам."
        );
        return;
    }
    startDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
    );
    endDate = new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate()
    );

    const fullDays =
        millisecondsToFullDays(endDate - startDate) + includeEndDate;
    const fullWeeks = Math.trunc(fullDays / 7);
    const weekDays = fullDays % 7;
    const fullMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        endDate.getMonth() -
        startDate.getMonth() -
        (endDate.getDate() < startDate.getDate());
    const monthDays =
        millisecondsToFullDays(
            endDate - startDate.setMonth(startDate.getMonth() + fullMonths)
        ) + includeEndDate;

    return {
        days: fullDays,
        weeks: { weeks: fullWeeks, days: weekDays },
        months: { months: fullMonths, days: monthDays },
        years: {
            years: Math.trunc(fullMonths / 12),
            months: fullMonths % 12,
            days: monthDays,
        },
    };
}

function millisecondsToFullDays(ms) {
    return Math.trunc(ms / (24 * 60 * 60 * 1000));
}

function between(value, min, max) {
    return min <= value && max >= value;
}