'use server';
export async function deleteImages(imageIds: string[]) {
  try {
    await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/image', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageIds }),
    });
  } catch (error) {
    console.error(error);
  }
}
