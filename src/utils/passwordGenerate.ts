//funcion para generar una contrasena
export default function generatePassword(length: number){
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%*&";
    let passwordGenerate = "";

    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * chars.length);
       //otra manera de hacerlo seria chars.charAt(Math.floor(Math.ramdom() * chars.length))
        passwordGenerate+= chars[randomIndex];
    }
    return passwordGenerate;
}