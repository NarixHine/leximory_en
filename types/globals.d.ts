export { }

declare global {
    interface CustomJwtSessionClaims {
        plan?: 'beginner' | 'interlocutor' | 'communicator'
        lemon?: string
    }
}
