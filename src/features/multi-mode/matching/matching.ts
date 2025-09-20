import { supabase } from '@/features/multi-mode/supabase'
import { getUserData } from './getUserData';

export const channelA = supabase
    .channel('schema-db-changes')
    .on(
        'postgres_changes',
        {
            event: '*',
            schema: 'public',
        },
        (payload) => {
            console.log(payload);
            if (payload.table === 'room' && payload.eventType === 'INSERT'){
                if (checkTrueUser(getUserData(payload))){
                    //ここにtsxを用いた遷移処理を実装するべきである
                }
            }

        }
    )
    .subscribe()

export let user_id: string;

export async function insertUser() {
    user_id = crypto.randomUUID();
    const { error } = await supabase
        .from('waitList')
        .insert({ user_id })
    console.log(user_id)
}

function checkTrueUser(userData: any){
    console.log("aaa",userData.users)
    console.log("user_id: " ,user_id)
    if (userData.users.includes(user_id)){
        return true;
    } 
    return false;
}
