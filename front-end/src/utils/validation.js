module.exports = {
    validateEmail: function (email) {
        let re = /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },
    validatePassword: function (password) {
        let re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        return re.test(password);
    },
    validateUsername: function (username) {
        let re = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
        return re.test(username)
    },
    validateName: function (name) {
        let re = /^(?=.{1,20}$)[a-z]+(?:['_.\s][a-z]+)*$/i;
        return re.test(name);
    }
}