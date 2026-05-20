import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyAJY7qQju0400c8_w8gc4PGE89VJJ9wfL0',
  authDomain: 'min-rescue.firebaseapp.com',
  projectId: 'min-rescue',
  storageBucket: 'min-rescue.firebasestorage.app',
  messagingSenderId: '120065917182',
  appId: '1:120065917182:web:0199e659f6ec78b132a5af',
  measurementId: 'G-0VKR1GJXQ3',
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const auth = getAuth(app)
const db = getFirestore(app)

export { app, analytics, auth, db }
