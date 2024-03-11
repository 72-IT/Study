async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    console.log('login function called'); // Add this line to send a message to the console
    
    const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.status === 200) {
        window.location.href = '/welcome.html';
    } else {
        alert('Invalid username or password');
    }
}