// app/index.tsx
import { Redirect } from 'expo-router';

export default function AppRedirect() {
    return <Redirect href="/(tabs)/home" />;
}
