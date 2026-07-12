// @ts-nocheck
import { readFile } from 'node:fs/promises'
import { describe, expect, it } from 'vitest'

async function readAppFile(relativePath: string): Promise<string> {
  return readFile(new URL(relativePath, import.meta.url), 'utf8')
}

const sourceChecks = [
  {
    file: './app.vue',
    required: [
      "import { computed, onMounted } from 'vue'",
      "import { useHead, useRoute } from '#imports'",
      "import { useAuth } from '~/features/auth/model/useAuth'"
    ]
  },
  {
    file: './pages/index.vue',
    required: ["import { definePageMeta } from '#imports'"]
  },
  {
    file: './pages/login.vue',
    required: ["import { definePageMeta } from '#imports'"]
  },
  {
    file: './pages/register.vue',
    required: ["import { definePageMeta } from '#imports'"]
  },
  {
    file: './middleware/auth.ts',
    required: [
      "import { defineNuxtRouteMiddleware, navigateTo } from '#imports'",
      "import { useAuth } from '~/features/auth/model/useAuth'"
    ]
  },
  {
    file: './middleware/guest.ts',
    required: [
      "import { defineNuxtRouteMiddleware, navigateTo } from '#imports'",
      "import { useAuth } from '~/features/auth/model/useAuth'"
    ]
  },
  {
    file: './composables/useApi.ts',
    required: [
      "import { useCookie, useRuntimeConfig } from '#imports'"
    ]
  },
  {
    file: './composables/useInfiniteScroll.ts',
    required: [
      "import { ref, watchEffect } from 'vue'"
    ]
  },
  {
    file: './features/auth/model/useAuth.ts',
    required: [
      "import { computed } from 'vue'",
      "import { navigateTo, useCookie, useState } from '#imports'",
      "import { useApi } from '~/composables/useApi'"
    ]
  },
  {
    file: './features/tasks/model/useTasks.ts',
    required: [
      "import { ref, watch } from 'vue'",
      "import { useApi } from '~/composables/useApi'"
    ]
  },
  {
    file: './features/tasks/model/useTaskBoard.ts',
    required: [
      "import { computed, onMounted, ref, watch } from 'vue'",
      "import { useFormatDate, useInfiniteScroll } from '#imports'",
      "import { useAuth } from '~/features/auth/model/useAuth'",
      "import { useTasks } from '~/features/tasks/model/useTasks'",
      "import { useTaskDialog } from '~/features/tasks/model/useTaskDialog'"
    ]
  },
  {
    file: './components/Button.vue',
    required: ["import { computed } from 'vue'"]
  },
  {
    file: './components/AppHeader.vue',
    required: ["import { computed } from 'vue'"]
  },
  {
    file: './components/IconButton.vue',
    required: ["import { computed } from 'vue'"]
  },
  {
    file: './features/tasks/ui/components/TaskCard.vue',
    required: [
      "import { computed } from 'vue'",
      "import type { Task, TaskStatus } from '../../model/types'"
    ]
  },
  {
    file: './features/tasks/ui/components/TaskCreateDialog.vue',
    required: [
      "import { reactive, watch } from 'vue'",
      "import type { CreateTaskData } from '../../model/types'"
    ]
  },
  {
    file: './features/tasks/ui/components/TaskEditDialog.vue',
    required: [
      "import { reactive, watch } from 'vue'",
      "import type { Task, UpdateTaskData } from '../../model/types'"
    ]
  }
] as const

describe('source import smoke checks', () => {
  it.each(sourceChecks)('keeps explicit imports in %s', async ({ file, required }) => {
    const source = await readAppFile(file)

    for (const pattern of required) {
      expect(source).toContain(pattern)
    }
  })
})
