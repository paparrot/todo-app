interface UseInfiniteScrollOptions {
  canLoadMore: () => boolean
  isLoading?: () => boolean
  rootMargin?: string
  onLoadMore: () => void | Promise<void>
}

export const useInfiniteScroll = (options: UseInfiniteScrollOptions) => {
  const trigger = ref<HTMLElement | null>(null)

  watchEffect((onCleanup: (cleanup: () => void) => void) => {
    if (!trigger.value || options.isLoading?.() || !options.canLoadMore()) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        void options.onLoadMore()
      }
    }, {
      rootMargin: options.rootMargin ?? '200px 0px'
    })

    observer.observe(trigger.value)

    onCleanup(() => {
      observer.disconnect()
    })
  })

  return {
    trigger
  }
}
