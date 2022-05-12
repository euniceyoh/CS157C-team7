'use strict';

class Person{
    constructor(name, email, gender, dob, imgurl, password){
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.dob = dob;
        this.imgurl = imgurl;
        this.password = password;
    }
}

module.exports = Person;