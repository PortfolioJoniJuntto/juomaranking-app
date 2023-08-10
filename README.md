# RateUp

## Introduction

RateUp is a mobile application designed to provide an intuitive and engaging platform for users. Crafted with the latest technologies, RateUp is available on both Android and iOS platforms. Built with React Native, Typescript, and Nativewind, RateUp promises a smooth user experience and a responsive design.

## Features

- **Cross-Platform:** Available on both Android and iOS.
- **Intuitive UI:** Built with Nativewind, offering a consistent and smooth user interface.
- **Type-safe Coding:** Developed with Typescript ensuring a robust and error-free experience.
- **Fast & Efficient:** Optimized performance for a lag-free experience.

## Download

- **Android:** [Download RateUp from Google Play Store](https://play.google.com/store/apps/details?id=com.juomaranking)
- **iOS:** Link to Apple App Store (Note: Provide link when available)

## Tech Stack

- **React Native:** Cross-platform mobile application development framework.
- **Typescript:** Superset of JavaScript adding static types.
- **Nativewind:** Utility-first CSS framework for smoother UI design.

## Development and Installation

1. **Clone the Repository:**

   \```bash
   git clone [repository-link]
   \```

2. **Navigate to Project Directory:**

   \```bash
   cd juomaranking
   \```

3. **Install Dependencies:**

   \```bash
   yarn
   \```

4. **Run on Android/iOS:**

   \```bash
   npx react-native run-android
   \```
   OR
   \```bash
   npx react-native run-ios
   \```

## Support

For any queries or support, please raise an issue I'll fix it someday

## Running

New camera plugin wont work with RN 0.69.1 just
yet. (https://github.com/mrousavy/react-native-vision-camera/issues/1118)

1. `yarn install`
2. Add `.env` AND `.env.dev` file with

```
API_BASEURL=https://xxxxxxxxxxxxxxxx.execute-api.eu-north-1.amazonaws.com/dev
```

If you make changes to .env run `yarn start --reset-cache`

4. `yarn run android`
5. In new terminal: `yarn run start --reset-cache`

### Icons

https://sebqq.github.io/feather1s-web/

### Errors

> - What went wrong:

    A problem occurred evaluating project ':react-native-vision-camera'.
    > Expected directory 'G:\Projects\juomaranking\node_modules/react-native/android' to contain exactly one
    file, however, it contains more than one file.

> - #### Fix: npx patch-package

---

RateUp: Elevate your ratings, uplift your experience! 🌟📱
