const BASE_URL = import.meta.env.CF_R2_URL || '';

export async function fetchBlogPosts() {
  try {
    const response = await fetch(`${BASE_URL}/posts.json`);
    if (!response.ok) throw new Error('Failed to fetch blog posts');
    return await response.json();
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function fetchBlogContent(slug) {
  try {
    const response = await fetch(`${BASE_URL}/${slug}.md`);
    if (!response.ok) throw new Error('Failed to fetch blog content');
    return await response.text();
  } catch (error) {
    console.error('Error fetching blog content:', error);
    return null;
  }
}
