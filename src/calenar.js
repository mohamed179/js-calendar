class Calendar {
    
    constructor (options) {
        if (options) {
            if (options.startDate) {
                Calendar.drawCalendar(
                    Calendar.addCalendar(options),
                    options.startDate.month,
                    options.startDate.year
                );
            } else {
                Calendar.drawCalendar(
                    Calendar.addCalendar(options),
                    Calendar.currentMonth(),
                    Calendar.currentYear()
                );
            }
        }
    }

    static addCalendar (options) {
        const new_calendar = new Calendar();
        new_calendar._options = options;
        this._calendars.push(new_calendar);
        return this._calendars.length - 1;
    }

    static brevious (event) {
        let btn = event.target;
        let container = btn.parentElement.parentElement;
        let table = container.getElementsByTagName('table')[0];
        
        let calendar_idx = table.getAttribute('data-calendar');
        let month = table.getAttribute('data-month');
        let year = table.getAttribute('data-year');
        let date = Calendar.monthBefore(month, year);
        month = date.getMonth();
        year = date.getFullYear();
        Calendar.drawCalendar(calendar_idx, month, year);
    }

    static next () {
        let btn = event.target;
        let container = btn.parentElement.parentElement;
        let table = container.getElementsByTagName('table')[0];
        
        let calendar_idx = table.getAttribute('data-calendar');
        let month = table.getAttribute('data-month');
        let year = table.getAttribute('data-year');
        let date = Calendar.monthAfter(month, year);
        month = date.getMonth();
        year = date.getFullYear();
        Calendar.drawCalendar(calendar_idx, month, year);
    }

    static drawCalendar (calendar_idx, month, year) {
        const options = this._calendars[calendar_idx]._options;
        const calendar_array = Calendar.formCalendarArray(month, year);

        if (Calendar.isCurrentMonth(month, year)) {
            const today_idx = Calendar.findTodayIdx(Calendar.currentDay(), calendar_array);
            render_calendar(options, calendar_array, calendar_idx, month, year, today_idx);
        } else {
            render_calendar(options, calendar_array, calendar_idx, month, year);
        }
    }

    static currentDay () {
        return new Date().getDate();
    }

    static currentMonth () {
        return new Date().getMonth();
    }

    static currentYear () {
        return new Date().getFullYear();
    }

    static currentDate () {
        var dateObj = new Date();
        var month = dateObj.getMonth() + 1; //months from 1-12
        var day = dateObj.getDate();
        var year = dateObj.getFullYear();
        return year + "/" + month + "/" + day;
    }

    static isCurrentDay (day, month, year) {
        return day == Calendar.currentDay()
        && month == Calendar.currentMonth()
        && year == Calendar.currentYear();
    }

    static isCurrentMonth (month, year) {
        return month == Calendar.currentMonth()
        && year == Calendar.currentYear();
    }

    static isCurrentYear (year) {
        return year == Calendar.currentYear();
    }

    static firstDayOfMonth (month, year) {
        return new Date(year, month, 1);
    }

    static lastDayOfMonth (month, year) {
        return new Date(year, month + 1, 0);
    }

    static dayBefore (day, month = null, year = null) {
        if (!(day instanceof Date)) {
            day = new Date(year, month, day);
        }

        var d_before = new Date(day.getFullYear(), day.getMonth(), day.getDate() - 1);
        return d_before;
    }

    static dayAfter (day, month, year) {
        if (!(day instanceof Date)) {
            day = new Date(year, month, day);
        }

        var d_after = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1);
        return d_after;
    }

    static monthBefore (month, year) {
        let date = new Date(year, month, 1);
        date.setMonth(date.getMonth() - 1);
        return date;
    }

    static monthAfter (month, year) {
        let date = new Date(year, month, 1);
        date.setMonth(date.getMonth() + 1);
        return date;
    }

    static formCalendarArray (month, year) {
        let calendar_array = [];
        
        let fd = Calendar.firstDayOfMonth(month, year).getDate(); // first day
        let fd_order = Calendar.firstDayOfMonth(month, year).getDay(); // first day order in its week
        let ld = Calendar.lastDayOfMonth(month, year).getDate(); // last day
        let ld_order = Calendar.lastDayOfMonth(month, year).getDay(); // last day order in its week
        
        // before month
        if (fd_order > 0) {
            let lm_fd = Calendar.dayBefore(fd, month, year).getDate();
            for (let i = 1; i <= fd_order; i++) {
                calendar_array.push(lm_fd - fd_order + i);
            }
        }

        // month
        for (let i = 1; i <= ld; i++) {
            calendar_array.push(i);
        }

        // after month
        if (ld_order < 6) {
            for (let i = 1; i <= 6 - ld_order; i++) {
                calendar_array.push(i);
            }
        }

        return calendar_array;
    }

    static findTodayIdx (day, calendar_array) {
        let start = calendar_array.indexOf(1);
        for (let idx = start; idx < calendar_array.length; idx++) {
            if (calendar_array[idx] == day) {
                return idx;
            }
        }
    }
}

Calendar._calendars = [];

const render_calendar = (options, calendar_array, calendar_idx, month, year, today_idx = -1) => {
    let controllers = render_calendar_controllers(month, year);
    let table = render_calendar_table(options, calendar_array, calendar_idx, month, year, today_idx);

    let container_list = document.querySelectorAll(options.selector);
    for (let i = 0; i < container_list.length; i++) {
        let container = container_list[i];
        container.classList.add("calendar_container");
        container.innerHTML = controllers + table;
    }
}

const render_calendar_controllers = (month, year) => {
    let controllers = '<div>';
    controllers += '<button onclick="Calendar.brevious(event)">brevious</button> ';
    month = new Date(year, month, 1).toLocaleString('default', { month: 'short' });
    controllers += '<span>' + month + '/' + year + '</span>';
    controllers += ' <button onclick="Calendar.next()">next</button>';
    controllers += '</div>';
    return controllers;
}

const render_calendar_table = (options, calendar_array, calendar_idx, month, year, today_idx) => {
    let table = '<table data-month="' + month + '" data-year="' + year + '" data-calendar="' + calendar_idx + '">'
    table += '<thead><tr><th>SUN</th><th>MON</th><th>TUE</th><th>WED</th><th>THU</th><th>FRI</th><th>SAT</th></tr></thead>';
    table += '<tbody>';
    let rows = calendar_array.length / 7;
    let day_idx = 0;
    for (let row = 0; row < rows; row++) {
        table += '<tr>';
        for (let day = 0; day < 7; day++) {
            if (day_idx == today_idx) {
                table += '<td class="calendar_today"><div>' + calendar_array[day_idx++] + '</div></td>';
            } else {
                table += '<td><div>' + calendar_array[day_idx++] + '</td>';
            }
        }
        table += '</tr>';
    }
    table += '</tbody>';
    table += '</table>';
    return table;
}