// `trailingSlash` (formerly `exportTrailingSlash` is compatible with page paths + s3 deployment scenario
// see: https://nextjs.org/docs/api-reference/next.config.js/exportPathMap#adding-a-trailing-slash

module.exports = (phase, { defaultConfig }) => {
  return {
    future: {
      webpack5: true, // will it break threejs-related libraries?
    },
    trailingSlash: true,
    basePath: '/olivia-joystick-nextjs', // for deploy to folder off base subdomain
  }
}
