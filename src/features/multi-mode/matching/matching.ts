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