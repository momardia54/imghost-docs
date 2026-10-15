import { h } from "vue"
import DefaultTheme from "vitepress/theme"
import GitHubStars from "./GitHubStars.vue"
import "./style.css"

export default {
  extends: DefaultTheme,
  Layout: () => h(DefaultTheme.Layout, null, { "home-hero-actions-after": () => h(GitHubStars) }),
}
