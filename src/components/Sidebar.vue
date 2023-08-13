<script setup lang="ts">
import { userSessionStore } from '@/stores/userSessions';
import { whiteboardsLocalStore } from '@/stores/whiteboardsLocalData';
import { supabase } from '@/services/supabase';
import { ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';

const whiteboards = ref()
const open = ref(true)
const title = ref('')
const router = useRouter()

// initialize the userSession store
const userSession = userSessionStore()
const whiteboardsLocal = whiteboardsLocalStore()
// listen for auth events (e.g. sign in, sign out, refresh)
// set session based on the auth event
async function createWhiteboard() {
  userSession.getUserPreferences().then(async () => {
    if (userSession.defaultTitle && userSession.defaultTitle.length > 0) {
      title.value = userSession.defaultTitle
    }
    const { data, error } = await supabase
    .from('Whiteboards')
    .insert([
      { title: title.value, user_id: userSession.session.user.id },
    ]);
    getUserWhiteboards()
  })


  // Clear the input fields after adding the note
}

async function getUserWhiteboards() {
  const { data, error } = await supabase
    .from('Whiteboards')
    .select('*')
    .eq('user_id', userSession.session.user.id)

  if (error) {
    console.error('Error getting whiteboards:', error);
    return;
  }

  console.log('Whiteboards retrieved successfully:', data);
  whiteboards.value = data
  whiteboardsLocal.whiteboards = data
  return true
}
watchEffect(async () => {
  if (userSession.session) {
    await getUserWhiteboards()
  }
})

async function deleteWhiteboard(index: string | number) {
  const { data, error } = await supabase
    .from('Whiteboards')
    .delete()
    .eq('id', whiteboardsLocal.whiteboards[index].id)
  getUserWhiteboards()
}

// subscribe to whiteboardsLocal.whiteboards
// when it changes, update the whiteboards ref
function test(e: { target: { id: any; }; preventDefault: () => void; }) {
  deleteWhiteboard(e.target.id)
  e.preventDefault();
}
</script>

<template>
    <o-sidebar
      :fullheight="true"
      v-model:open="open"
      position="static"
      :expand-on-hover="true"
    >
        <p>Yet Another Whiteboard</p>
        <span id="whiteboards" v-if="whiteboards">
            <div v-for="(paragraph, index) in whiteboards" :key="paragraph.id">
                <router-link :id="index" @contextmenu="test" :to="{ name: 'whiteboards', params: { id: paragraph.id } }">{{ paragraph.title }}</router-link>
            </div>
        </span>
        <footer>
            <o-button outlined @click="createWhiteboard()" v-if="userSession.session" >Create new whiteboard</o-button>
            <o-button v-else tag="router-link" to="/login">Login or Register</o-button>
            <span id="icons" v-if="userSession.session">
                <o-icon clickable v-if="userSession.session" size="medium" icon="right-from-bracket" @click="supabase.auth.signOut()"/>
                <o-icon clickable size="medium" icon="gear" @click="router.push('/settings')"/>
                <o-icon clickable size="medium" icon="circle-question" @click="router.push('/help')"/>
            </span>
        </footer>
  </o-sidebar>
</template>

<style scoped>
footer {
    position: relative;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-direction: column;
}

#icons {
    margin-top: 20px;
    display: flex;
    justify-content: space-evenly;
    width: 100%;
    align-items: center;
}

#whiteboards {
    display: block;
    width: 100%;
    font-size: large;
    text-align: center;
    flex-grow: 1; 
    overflow-y: auto;
}

::-webkit-scrollbar {
    display: none;
}
#whiteboards a {
    text-decoration: none;
    display: block;
    color: #131c44;
    background-color: #ef4b69;
    width: 100%;
    padding: 10px;
    transition: 0.2s;
}

#whiteboards a:hover {
    background-color: transparent;
    color:#ef4b69;
    transition: 0.2s;
}

footer {
  margin: 20px 0px;
}
p {
  text-align: center;
  margin: 20px 0px;
  font-weight: 500;
}
</style>