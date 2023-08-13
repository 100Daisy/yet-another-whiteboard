<script setup lang="ts">
import Swal from 'sweetalert2';

import { ref } from 'vue';
import { supabase } from '../services/supabase'
import { useRoute } from 'vue-router';

import { userSessionStore } from '@/stores/userSessions';
const userSession = userSessionStore()

const title = ref()
const newPassword = ref('')
const route = useRoute()
const isEmailAccount = userSession.session.user.app_metadata.providers.includes('email')
const variant = route.query.focus === 'password' ? 'warning' : 'primary'

userSession.getUserPreferences().then(() => {
    title.value = userSession.defaultTitle
})

function saveSettings() {
    userSession.defaultTitle = title.value
    console.log(userSession.defaultTitle)
    if (newPassword.value.length > 0) {
        updatePassword()
    }
}

async function updatePassword() {
    await supabase.auth.updateUser({ password: newPassword.value }).then(async (data) => {
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
            text: "Password has been updated!",
            icon: "success",
        })
    })
}
</script>

<template>
    <main>
        <o-field label="Default title for notes">
            <o-input v-model="title" />
        </o-field>
        <o-field v-if="isEmailAccount" label="Password" :variant="variant">
            <o-input v-model="newPassword" type="password" maxlength="30" />
        </o-field>
        <o-button @click="saveSettings()">Save</o-button>
    </main>
</template>