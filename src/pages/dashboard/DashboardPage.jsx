import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Skeleton } from 'primereact/skeleton';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { RadioButton } from "primereact/radiobutton";

const DashboardPage = () => {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true); // Start as loading

    // --- 1. SIMULATE FETCHING DATA ---
    const fetchData = () => {
        setLoading(true); // Show skeleton
        setTimeout(() => {
            setTasks([
                { id: 1, task: 'Create Wireframes', deadline: 'Jun 20', priority: 'Priority 1', progress: 100 },
                { id: 2, task: 'Develop Component', deadline: 'Jun 29', priority: 'Priority 2', progress: 70 },
                { id: 3, task: 'Stakeholder Meeting', deadline: 'Jul 01', priority: 'Priority 3', progress: 20 },
                { id: 4, task: 'Backend API Setup', deadline: 'Jul 05', priority: 'Priority 1', progress: 0 },
                { id: 5, task: 'Unit Testing', deadline: 'Jul 08', priority: 'Priority 2', progress: 10 },
            ]);
            setLoading(false); // Hide skeleton after 2 seconds
        }, 2000);
    };

    // Run once on load
    useEffect(() => {
        fetchData();
    }, []);

    // --- 2. SKELETON TEMPLATES ---
    const bodySkeleton = () => <Skeleton className="w-full h-4 bg-slate-200 dark:bg-slate-700" />;

    const prioritySkeleton = () => <Skeleton className="w-16 h-5 rounded-full bg-slate-200 dark:bg-slate-700" />;

    const progressSkeleton = () => (
        <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-2 bg-slate-200 dark:bg-slate-700" />
            <Skeleton className="w-6 h-3 bg-slate-200 dark:bg-slate-700" />
        </div>
    );

    // --- 3. REAL DATA TEMPLATES ---
    const priorityBody = (row) => {
        const styles = {
            'Priority 1': 'bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400',
            'Priority 2': 'bg-orange-50 text-orange-500 dark:bg-orange-900/30 dark:text-orange-400',
            'Priority 3': 'bg-blue-50 text-blue-500 dark:bg-blue-900/30 dark:text-blue-400'
        };
        return <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${styles[row.priority]}`}>{row.priority}</span>;
    };

    const progressBody = (row) => (
        <div className="flex items-center gap-2">
            <ProgressBar value={row.progress} showValue={false} style={{ height: '6px', width: '80px' }} color="#10b981" />
            <span className="text-xs text-gray-400">{row.progress}%</span>
        </div>
    );

    return (
        <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-red-500 uppercase">
                        {loading ? <Skeleton width="10rem" height="2rem" className="bg-slate-200 dark:bg-slate-700" /> : t('dashboard')}
                    </h2>
                    <div className="flex align-items-center">
                        <RadioButton inputId="ingredient1" name="pizza" value="Cheese" />
                        <label htmlFor="ingredient1" className="ml-2">Cheese</label>
                    </div>
                    <Button
                        label={loading ? "Loading..." : "Test Loading Effect"}
                        icon="pi pi-refresh"
                        size="small"
                        outlined
                        loading={loading}
                        onClick={fetchData}
                    />
                </div>

                {/* --- A. STATS CARDS --- */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {/* Show Skeleton loop OR Real Data loop */}
                    {(loading ? [1, 2, 3, 4] : ['Total Task', 'In Progress', 'Completed', 'Overdue']).map((item, i) => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-300">
                            {loading ? (
                                <>
                                    <Skeleton width="50%" height="1rem" className="mb-2 bg-slate-200 dark:bg-slate-700" />
                                    <Skeleton width="30%" height="2rem" className="bg-slate-200 dark:bg-slate-700" />
                                </>
                            ) : (
                                <>
                                    <p className="text-xs text-gray-400 uppercase font-bold">{item}</p>
                                    <p className="text-xl font-bold text-gray-800 dark:text-white mt-1">{10 + i}</p>
                                </>
                            )}
                        </div>
                    ))}
                </div>

                {/* --- B. TABLE --- */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm overflow-hidden p-1 transition-colors duration-300">
                    {loading ? (
                        // SKELETON TABLE (5 Dummy Rows)
                        <DataTable value={Array(5).fill({})} className="p-datatable-sm">
                            <Column header="Task" body={bodySkeleton} className="py-4 pl-4" />
                            <Column header="Deadline" body={bodySkeleton} />
                            <Column header="Priority" body={prioritySkeleton} />
                            <Column header="Progress" body={progressSkeleton} />
                        </DataTable>
                    ) : (
                        // REAL TABLE
                        <DataTable value={tasks} responsiveLayout="scroll" className="p-datatable-sm">
                            <Column field="task" header={t('task')} className="font-medium text-gray-700 dark:text-gray-200 py-4 pl-4" />
                            <Column field="deadline" header="Deadline" className="text-gray-400" />
                            <Column header="Priority" body={priorityBody} />
                            <Column header="Progress" body={progressBody} />
                        </DataTable>
                    )}
                </div>
            </div>
        </main>
    );
};

export default DashboardPage;