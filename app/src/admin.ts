import './style.css';
import { updateNavBar, API_URL, requireAuth } from './auth';

// Ensure user is admin before allowing access
async function checkAdminAccess() {
    try {
        const user = await requireAuth();
        
        if (user.rol !== 'admin') {
            alert('Acces interzis: Doar administratorii pot accesa această pagină');
            window.location.href = './index.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

// Promote user to doctor
async function promoteToDoctor(email: string, specializare: string, cod_parafa: string, locatie: string) {
    try {
        const response = await fetch(`${API_URL}/api/admin/promote/doctor`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, specializare, cod_parafa, locatie })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to promote user');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error promoting to doctor:', error);
        throw error;
    }
}

// Promote user to admin
async function promoteToAdmin(email: string) {
    try {
        const response = await fetch(`${API_URL}/api/admin/promote/admin`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to promote user');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error promoting to admin:', error);
        throw error;
    }
}

// Delete user
async function deleteUser(email: string) {
    try {
        const response = await fetch(`${API_URL}/api/admin/user`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete user');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    // Check admin access
    const hasAccess = await checkAdminAccess();
    if (!hasAccess) return;
    
    ///NAV BAR
    await updateNavBar();

    // Setup form handlers
    setupPromoteDoctorForm();
    setupPromoteAdminForm();
    setupDeleteUserForm();
});

function setupPromoteDoctorForm() {
    const form = document.getElementById('promote-doctor-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = (document.getElementById('doctor-email') as HTMLInputElement).value;
        const specializare = (document.getElementById('specializare') as HTMLInputElement).value;
        const cod_parafa = (document.getElementById('cod-parafa') as HTMLInputElement).value;
        const locatie = (document.getElementById('locatie') as HTMLSelectElement).value;
        
        const confirmed = confirm(`Sigur doriți să promovați ${email} la rol de doctor?`);
        if (!confirmed) return;
        
        try {
            await promoteToDoctor(email, specializare, cod_parafa, locatie);
            alert(`${email} a fost promovat la rol de doctor cu succes!`);
            (form as HTMLFormElement).reset();
        } catch (error) {
            alert(`❌ Eroare: ${(error as Error).message}`);
        }
    });
}

function setupPromoteAdminForm() {
    const form = document.getElementById('promote-admin-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = (document.getElementById('admin-email') as HTMLInputElement).value;
        
        const confirmed = confirm(`Sigur doriți să promovați ${email} la rol de admin?`);
        if (!confirmed) return;
        
        try {
            await promoteToAdmin(email);
            alert(`${email} a fost promovat la rol de admin cu succes!`);
            (form as HTMLFormElement).reset();
        } catch (error) {
            alert(`Eroare: ${(error as Error).message}`);
        }
    });
}

function setupDeleteUserForm() {
    const form = document.getElementById('delete-user-form');
    
    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = (document.getElementById('delete-email') as HTMLInputElement).value;
        
        const confirmed = confirm(`⚠️ ATENȚIE: Sigur doriți să ștergeți utilizatorul ${email}? Această acțiune este PERMANENTĂ și va șterge toate programările asociate!`);
        if (!confirmed) return;
        
        const doubleConfirmed = confirm(`Confirmați din nou ștergerea lui ${email}?`);
        if (!doubleConfirmed) return;
        
        try {
            await deleteUser(email);
            alert(`Utilizatorul ${email} a fost șters cu succes!`);
            (form as HTMLFormElement).reset();
        } catch (error) {
            alert(`Eroare: ${(error as Error).message}`);
        }
    });
}