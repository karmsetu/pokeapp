// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
    // Example: redirect based on auth state (you'd check AsyncStorage here)
    const userIsLoggedIn = true; // replace with real logic

    if (userIsLoggedIn) {
        return <Redirect href="/home" />;
    }
    // else {
    //     return <Redirect href="/login" />;
    // }
}
