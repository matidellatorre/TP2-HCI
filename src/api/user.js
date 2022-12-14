import { Api } from "./api.js";

export { UserApi, Credentials, User, Verification}

class UserApi {
    static getUrl(slug) {
        return `${Api.baseUrl}/users${ slug ? `/${slug}` : ""}`;
    }

    static async login(credentials, controller) {
        return await Api.post(UserApi.getUrl('login'), false, credentials, controller);
    }

    static async logout(controller) {
        await Api.post(UserApi.getUrl('logout'), true, controller);
    }

    static async get(controller) {
        return Api.get(UserApi.getUrl('current'), true, controller);
    }

    static async create(user, controller) {
        return await Api.post(UserApi.getUrl(''),true, user, controller);
    }

    static async verify(verification, controller) {
        return await Api.post(UserApi.getUrl('verify_email'),true, verification, controller);
    }

    static async modify(user, controller) {
        return await Api.put(UserApi.getUrl('current'),true, user, controller);
    }

}

class Credentials {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
}

class User {
    constructor(name, username, email, password) {
        this.username = username;
        this.password = password;
        this.firstName = name;
        this.lastName = "";
        this.gender = "male";
        this.birthdate = 0;
        this.email = email;
        this.phone = "0";
        this.avatarUrl = "http://i.ibb.co/5k11H8c/avatar.png";
        this.metadata = null;
    }
}

class Verification {
    constructor(email, code) {
        this.email = email;
        this.code = code;
    }
}