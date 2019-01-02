export class UserSession {

    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(id?: string, name?: string, password?: string) {

        this.id = id;
        this.name = name;
        this.password = password;
    }
    public id?: string;
    public name: string;
    public password: string;
}

export class UserLogin {

    constructor(name?: string, password?: string) {
        this.UserName = name;
        this.Password = password;
    }
    UserName: string;
    Password: string;
}
