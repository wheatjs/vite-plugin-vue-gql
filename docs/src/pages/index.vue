<script setup lang="ts">

</script>

<template>
  <div class="h-full grid place-content-center place-items-center">
    <Logo class="max-h-32" />
    <div class="text-xl mt-8 text-center prose">
      <Description class="text-lg text-center" />
    </div>
    <div class="flex flex-row space-x-4 mt-4">
      <Button primary to="/docs">Docs</Button>
      <Button primary to="/demos">Demos</Button>
    </div>
  </div>
</template>
