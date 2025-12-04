declare module "*.svg" {
  const content: import("next/image").StaticImageData
  export default content
}

declare module "*.svg?url" {
  const src: string
  export default src
}

