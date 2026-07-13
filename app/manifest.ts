import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FIT MEN COOK Vizag",
    short_name: "FitMenCook",
    description: "Healthy meal prep & delivery in Visakhapatnam",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf7ef",
    theme_color: "#f5a50a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
