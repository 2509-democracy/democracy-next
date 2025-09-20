import { supabase } from '@/features/multi-mode/supabase'

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
        }
    )
    .subscribe()

export async function insertUser() {
    const user_id = crypto.randomUUID();
    const { error } = await supabase
        .from('waitList')
        .insert({ user_id })
    console.log(user_id)
}