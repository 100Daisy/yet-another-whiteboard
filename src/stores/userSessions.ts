import { defineStore } from 'pinia'
import { supabase } from '../services/supabase'

type State = {
  session: any
  defaultTitle: string | null
}

export const userSessionStore = defineStore({
  id: 'userSession',
  state: (): State => ({
    session: null,
    defaultTitle: 'Title'
  }),
  actions: {
    async getUserPreferences() {
      const { data, error } = await supabase
        .from('UserPreferences')
        .select('*')
        .eq('id', this.session.user.id);

      if (error) {
        // Handle the error, such as logging or showing a user-friendly error message.
        console.error('Error fetching user preferences:', error);
        return;
      }

      if (data && data.length > 0) {
        this.defaultTitle = data[0].title;
        console.log(this.defaultTitle);
      } else {
        // Handle the case when data is null or empty.
        // For example, you can set a default value or show a user-friendly message.
        this.defaultTitle = 'Default Title';
        console.warn('User preferences not found. Using default title.');
      }
    },
  }
})