import {createClient} from '@supabase/supabase-js'
import { type Database } from '../../types/supabase'
const supabaseUrl = import.meta.env.VITE_SUPABASE_PROJECT as string
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string
export const supabase = createClient<Database>(supabaseUrl, supabaseKey)