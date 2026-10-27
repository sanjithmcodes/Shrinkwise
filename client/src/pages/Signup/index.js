import React, {useState} from 'react'
import {Link} from 'react-router-dom'


const Signup = () => {
    //states for registration
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    //error states
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState([]);

    //email change
    const handleEmail = (e) => {
        setEmail(e.target.value);
        setSubmitted(false);
    }

    //username change
    const handleUserName = (e) => {
        setUserName(e.target.value);
        setSubmitted(false);
    }

    //password change
    const handlePassword = (e) => {
        setPassword(e.target.value);
        setSubmitted(false);
    }

    const handleConfirm = (e) => {
        setConfirm(e.target.value);
        setSubmitted(false);
    }

    //form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        let temp = []
        if(email === '' || userName === '' || password === '' || confirm === '') {
            temp = [...temp, 'Please fill in all fields']
        }else if(password !== confirm){
            temp = [...temp, 'Password fields do not match']
        } else {
            setSubmitted(true);
            setErrors([]);

            fetch('/signup', {
                method: 'POST',
                body: JSON.stringify({
                    email: email,
                    userName: userName,
                    password: password,
                }),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then(res => res.json())
                .then(res => {
                    console.log('success')
                })
                .catch(err => console.error(err))

        }
        setErrors(temp)
    }

    return (
        <main className="container sw-page">
            <section className="sw-auth">
                <h1>Create your account</h1>
                <p className="sw-muted mb-4">Start logging losses in under a minute.</p>
                <div className="sw-panel">
                    {errors.map((err,i) => {
                        return <span key={i} className="sw-alert" role="alert">{err}</span>
                    })}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="userName" className="form-label">User name</label>
                            <input onChange={handleUserName} type="text" className="form-control" id="userName" name="userName" autoComplete="username"></input>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input onChange={handleEmail} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" name="email" autoComplete="email"></input>
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input onChange={handlePassword} type="password" className="form-control" id="password" name="password" autoComplete="new-password"></input>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="form-label">Confirm password</label>
                            <input type="password" className="form-control" onChange={handleConfirm} id="confirmPassword" name="confirmPassword" autoComplete="new-password"></input>
                        </div>
                        <button type="submit" className="btn btn-primary w-100" onClick={handleSubmit}>Create account</button>
                    </form>
                </div>
                <p className="sw-auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
            </section>
        </main>
    )
}

export default Signup