
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../guards/ProtectedRoute';

// Pages
import LoginPage from '../pages/auth/LoginPage';
import UnauthorizedPage from '../pages/auth/UnauthorizedPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import TasksPage from '../pages/tasks/TasksPage';
import UsersPage from '../pages/users/UsersPage';
import UserFormPage from '../pages/users/UserFormPage';
import NotFoundPage from '../pages/error/NotFoundPage';

// Layout
import MainLayout from '../components/layouts/MainLayout';
import RolesPage from '../pages/roles/RolesPage';

export const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes with Layout */}
            <Route
                element={
                    // <ProtectedRoute>
                    <MainLayout />
                    // </ProtectedRoute>
                }
            >
                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Dashboard - All authenticated users */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Tasks - All authenticated users */}
                <Route path="/tasks" element={<TasksPage />} />

                {/* Users Management - Admin only */}
                <Route
                    path="/users"
                    element={
                        // <ProtectedRoute requiredRoles={['admin']}>
                        <UsersPage />
                        // </ProtectedRoute>
                    }
                />

                {/* User Form - Admin only OR users with 'manage_users' permission */}
                <Route
                    path="/users/form"
                    element={
                        // <ProtectedRoute
                        //     requiredRoles={['admin']}
                        //     requiredPermissions={['manage_users']}
                        // >
                        <UserFormPage />
                        // </ProtectedRoute>
                    }
                />
                <Route
                    path="/roles"
                    element={
                        // <ProtectedRoute requiredRoles={['admin']}>
                        <RolesPage />
                        // </ProtectedRoute>
                    }
                />

                {/* Add more routes here as needed */}
                {/* <Route
                    path="/roles"
                    element={
                        <ProtectedRoute requiredPermissions={['manage_roles']}>
                            <RoleManagementPage />
                        </ProtectedRoute>
                    }
                /> */}

                {/* <Route
                    path="/settings"
                    element={
                        <ProtectedRoute requiredRoles={['admin']}>
                            <SettingsPage />
                        </ProtectedRoute>
                    }
                /> */}
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};