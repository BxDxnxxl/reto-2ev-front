export interface UserDto { 
    constructor(
        id: number,
        username: string,
        nombre: string,
        apellido1: string,
        apellido2?: string,
        profilepic?: string
    )
}