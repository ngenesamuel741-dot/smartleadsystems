import { Code2, Smartphone, Megaphone, Palette, Video, Bot, Share2, Workflow } from "lucide-react";
const map = { "web-development": Code2, "app-development": Smartphone, "meta-ads": Megaphone, "crm-systems": Workflow, "graphics-design": Palette, "video-editing": Video, "ai-automation": Bot, "social-media": Share2 };
export const serviceIcon = id => map[id] || Code2;
