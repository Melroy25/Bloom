import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function ExpoAuthSessionRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Return gracefully to the assignments dashboard
    router.replace('/(tabs)/tasks/assignments');
  }, [router]);

  return null;
}
