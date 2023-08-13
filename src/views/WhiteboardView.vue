<script setup lang="ts">
import { createClient } from '@supabase/supabase-js'
import { useRoute } from 'vue-router';
import { ref, onMounted, watch } from 'vue'
import { whiteboardsLocalStore } from '@/stores/whiteboardsLocalData';

const supabase = createClient('https://fibzvyznxpuacoqeqmem.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpYnp2eXpueHB1YWNvcWVxbWVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODkyNzQ3OTUsImV4cCI6MjAwNDg1MDc5NX0.o0J0z57q7o7gfuuCKdLovv0sLH9zPDpgoldz130IVyk')
const title = ref('')
const content = ref('')
const isLoading = ref(false)
const fetchingData = ref(false)
const route = useRoute()
let id: string | string[];

onMounted(() => {
  fetchingData.value = true
  supabase
  .from('Whiteboards')
  .select('*')
  .eq('id', route.params.id).then((data: any) => {
    console.log(data)
    if (data.data.length <= 0) {
      fetchingData.value = false
      title.value = "No whiteboard found"
      content.value = "Whiteboard does not exist or you do not have access to it."
      return
    }
    title.value = data.data[0].title
    content.value = data.data[0].content
    fetchingData.value = false
    console.log(data)
  })
  id = route.params.id
})


watch(
  () => route.params.id,
  (newId) => {
    fetchingData.value = true
    supabase
    .from('Whiteboards')
    .select('*')
    .eq('id', route.params.id).then((data: any) => {
    console.log(data.data.length)
    if (data.data.length <= 0) {
      title.value = "No whiteboard found"
      content.value = "Whiteboard does not exist or you do not have access to it."
      fetchingData.value = false
      return
    }
    title.value = data.data[0].title
    content.value = data.data[0].content
    fetchingData.value = false
  })
    id = newId
  }
)
const whiteboardsLocal = whiteboardsLocalStore()


let timeoutId: ReturnType<typeof setTimeout>

function updateTitle() {
  clearTimeout(timeoutId) // Clear the previous timer

  // Start a new timer to send the update after a certain delay (e.g., 500 milliseconds)
  timeoutId = setTimeout(() => {
    console.log(whiteboardsLocal.whiteboards)
    for (let i = 0; i < whiteboardsLocal.whiteboards.length; i++) {
      if (whiteboardsLocal.whiteboards[i].id == id) {
        whiteboardsLocal.whiteboards[i].title = title.value
      }
    }    
    isLoading.value = true
    supabase
      .from('Whiteboards')
      .update({ title: title.value })
      .eq('id', id)
      .then((data) => {
        console.log(data)
        isLoading.value = false
      })
  }, 500) // Adjust the delay as per your requirement
}

function updateContent(event: any) {
  clearTimeout(timeoutId) // Clear the previous timer

  // Start a new timer to send the update after a certain delay (e.g., 500 milliseconds)
  timeoutId = setTimeout(() => {
    console.log(id)
    isLoading.value = true
    supabase
      .from('Whiteboards')
      .update({ content: content.value })
      .eq('id', id)
      .then((data) => {
        console.log(data)
        isLoading.value = false
      })
  }, 500) // Adjust the delay as per your requirement
}

console.log('welcome to the whiteboard view')
</script>
<template>
  <main>
    <o-loading v-model:active="fetchingData" :full-page="false" />
    <section>
      <!-- make o-input that executes function on input -->
      <o-field label="Title">
        <o-input @update:modelValue="updateTitle" v-model="title"  maxlength="30">{{ title }}</o-input>
      </o-field>
      <o-field label="Message">
        <o-input @update:modelValue="updateContent" v-model="content" maxlength="200" type="textarea"></o-input>
      </o-field>
      <o-icon pack="fas" icon="rotate" spin v-if="isLoading"/>
      <o-icon pack="fas" icon="check" v-else/>
    </section>
  </main>
</template>

<style scoped>
main {
  background-color: #131c44;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.o-icon {
  font-size: 2rem;
  color: #ef4b69;
  margin: 1rem;
}
</style>
