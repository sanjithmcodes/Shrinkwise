import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if(email === '' || password === ''){
            setErrors(['Please fill in the fields'])
        }else{
            fetch('/login', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    password: password
                }),
                headers: {
                    'Content-type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(res => navigate('/profile'))
                .catch(err => console.error(err))
        }
    }

    return (
        <main className="container sw-page">
            <section className="sw-auth">
                <h1>Welcome back</h1>
                <p className="sw-muted mb-4">Log in to see this week's losses.</p>
                <div className="sw-panel">
                    {errors.map((err,i) => {
                        return <span key={i} className="sw-alert" role="alert">{err}</span>
                    })}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="exampleInputEmail1"
                                name="email"
                                autoComplete="email"
                                onChange={handleEmail}
                            ></input>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                id="exampleInputPassword1"
                                name="password"
                                autoComplete="current-password"
                                onChange={handlePassword}
                            ></input>
                        </div>
                        <button onClick={handleSubmit} type="submit" className="btn btn-primary w-100">Log in</button>
                    </form>
                </div>
                <p className="sw-auth-switch">New here? <Link to="/signup">Create an account</Link></p>
            </section>
        </main>
    )
}

export default Login