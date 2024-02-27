async function signup() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    console.log('username', username);

    const res = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.status === 200) {
        window.location.href = '/';
    } else {
        alert('Username already exists');
    }
}