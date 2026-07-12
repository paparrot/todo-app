export const useTaskDialog = () => {
  const isAddTaskDialogOpen = useState<boolean>('add-task-dialog-open', () => false)

  const openAddTaskDialog = (): void => {
    isAddTaskDialogOpen.value = true
  }

  const closeAddTaskDialog = (): void => {
    isAddTaskDialogOpen.value = false
  }

  return {
    isAddTaskDialogOpen,
    openAddTaskDialog,
    closeAddTaskDialog
  }
}
