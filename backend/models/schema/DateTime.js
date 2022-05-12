'use strict';

class DateTime{
    constructor(year, month, day, hour, minute, second){
        this.year = year; 
        this.month = month; 
        this.day = day; 
        this.hour = hour; 
        this.minute = minute;
        this.second = second;
        // this.timezone = timezone; 
    }
}

module.exports = DateTime;
