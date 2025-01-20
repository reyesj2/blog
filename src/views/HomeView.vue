<template>
  <div class="home">
    <h1>Welcome to My Blog</h1>
    <div class="blog-list">
      <div v-if="loading" class="loading">Loading posts...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="posts.length === 0" class="no-posts">No blog posts found.</div>
      <div v-else class="posts">
        <article v-for="post in posts" :key="post.slug" class="post-preview">
          <RouterLink :to="{ name: 'post', params: { slug: post.slug }}">
            <h2>{{ post.title }}</h2>
            <div class="post-meta">
              <span class="date">{{ new Date(post.date).toLocaleDateString() }}</span>
            </div>
            <p class="excerpt">{{ post.excerpt }}</p>
          </RouterLink>
        </article>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchBlogPosts } from '../services/blogService';

const loading = ref(true);
const error = ref(null);
const posts = ref([]);

onMounted(async () => {
  try {
    const fetchedPosts = await fetchBlogPosts();
    posts.value = fetchedPosts;
  } catch (err) {
    error.value = 'Failed to load blog posts';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.home {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .no-posts {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

.posts {
  margin-top: 30px;
}

.post-preview {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.post-preview:last-child {
  border-bottom: none;
}

.post-preview a {
  text-decoration: none;
  color: inherit;
}

.post-preview h2 {
  margin: 0;
  color: #2c3e50;
}

.post-preview:hover h2 {
  color: #42b883;
}

.post-meta {
  margin: 8px 0;
  color: #666;
  font-size: 0.9em;
}

.excerpt {
  margin: 10px 0 0;
  color: #666;
  line-height: 1.5;
}
</style>
