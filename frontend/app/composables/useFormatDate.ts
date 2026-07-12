export const useFormatDate = () => {
  const formatDate = (dateString: string | null): string => {
    if (!dateString) {
      return 'No due date'
    }

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return {
    formatDate,
  }
}
