import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "task": "Task",
            "marketing": "Marketing",
            "development": "Development",
            "support": "Support",
            "timeline": "Timeline",
            "team": "Team",
            "account_pages": "Account Pages",
            "profile": "Profile",
            "settings": "Settings",
            "add_project": "Add project",
            "search_placeholder": "Type here...",
            "menu": "Menu",
            "general": "General",
            "security": "Security",
            "notifications": "Notifications",
            "my_task": "My Task",
            "sign_in": "Sign In",
            "create_user": "Create User",
            "edit_user": "Edit User",
            "name": "Name",
            "email": "Email",
            "email_address": "Email Address",
            "password": "Password",
            "confirm_password": "Confirm Password",
            "select_role": "Select Role",
            "role": "Role",
            "status": "Status",
            "submit": "Submit",
            "cancel": "Cancel",
            "save_changes": "Save Changes",
            "save": "Save",
            "saved_successfully": "Saved successfully!",
            "saved_error": "Error saving data.",
            "upload_avatar": "Upload Avatar",
            "select_image": "Select an image file to upload as avatar.",
            "upload": "Upload",
            "upload_photo": "Upload Photo",
            "active": "Active",
            "inactive": "Inactive",
            "create_new": "Create New",
            "profile_picture": "Profile Picture",
        }
    },
    km: {
        translation: {
            "dashboard": "ផ្ទាំងគ្រប់គ្រង",
            "task": "ភារកិច្ច",
            "marketing": "ទីផ្សារ",
            "development": "ការអភិវឌ្ឍន៍",
            "support": "ការគាំទ្រ",
            "timeline": "កាលវិភាគ",
            "team": "ក្រុមការងារ",
            "account_pages": "គណនី",
            "profile": "ប្រវត្តិរូប",
            "settings": "ការកំណត់",
            "add_project": "បង្កើតគម្រោង",
            "search_placeholder": "ស្វែងរក...",
            "menu": "ម៉ឺនុយ",
            "general": "ទូទៅ",
            "security": "សុវត្ថិភាព",
            "notifications": "ការជួនដំណឹង",
            "my_task": "ការងាររបស់ខ្ញុំ",
            "sign_in": "ចូលប្រើប្រាស់",
            "create_user": "បង្កើតអ្នកប្រើប្រាស់",
            "edit_user": "កែប្រែអ្នកប្រើប្រាស់",
            "name": "ឈ្មោះ",
            "email": "អ៊ីមែល",
            "email_address": "អាសយដ្ឋានអ៊ីមែល",
            "password": "ពាក្យសម្ងាត់",
            "confirm_password": "បញ្ជាក់ពាក្យសម្ងាត់",
            "select_role": "ជ្រើសរើសតួនាទី",
            "role": "តួនាទី",
            "status": "ស្ថានភាព",
            "submit": "ដាក់ស្នើ",
            "cancel": "បោះបង់",
            "save_changes": "រក្សាទុកការផ្លាស់ប្តូរ",
            "save": "រក្សាទុក",
            "saved_successfully": "រក្សាទុកបានជោគជ័យ!",
            "saved_error": "មានបញ្ហាក្នុងការរក្សាទុកទិន្នន័យ។",
            "upload_avatar": "ផ្ទុករូបភាពប្រវត្តិរូប",
            "select_image": "ជ្រើសរើសឯកសាររូបភាពមួយដើម្បីផ្ទុកជារូបភាពប្រវត្តិរូប។",
            "upload": "ផ្ទុកឡើង",
            "upload_photo": "ផ្ទុករូបថត",
            "active": "សកម្ម",
            "inactive": "មិនសកម្ម",
            "create_new": "បង្កើតថ្មី",
            "profile_picture": "រូបភាពប្រវត្តិរូប",
        }
    }
};

const savedLanguage = localStorage.getItem('language') || 'en';

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLanguage,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;