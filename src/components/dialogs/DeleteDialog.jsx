import { confirmDialog } from 'primereact/confirmdialog';

export const useConfirmAction = (toastRef) => {
    /**
     * @param {Function} action
     * @param {Object} options 
     */
    const confirmAction = (action, options = {}) => {
        const {
            message = 'Are you sure you want to proceed?',
            header = 'Confirmation',
            icon = 'pi pi-exclamation-triangle',
            acceptLabel = 'Delete',
            rejectLabel = 'Cancel'
        } = options;

        confirmDialog({
            message,
            header,
            icon,
            style: { width: '350px' },
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            acceptLabel,
            rejectLabel,
            accept: async () => {
                try {
                    await action();

                    toastRef.current.show({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Action completed successfully',
                        life: 3000
                    });
                } catch (error) {
                    toastRef.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Something went wrong',
                        life: 3000
                    });
                }
            },
            reject: () => {
                toastRef.current.show({
                    severity: 'info',
                    summary: 'Cancelled',
                    detail: 'Action cancelled',
                    life: 3000
                });
            }
        });
    };

    return { confirmAction };
};