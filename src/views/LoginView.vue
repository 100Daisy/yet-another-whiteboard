<script setup lang="ts">
import { ref } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { useRouter } from 'vue-router'
import Swal from 'sweetalert2'

const router = useRouter()
const email = ref('')
const password = ref('')
const isLoading = ref(false)

const isLogin = ref(true)
const isRecovery = ref(false)

function setMode(mode: string) {
  switch (mode) {
    case 'register':
      isLogin.value = false
      isRecovery.value = false
      break
    case 'recovery':
      isLogin.value = false
      isRecovery.value = true
      break
    case 'login':
      isLogin.value = true
      isRecovery.value = false
      break
  }
}
// Create a single supabase client for interacting with your database
const supabase = createClient('https://fibzvyznxpuacoqeqmem.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYnp2eXpueHB1YWNvcWVxbWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyNzQ3OTUsImV4cCI6MjAwNDg1MDc5NX0.o0J0z57q7o7gfuuCKdLovv0sLH9zPDpgoldz130IVyk')
// sign in supabase
async function signIn(email: string, password: string) {
  isLoading.value = true
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  })
  if (data.user) {
    router.push('/')
  }
  isLoading.value = false
}

async function loginSocial(provider: any) {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider,
    options: {
    queryParams: {
      access_type: 'offline',
      prompt: 'consent',
    },
  },
  })
  
  console.log(data)
}

async function resetPassword() {
  await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: 'https://yet-another-whiteboard.vercel.app/settings?focus=password',
  }).then(async (data) => {
    if (data.error) {
      await Swal.fire({
        title: "Error",
        text: data.error as unknown as string,
        icon: "error",
      })
      return
    }
    await Swal.fire({
      title: "Success",
      text: "Reset password email has been sent!",
      icon: "success",
    })
  })
}

async function registerUser() {
  await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  }).then(async (data) => {
    if (data.error) {
      await Swal.fire({
        title: "Error",
        text: data.error as unknown as string,
        icon: "error",
      })
      return
    }
    await Swal.fire({
      title: "Done !",
      text: "Check your email to verify your account.",
      icon: "success",
    })
  })
}
</script>

<template>
  <main>
    <section id="total">
      <section id="form">
        <o-field label="Email">
          <o-input type="email" v-model="email" maxlength="30"> </o-input>
        </o-field>
          <o-field label="Password" >
          <o-input :disabled="isRecovery" v-model="password" type="password" maxlength="30"></o-input>
        </o-field>
      </section>
      <footer>
        <o-button :loading="isLoading" v-if="isRecovery" @click="resetPassword()">Reset password</o-button>
        <o-button :loading="isLoading" v-else-if="isLogin" @click="signIn(email, password)">Login</o-button>
        <o-button :loading="isLoading" v-else @click="registerUser()">Register</o-button>
          <span>
            <a @click="setMode('recovery')">Password?</a>
            <a v-if="isLogin" @click="setMode('register')">Sign Up</a>
            <a v-else @click="setMode('login')">Log in</a>
          </span>
          <hr>
      </footer>
      <div id="thirdparty">
        <o-icon clickable @click="loginSocial('google')" pack="fab" size=medium icon="google"/>
        <o-icon clickable @click="loginSocial('facebook')" pack="fab" size=medium icon="facebook"/>
        <o-icon clickable @click="loginSocial('github')" pack="fab" size=medium icon="github"/>
      </div>
    </section>
    <section style="text-align: center; margin-top: 20px; min-height: 0;" id="total">
      <span>
        <a @click="signIn('user1@venus.com', '1234')">user1@venus.com 1234</a>
        <a @click="signIn('user2@mars.com', '1234')">user2@mars.com 1234</a>
      </span>
      <span style="flex-direction: column; margin: 20px;">
        <p>WIPE EVERY HOUR</p>
        <p>Due to supabase free tier limitations, some features may not work.</p>
      </span>
    </section>
  </main>
</template>

<style scoped>
#thirdparty {
  margin: 20px 20px;
  justify-content: space-around;
  display: flex;
}

a {
  cursor: pointer;
  margin: 10px;
  width: 50%;
  text-align: center;
  color: #ef4b69;
}

span {
  display: flex;
  justify-content: space-around;
}
footer {
  display: flex;
  flex-direction: column;
}

main {
  background-color: #131c44;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
#total {
  min-height: 324px;
  width: 300px;
  border: #ef4b69 1px solid;
  border-radius: 10px;
}

#form {
  margin: 20px;
}

.o-btn {
  margin: 0px 20px;
}

hr {
  margin: 0px 20px;
  border: #ef4b69 1px solid;
}
</style>
