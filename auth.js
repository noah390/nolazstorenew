// Authentication Guard
class AuthGuard {
  constructor() {
    this.init();
  }

  init() {
    // Skip auth for admin pages
    if (window.location.pathname.includes('admin')) {
      return;
    }

    // Store original content
    this.originalContent = document.body.innerHTML;

    // Wait for Firebase to initialize
    if (typeof firebase === 'undefined' || !firebase.auth) {
      setTimeout(() => this.init(), 100);
      return;
    }

    // Check auth state
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.showContent();
      } else {
        this.showAuthScreen();
      }
    });

    // Check immediately
    setTimeout(() => {
      if (!firebase.auth().currentUser) {
        this.showAuthScreen();
      }
    }, 1000);
  }

  showAuthScreen() {
    document.body.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); font-family: Arial, sans-serif; padding: 1rem;">
        <div style="text-align: center; background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 20px 40px rgba(0,0,0,0.1); max-width: 400px; width: 100%; margin: 0 auto;">
          <h1 style="margin: 0 0 0.5rem; color: #1f2937; font-size: 1.5rem;">Welcome to Nolaz Store</h1>
          <p style="margin: 0 0 1.5rem; color: #6b7280; font-size: 0.9rem;">Please sign in to access our fashion collection</p>
          
          <div id="authTabs" style="display: flex; margin-bottom: 1rem; border-bottom: 1px solid #e5e7eb;">
            <button onclick="authGuard.switchTab('signup')" id="signupTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #667eea; border-bottom: 2px solid #667eea; font-size: 0.9rem;">Sign Up</button>
            <button onclick="authGuard.switchTab('login')" id="loginTab" style="flex: 1; padding: 0.75rem; border: none; background: none; cursor: pointer; font-weight: 600; color: #6b7280; font-size: 0.9rem;">Login</button>
          </div>
          
          <form id="signupForm">
            <input type="text" id="signupName" placeholder="Full Name" required style="width: 100%; padding: 0.75rem; margin-bottom: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box; font-size: 1rem;">
            <input type="email" id="signupEmail" placeholder="Email" required style="width: 100%; padding: 0.75rem; margin-bottom: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box; font-size: 1rem;">
            <input type="password" id="signupPassword" placeholder="Password (min 6 characters)" minlength="6" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box; font-size: 1rem;">
            <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; font-size: 1rem;">Create Account</button>
          </form>
          
          <form id="loginForm" style="display: none;">
            <input type="email" id="loginEmail" placeholder="Email" required style="width: 100%; padding: 0.75rem; margin-bottom: 0.75rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box; font-size: 1rem;">
            <input type="password" id="loginPassword" placeholder="Password" required style="width: 100%; padding: 0.75rem; margin-bottom: 1rem; border: 2px solid #e5e7eb; border-radius: 0.5rem; box-sizing: border-box; font-size: 1rem;">
            <button type="submit" style="width: 100%; background: #667eea; color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; font-size: 1rem;">Login</button>
          </form>
        </div>
      </div>
    `;

    document.getElementById('signupForm').onsubmit = (e) => this.signup(e);
    document.getElementById('loginForm').onsubmit = (e) => this.login(e);
  }

  switchTab(tab) {
    const signupTab = document.getElementById('signupTab');
    const loginTab = document.getElementById('loginTab');
    const signupForm = document.getElementById('signupForm');
    const loginForm = document.getElementById('loginForm');

    if (tab === 'signup') {
      signupTab.style.color = '#667eea';
      signupTab.style.borderBottom = '2px solid #667eea';
      loginTab.style.color = '#6b7280';
      loginTab.style.borderBottom = 'none';
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    } else {
      loginTab.style.color = '#667eea';
      loginTab.style.borderBottom = '2px solid #667eea';
      signupTab.style.color = '#6b7280';
      signupTab.style.borderBottom = 'none';
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    }
  }

  async signup(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;

    try {
      const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName: name });
      
      try {
        await firebase.firestore().collection('users').doc(userCredential.user.uid).set({
          name: name,
          email: email,
          signupDate: new Date().toISOString(),
          uid: userCredential.user.uid
        });
      } catch (dbError) {
        console.log('Could not store user data:', dbError);
      }
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email already registered. Please login instead.');
        this.switchTab('login');
        document.getElementById('loginEmail').value = email;
      } else {
        alert('Signup failed: ' + error.message);
      }
    }
  }

  async login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        alert('No account found. Please sign up first.');
        this.switchTab('signup');
        document.getElementById('signupEmail').value = email;
      } else {
        alert('Login failed: ' + error.message);
      }
    }
  }

  showContent() {
    if (this.originalContent) {
      document.body.innerHTML = this.originalContent;
    }
    this.addLogoutButton();
    this.showUserWelcome();
  }

  showUserWelcome() {
    const user = firebase.auth().currentUser;
    if (user) {
      const userGreeting = document.getElementById('userGreeting');
      const userNameSpan = document.getElementById('userName');
      
      if (userGreeting && userNameSpan) {
        const displayName = user.displayName || user.email.split('@')[0];
        userNameSpan.textContent = displayName;
        userGreeting.style.display = 'inline';
      }
    }
  }

  addLogoutButton() {
    const headerActions = document.querySelector('.header-actions');
    
    if (headerActions && !document.getElementById('logoutBtn')) {
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'logoutBtn';
      logoutBtn.className = 'btn';
      logoutBtn.style.marginLeft = '10px';
      logoutBtn.style.background = '#ef4444';
      logoutBtn.style.color = 'white';
      logoutBtn.style.padding = '0.5rem 0.75rem';
      logoutBtn.style.fontSize = '0.875rem';
      logoutBtn.textContent = 'Logout';
      logoutBtn.onclick = () => this.logout();
      headerActions.appendChild(logoutBtn);
    }
  }

  async logout() {
    try {
      await firebase.auth().signOut();
      location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
}

const authGuard = new AuthGuard();