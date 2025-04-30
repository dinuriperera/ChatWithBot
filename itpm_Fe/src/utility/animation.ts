
export const SlideUp = (delay: number = 3) => {
  return {
      hidden: {
          opacity: 0,
          y: 100,
      },
      visible: {
          opacity: 1,
          y: 0,
          transition: {
              duration: 1,
              delay: delay, // The delay passed in as a prop is used here
          }
      }
  }
}

export const SlideLeft = (delay: number = 3) => {
  return {
      hidden: {
          opacity: 0,
          x: 100,
      },
      visible: {
          opacity: 1,
          x: 0,
          transition: {
              duration: 1,
              delay: delay, // The delay passed in as a prop is used here
          }
      }
  }
}

export const SlideRight = (delay: number = 3) => {
  return {
      hidden: {
          opacity: 0,
          x: -100,
      },
      visible: {
          opacity: 1,
          x: 0,
          transition: {
              duration: 1,
              delay: delay, // The delay passed in as a prop is used here
          }
       }
    }
}
