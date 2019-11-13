## `Bagi Bakat`

## Overview

Project ini merupakan sebuah platform untuk berbagi skill non-akademis melalui video. User dapat subscribe ke teacher favorit untuk mendapatkan update terbaru dan berdiskusi melalui kolom komentar.<br>

User dapat apply untuk menjadi teacher dengan mengisi form dan mengupload CV yang nantinya akan dikonfirmasi oleh admin (planned)<br>

User gratis memiliki banner iklan di halaman video dan di halaman browse (planned). <br>

Mengambil inspirasi dari SkillShare, Youtube, RuangGuru, Zenius. <br>

## Features

## Subscribe Teacher

`DONE` Subscribe bekerja seperti youtube. Teacher yang di subscribe akan muncul di subscription dalam browse.<br>
`WIP` Notifikasi untuk subscriber.<br>

## Video

`DONE` View video.<br>
`DONE` View video akan bertambah ketika page di load.<br>
`DONE` kolom komentar.<br>
`DONE` Notifikasi untuk teacher yang bersangkutan ketika ada user yang berkomentar di videonya.<br>
`DONE` Related videos berdasarkan kategori.<br>
`DONE` Free user hanya mendapat akses 3 video per kelas.<br>
`DONE` View video hanya akan bertambah jika user menghabiskan waktu setidaknya 1 menit di halaman video.<br>
`DONE` Penanda unik untuk komentar dari Teacher yang post video.<br>

## Home

`DONE` Menunjukkan preview card untuk tiap kategori.<br>
`DONE` Login modal ketika mencoba mengakses video sebelum melakukan login.<br>

## Browse

`DONE` Menunjukkan semua video.<br>
`DONE` Menunjukkan video-video teacher yang sudah di subscribe.<br>
`DONE` Menunjukkan video-video berdasarkan category.<br>
`DONE` Menunjukkan teacher-teacher.<br>
`DONE` Category menyesuaikan kategori video yang pernah diupload teacher.<br>
`DONE` Proper pagination<br>

## Profile Page

`DONE` Melihat video-video yang sudah telah di upload oleh user. (hanya ada di user dengan role teacher).<br>
`DONE` Melihat teacher-teacher yang di subscribe oleh user.<br>
`DONE` Tombol subscribe/unsubscribe pada profile page teacher.<br>
`DONE` Upload profile picture dengan mengklik DP user pada profile page.<br>
`DONE` pagination pada video dan subscribed teacher.<br>

## Upload Video

`DONE` upload video.<br>
`DONE` notifikasi untuk subscriber ketika melakukan upload.<br>

## Become a Teacher

`DONE` Form untuk user yang sudah register berisikan kontak, pengalaman, CV.<br>
`DONE` Notifikasi untuk admin.<br>

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

npm start akan menjalankan react-app dan juga server dengan bersamaan menggunakan concurrently

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `npm run build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify
