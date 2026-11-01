import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  useEffect(() => {
    // Gracefully fallback to the assignments screen if an unmatched redirect route is accessed
    router.replace('/(tabs)/tasks/assignments');
  }, [router]);

  return null;
}
