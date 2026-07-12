<template>
  <div class="grid gap-6">
    <Card v-for="index in 3" :key="index">
      <div class="animate-pulse space-y-4">
        <div class="flex items-start justify-between gap-4">
          <div class="flex-1 space-y-3">
            <div class="h-4 w-24 rounded-full bg-slate-200"></div>
            <div class="h-6 w-3/4 rounded bg-slate-200"></div>
            <div class="h-4 w-32 rounded bg-slate-200"></div>
            <div class="h-4 w-full rounded bg-slate-200"></div>
            <div class="h-4 w-2/3 rounded bg-slate-200"></div>
          </div>
          <div class="flex gap-2">
            <div class="h-9 w-9 rounded-lg bg-slate-200"></div>
            <div class="h-9 w-9 rounded-lg bg-slate-200"></div>
          </div>
        </div>
        <div class="h-4 w-32 rounded bg-slate-200"></div>
      </div>
    </Card>
  </div>
</template>
