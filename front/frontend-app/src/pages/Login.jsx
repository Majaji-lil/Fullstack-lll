// src/pages/Login.jsx
import LoginForm from '../components/molecules/LoginForm'

function Login() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 56px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#f9fafb', padding: '2rem',
    }}>
      <LoginForm />
    </div>
  )
}

export default Login
