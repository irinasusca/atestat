interface User {
    id_utilizator: number;
    username: string;
    email: string;
    parola: string;
    rol: string;
}

interface VerifyResponse {
    user: User;
}

export const API_URL = 'http://localhost:5005';

export async function verifyAuth(): Promise<User | null> {
  try {
    const response = await fetch(`${API_URL}/api/auth/verify`, {
      method: 'GET',
      credentials: 'include', // Important: this sends cookies with the request
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: VerifyResponse = await response.json();
    return data.user;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Logout failed:', error);
    return false;
  }
}

/**
 * Update the navigation bar based on authentication status
 */
export async function updateNavBar(): Promise<void> {
  const user = await verifyAuth();
  
   // Find login buttons - try both with and without .html extension
   ///No clue why this happends but on programari.html we need login.html
   ///The other ones need login but they are the same in the html :)
    let desktopLoginBtn = document.querySelector('a[href="./login.html"]') as HTMLAnchorElement;
    let mobileLoginBtn = document.querySelector('#mobile-menu a[href="./login.html"]') as HTMLAnchorElement;


    // Find logout buttons
  const desktopLogoutBtn = document.getElementById('logout-btn') as HTMLButtonElement;
  const mobileLogoutBtn = document.getElementById('logout-btn-mobile') as HTMLButtonElement;
  
  if (user) {
    // User is authenticated - change to "Programări" button
    if (desktopLoginBtn) {
      desktopLoginBtn.href = './programari.html';
      desktopLoginBtn.textContent = 'Programări';
    }
    
    if (mobileLoginBtn) {
      mobileLoginBtn.href = './programari.html';
      mobileLoginBtn.textContent = 'Programări';
    }

// Show logout buttons
        if (desktopLogoutBtn) {
            desktopLogoutBtn.classList.remove('hidden');
        }
        if (mobileLogoutBtn) {
            mobileLogoutBtn.classList.remove('hidden');
        }

  } else {
    // User is not authenticated - keep as "Login"
    if (desktopLoginBtn) {
      desktopLoginBtn.href = './login.html';
      desktopLoginBtn.textContent = 'Login';
    }
    
    if (mobileLoginBtn) {
      mobileLoginBtn.href = './login.html';
      mobileLoginBtn.textContent = 'Login';
    }

// Hide logout buttons
    if (desktopLogoutBtn) {
      desktopLogoutBtn.classList.add('hidden');
    }
    if (mobileLogoutBtn) {
      mobileLogoutBtn.classList.add('hidden');
    }
  }

  setupLogoutHandlers(desktopLogoutBtn, mobileLogoutBtn);
}

/**
 * Setup click handlers for logout buttons
 */
function setupLogoutHandlers(desktopBtn: HTMLButtonElement | null, mobileBtn: HTMLButtonElement | null): void {
    if (desktopBtn) {
        desktopBtn.addEventListener('click', handleLogout);
    }
    
    if (mobileBtn) {
        mobileBtn.addEventListener('click', handleLogout);
    }
}
/**
 * Handle logout button click
 */
async function handleLogout(): Promise<void> {
    const confirmed = confirm('Sigur doriți să vă deconectați?');
    if (!confirmed) return;
    
    const success = await logout();
    if (success) {
        // Redirect to home page after logout
        window.location.href = './index.html';
    } else {
        alert('Eroare la deconectare. Vă rugăm încercați din nou.');
    }
}

/**
 * Check if user is authenticated and redirect if not
 * Use this on protected pages like programari.html
 */
export async function requireAuth(): Promise<User> {
  const user = await verifyAuth();
  
  if (!user) {
    // Redirect to login page if not authenticated
    window.location.href = './login.html';
    throw new Error('Authentication required');
  }
  
  return user;
}
