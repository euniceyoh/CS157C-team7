'use strict';

class Person{
    constructor(name, email, gender, dob, imgurl, password){
        this.name = name;
        this.email = email;
        this.gender = gender;
        this.dob = dob;
        this.imgurl = imgurl;
        this.password = password;

    constructor(id, name, gender, dob){
        this.id = id;
        this.name = name;
        this.gender = gender;
        this.dob = dob;

    }
}

module.exports = Person;