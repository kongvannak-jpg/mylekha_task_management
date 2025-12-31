import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Skeleton } from 'primereact/skeleton';
import { useTranslation } from 'react-i18next';
import ButtonSubmit from '../../components/layouts/buttons/ButtonSumit';

// Import the service we just created
import { departmentsService } from '../../services/departments.service';

const DepartmentFormPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { id } = useParams(); // If ID exists, we are in "Edit Mode"
    const toast = useRef(null);

    // --- STATE ---
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(!!id); // Only load if editing

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: ''
    });

    // --- 1. LOAD DATA ON MOUNT (Edit Mode) ---
    useEffect(() => {
        if (id) {
            loadDepartment();
        }
    }, [id]);

    const loadDepartment = async () => {
        setIsLoading(true);
        try {
            const response = await departmentsService.getDepartmentById(id);
            // Handle { data: ... } or { data: { data: ... } } wrappers
            const data = response.data?.data || response.data || {};

            setFormData({
                name: data.name || '',
                code: data.code || '',
                description: data.description || ''
            });
        } catch (error) {
            console.error("Failed to load department:", error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not load department details.'
            });
            // Optional: navigate back on error
            // navigate('/departments'); 
        } finally {
            setIsLoading(false);
        }
    };

    // --- HANDLERS ---
    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validation
        if (!formData.name || !formData.code) {
            toast.current.show({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Name and Code are required fields.',
                life: 3000
            });
            return;
        }

        setIsSaving(true);
        try {
            // 2. Prepare Payload
            const payload = {
                name: formData.name,
                code: formData.code,
                description: formData.description
            };

            // 3. API Call
            if (id) {
                await departmentsService.updateDepartment(id, payload);
            } else {
                await departmentsService.createDepartment(payload);
            }

            // 4. Success Feedback
            toast.current.show({
                severity: 'success',
                summary: 'Success',
                detail: id ? 'Department updated successfully' : 'Department created successfully',
                life: 2000
            });

            // 5. Navigate Back
            setTimeout(() => {
                navigate('/departments');
            }, 1000);

        } catch (error) {
            console.error("Submit Error:", error);
            const msg = error.message || "Operation failed";
            toast.current.show({ severity: 'error', summary: 'Error', detail: msg });
        } finally {
            setIsSaving(false);
        }
    };

    // --- LOADING VIEW ---
    if (isLoading) {
        return (
            <div className="p-6">
                <Skeleton width="100%" height="4rem" className="mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Skeleton height="3rem" />
                    <Skeleton height="3rem" />
                </div>
                <Skeleton height="10rem" />
            </div>
        );
    }

    // --- MAIN VIEW ---
    return (
        <div className="">
            <Toast ref={toast} />

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 md:p-8">
                <h4 className='mb-5 text-xl font-bold dark:text-white'>
                    {id ? t('edit_department') : t('create_department')}
                </h4>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {t('name')} <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="e.g. Human Resources"
                                className="w-full"
                            />
                        </div>

                        {/* Code Field */}
                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {t('code')} <span className="text-red-500">*</span>
                            </label>
                            <InputText
                                id="code"
                                value={formData.code}
                                onChange={(e) => handleInputChange('code', e.target.value)}
                                placeholder="e.g. HR-001"
                                className="w-full"
                            />
                        </div>

                        {/* Description Field (Full Width) */}
                        <div className="md:col-span-2">
                            <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                {t('description')}
                            </label>
                            <InputTextarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                rows={5}
                                autoResize
                                placeholder="Enter department details..."
                                className="w-full"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse justify-end sm:flex-row gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <Button
                            label={t('cancel')}
                            severity="secondary"
                            outlined
                            onClick={() => navigate('/departments')}
                            className="w-full sm:w-auto"
                            type="button"
                        />
                        <ButtonSubmit
                            label={id ? t('save') : t('save')}
                            loading={isSaving}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepartmentFormPage;