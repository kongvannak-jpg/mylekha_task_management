export const MENU_ITEMS = [
    {
        key: 'dashboard',
        label: 'dashboard',
        icon: 'pi pi-th-large',
        path: '/dashboard'
    },
    {
        key: 'tasks',
        label: 'tasks',
        icon: 'pi pi-check-square',
        path: '/tasks'
    },
    // {
    //     key: 'task',
    //     label: 'task',
    //     icon: 'pi pi-check-square',
    //     children: [
    //         { key: 'marketing', label: 'marketing', path: '/task/marketing' },
    //         { key: 'development', label: 'development', path: '/task/development' },
    //         { key: 'support', label: 'support', path: '/task/support' }
    //     ]
    // },
    {
        key: 'timeline',
        label: 'timeline',
        icon: 'pi pi-clock',
        path: '/timeline'
    },
    {
        key: 'team',
        label: 'team',
        icon: 'pi pi-users',
        path: '/team'
    }
];

export const ACCOUNT_ITEMS = [
    {
        key: 'profile',
        label: 'profile',
        icon: 'pi pi-user',
        path: '/users/profile/1'
    },
    // {
    //     key: 'settings',
    //     label: 'settings',
    //     icon: 'pi pi-cog',
    //     children: [
    //         { key: 'general', label: 'general', path: '/settings/general' },
    //         { key: 'security', label: 'security', path: '/settings/security' },
    //         { key: 'notifications', label: 'notifications', path: '/settings/notifications' }
    //     ]
    // },
    {
        key: 'my_task',
        label: 'my_task',
        icon: 'pi pi-file',
        path: '/my-task'
    },
    {
        key: 'users',
        label: 'users',
        icon: 'pi pi-file',
        path: '/users'
    },
    {
        key: 'roles',
        label: 'roles',
        icon: 'pi pi-file',
        path: '/roles'
    },
    {
        key: 'departments',
        label: 'departments',
        icon: 'pi pi-file',
        path: '/departments'
    },
    {
        key: 'sign_in',
        label: 'sign_in',
        icon: 'pi pi-sign-in',
        path: '/login'
    }
];

export const usersData = [
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Admin', status: 'Active', avatar: null, phone: '+1234567890' },
    { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'User', status: 'Active', avatar: null, phone: '+1234567891' },
    { id: 3, name: 'Bob Johnson', email: 'bob.johnson@example.com', role: 'User', status: 'Inactive', avatar: null, phone: '+1234567892' },
    { id: 4, name: 'Alice Brown', email: 'alice.brown@example.com', role: 'Manager', status: 'Active', avatar: null, phone: '+1234567893' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie.wilson@example.com', role: 'User', status: 'Active', avatar: null, phone: '+1234567894' },
];