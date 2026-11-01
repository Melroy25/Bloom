import { useState, useEffect, useCallback } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Alert, Platform } from 'react-native';

// Ensure WebBrowser completes redirect sessions cleanly
WebBrowser.maybeCompleteAuthSession();

export const GOOGLE_CLIENT_ID = '523986274065-qndn5e3k3qlthc7n5a6lqu1rq8pu5p94.apps.googleusercontent.com';

export interface ClassroomAssignmentItem {
  id: string;
  courseCode: string;
  courseColor: string;
  title: string;
  description: string;
  dueDateLabel: string;
  estimatedHours: string;
  status: 'pending' | 'completed';
  classroomLink?: string;
  source: 'google_classroom';
}

export function useGoogleClassroom(onSyncSuccess?: (tasks: ClassroomAssignmentItem[]) => void) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Google useAuthRequest configuration with webClientId and explicit useProxy: true
  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      webClientId: GOOGLE_CLIENT_ID,
      clientId: GOOGLE_CLIENT_ID,
      androidClientId: GOOGLE_CLIENT_ID,
      iosClientId: GOOGLE_CLIENT_ID,
      scopes: [
        'https://www.googleapis.com/auth/classroom.courses.readonly',
        'https://www.googleapis.com/auth/classroom.course-work.readonly',
        'https://www.googleapis.com/auth/classroom.student-submissions.me.readonly',
      ],
    },
    {
      // Explicitly set useProxy: true to handle Expo Go redirection properly without unmatched route 404s
      // @ts-ignore
      useProxy: true,
    }
  );

  // 2. Fetch Active Courses and Coursework using Bearer token
  const fetchClassroomCoursework = async (accessToken: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch active courses
      const coursesRes = await fetch(
        'https://classroom.googleapis.com/v1/courses?courseStates=ACTIVE',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/json',
          },
        }
      );

      if (!coursesRes.ok) {
        const errorText = await coursesRes.text().catch(() => '');
        console.warn('Classroom courses error:', coursesRes.status, errorText);
        throw new Error(`Google Classroom API error (${coursesRes.status})`);
      }

      const coursesData = await coursesRes.json();
      const courses: any[] = coursesData.courses || [];

      if (courses.length === 0) {
        setIsLoading(false);
        Alert.alert(
          'Google Classroom',
          'Connected successfully, but no active courses were found for this Google account.'
        );
        return [];
      }

      const importedItems: ClassroomAssignmentItem[] = [];
      const courseColors = ['#789B83', '#365B45', '#557A64', '#8EA898', '#638B74'];

      // Iterate through active courses to retrieve coursework
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const color = courseColors[i % courseColors.length];

        try {
          const workRes = await fetch(
            `https://classroom.googleapis.com/v1/courses/${course.id}/courseWork`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
              },
            }
          );

          if (workRes.ok) {
            const workData = await workRes.json();
            const courseWorkList: any[] = workData.courseWork || [];

            for (const work of courseWorkList) {
              let dueDateLabel = 'Upcoming';
              if (work.dueDate) {
                const months = [
                  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
                ];
                const month = months[(work.dueDate.month || 1) - 1];
                const day = work.dueDate.day || 1;
                dueDateLabel = `Due on ${month} ${day}`;
              }

              importedItems.push({
                id: `gcr-${work.id}`,
                courseCode: (course.name || 'Classroom').toUpperCase(),
                courseColor: color,
                title: work.title || 'Untitled Assignment',
                description: work.description || `Assigned in ${course.name}`,
                dueDateLabel,
                estimatedHours: '~2.5 hrs needed',
                status: 'pending',
                classroomLink: work.alternateLink,
                source: 'google_classroom',
              });
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch coursework for course ${course.id}:`, err);
        }
      }

      setIsLoading(false);

      if (onSyncSuccess) {
        onSyncSuccess(importedItems);
      }

      Alert.alert(
        'Google Classroom Synced',
        `Successfully synced ${importedItems.length} assignment${
          importedItems.length === 1 ? '' : 's'
        } from your classes into Bloom!`
      );

      return importedItems;
    } catch (err: any) {
      setIsLoading(false);
      const errMsg = err?.message || 'Failed to sync with Google Classroom.';
      setError(errMsg);
      Alert.alert(
        'Classroom Sync Error',
        'Could not fetch courses from Google Classroom. Please verify your permissions and try again.'
      );
      return [];
    }
  };

  // 3. Safe response handling
  useEffect(() => {
    if (response) {
      if (response.type === 'success') {
        const token =
          response.authentication?.accessToken ||
          (response.params as any)?.access_token;

        if (token) {
          fetchClassroomCoursework(token);
        } else {
          setIsLoading(false);
          Alert.alert(
            'Authorization Guard',
            'Did not receive an access token from Google. Please try again.'
          );
        }
      } else if (response.type === 'error') {
        setIsLoading(false);
        const errorMsg =
          response.error?.message ||
          (response.params as any)?.error_description ||
          'Google authentication was cancelled or failed.';
        Alert.alert('Sign-In Notice', errorMsg);
      } else if (response.type === 'dismiss' || response.type === 'cancel') {
        setIsLoading(false);
      }
    }
  }, [response]);

  // 4. Trigger sign-in flow with explicit useProxy: true
  const syncGoogleClassroom = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Explicitly passing useProxy: true to handle Expo Go redirection properly without unmatched route 404s
      const result = await promptAsync({ useProxy: true } as any);
      if (result.type !== 'success') {
        setIsLoading(false);
      }
    } catch (err: any) {
      setIsLoading(false);
      Alert.alert(
        'Google Sign-In Error',
        err?.message || 'Unable to open Google sign-in browser. Please try again.'
      );
    }
  }, [promptAsync]);

  return {
    syncGoogleClassroom,
    isLoading,
    error,
    isReady: !!request,
  };
}
