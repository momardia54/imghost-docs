<script setup lang="ts">
import { onMounted, ref } from "vue"

const repo = "momardia54/imghost"
const stars = ref<string | null>(null)

function format(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "")}k` : String(n)
}

onMounted(async () => {
  try {
    const cached = sessionStorage.getItem("imghost-stars")
    if (cached) return void (stars.value = cached)
  } catch {}
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`)
    if (!res.ok) return
    const count = (await res.json()).stargazers_count
    if (typeof count !== "number") return
    stars.value = format(count)
    try {
      sessionStorage.setItem("imghost-stars", stars.value)
    } catch {}
  } catch {}
})
</script>

<template>
  <div class="gh-stars">
    <a class="gh-stars-btn" :href="`https://github.com/${repo}`" target="_blank" rel="noopener">
      <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
        <path fill="currentColor" d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.75.75 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
      </svg>
      <span>Star on GitHub</span>
      <span v-if="stars" class="gh-stars-count">{{ stars }}</span>
    </a>
  </div>
</template>

<style scoped>
.gh-stars {
  display: flex;
  flex-shrink: 0;
  padding: 6px 6px 0;
}
.gh-stars-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--vp-button-alt-border);
  border-radius: 20px;
  padding: 0 20px;
  line-height: 38px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-button-alt-text);
  background-color: var(--vp-button-alt-bg);
  text-decoration: none;
  transition: color 0.25s, border-color 0.25s, background-color 0.25s;
}
.gh-stars-btn:hover {
  border-color: var(--vp-button-alt-hover-border);
  color: var(--vp-button-alt-hover-text);
  background-color: var(--vp-button-alt-hover-bg);
}
.gh-stars-count {
  border-left: 1px solid var(--vp-c-divider);
  padding-left: 8px;
  font-variant-numeric: tabular-nums;
}
</style>
