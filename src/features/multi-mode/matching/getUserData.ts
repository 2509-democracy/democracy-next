export let userData: any;

export function getUserData(payload: any){
    userData= payload.new;
    return userData;
}