<template>
  <div class="blog-post">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else>
      <h1>{{ title }}</h1>
      <div class="content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import { fetchBlogContent } from '../services/blogService';

const route = useRoute();
const loading = ref(true);
const error = ref(null);
const title = ref('');
const renderedContent = ref('');

onMounted(async () => {
  try {
    const content = await fetchBlogContent(route.params.slug);
    if (!content) {
      error.value = 'Failed to load blog post';
      return;
    }
    
    // Extract title from first line if it's a heading
    const lines = content.split('\n');
    if (lines[0].startsWith('# ')) {
      title.value = lines[0].substring(2);
      const contentWithoutTitle = lines.slice(1).join('\n');
      // Replace relative image paths with full URLs
      const processedContent = contentWithoutTitle.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, alt, path) => {
          const fullUrl = path.startsWith('http') ? path : `${import.meta.env.VITE_CF_R2_URL}/${path}`;
          return `![${alt}](${fullUrl})`;
        }
      );
      renderedContent.value = marked(processedContent);
    } else {
      title.value = route.params.slug;
      // Replace relative image paths with full URLs
      const processedContent = content.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, alt, path) => {
          const fullUrl = path.startsWith('http') ? path : `${import.meta.env.VITE_CF_R2_URL}/${path}`;
          return `![${alt}](${fullUrl})`;
        }
      );
      renderedContent.value = marked(processedContent);
    }
  } catch (err) {
    error.value = 'Error loading blog post';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.blog-post {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: red;
}

.content {
  margin-top: 20px;
  line-height: 1.6;
}

.content :deep(h2) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.content :deep(p) {
  margin: 1em 0;
}

.content :deep(pre) {
  background: #f4f4f4;
  padding: 15px;
  border-radius: 5px;
  overflow-x: auto;
}

.content :deep(img) {
  max-width: 100%;
  height: auto;
}
</style>
