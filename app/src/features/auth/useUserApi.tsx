import axios from 'axios';

// export type User = {
//   _id?: string;
//   username: string;
//   email: string;
//   password: string;
// };

const API_URL = import.meta.env.VITE_API_URL;
axios.defaults.withCredentials = true;

export async function checkUsernameAvailibity(username: string) {
  try {
    const response = await axios.get(`${API_URL}/api/users?username=${username}`);
    const data = response.data;
    return data.available;
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Failed to fetch username');
    throw error;
  }
}
//
// export function useUserApi() {
//   const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
//   const [error, setError] = useState<Error | null>(null);
//
//   const updateUser = async (formData: FormData) => {
//     setStatus('loading');
//     try {
//       console.log('seending request');
//       for (let [key, value] of formData.entries()) {
//         console.log(`${key}:`, value);
//       }
//
//       const update = await axios.put<{ success: boolean; user: Author }>(
//         `${API_URL}/api/user/update`,
//         formData,
//         {
//           headers: { 'Content-Type': 'multipart/form-data' },
//         }
//       );
//       console.log('update user', update);
//     } catch (err) {
//       console.error('Update error details:', {});
//
//       const error = err instanceof Error ? err : new Error('Failed to create updateUser');
//       setError(error);
//       setStatus('error');
//     }
//   };
//
//   return {
//     status,
//     error,
//     registerUser,
//     updateUser,
//   };
// }
