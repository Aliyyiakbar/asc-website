// auth.js — client-side auth & application store (localStorage)
// NOTE: This is a frontend-only demo backend. Data lives in the browser.
// For real multi-user auth + shared database, swap these functions for Supabase/Firebase calls.

(function () {
  const KEYS = {
    users: "asc_users",
    session: "asc_session",
    applications: "asc_applications",
    pending: "asc_pending_application",
  };

  function read(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function write(key, val) {
    localStorage.setItem(key, JSON.stringify(val));
  }

  function getUsers() { return read(KEYS.users) || []; }
  function getSession() { return read(KEYS.session) || null; }
  function getApplications() { return read(KEYS.applications) || []; }

  function publicUser(u) {
    return { id: u.id, role: u.role, name: u.name, email: u.email, createdAt: u.createdAt };
  }

  // hash-ish (demo only, not secure)
  function hash(pw) {
    try { return btoa(unescape(encodeURIComponent(pw))); } catch (e) { return pw; }
  }

  function signUp(data) {
    const users = getUsers();
    const email = String(data.email || "").trim().toLowerCase();
    if (!email || !data.password) return { ok: false, error: "missing" };
    if (users.some(u => u.email === email)) return { ok: false, error: "exists" };
    const user = {
      id: "u" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
      role: data.role === "mentor" ? "mentor" : "founder",
      name: String(data.name || "").trim() || email.split("@")[0],
      email: email,
      password: hash(data.password),
      createdAt: Date.now(),
    };
    users.push(user);
    write(KEYS.users, users);
    write(KEYS.session, publicUser(user));
    return { ok: true, user: publicUser(user) };
  }

  function logIn(email, password) {
    const users = getUsers();
    const em = String(email || "").trim().toLowerCase();
    const user = users.find(u => u.email === em && u.password === hash(password));
    if (!user) return { ok: false, error: "invalid" };
    write(KEYS.session, publicUser(user));
    return { ok: true, user: publicUser(user) };
  }

  function logout() {
    localStorage.removeItem(KEYS.session);
  }

  function saveApplication(app) {
    const list = getApplications();
    app.id = "a" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    app.submittedAt = Date.now();
    app.status = "submitted";
    list.push(app);
    write(KEYS.applications, list);
    return app;
  }

  function getApplicationsForUser(userId) {
    return getApplications().filter(a => a.userId === userId);
  }

  // pending application (filled in form, before auth)
  function setPendingApplication(app) { write(KEYS.pending, app); }
  function getPendingApplication() { return read(KEYS.pending); }
  function clearPendingApplication() { localStorage.removeItem(KEYS.pending); }

  window.ASC = {
    signUp, logIn, logout,
    getSession, getUsers, getApplications,
    saveApplication, getApplicationsForUser,
    setPendingApplication, getPendingApplication, clearPendingApplication,
  };
})();
