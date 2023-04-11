# leap ai avatars ⚡️

welcome! this repo has everything you need to have a working ai avatars product out-of-the-box built with Leap AI. here we go! ✨

try it out [here](https://ai-avatars.vercel.app/)!

let's get started by forking this repository (button top right), and downloading it to your computer. from there follow the below :)

### run it locally

1. Open the terminal
2. Run `npm install` to grab the neccesary packages
3. Hit `npm run dev` to start your server on `http://localhost:3000`

### how to get ai avatars

1. Upload 3-10 photos of yourself
2. Add your API Key from Leap AI
3. (Optional) add your model ID from Leap AI to use your existing models

### making it your own

1. Head to `pages/index.tsx` for editing text, prompts, and colors to match your theme
2. Adjust prompts and subjectKeyword (ie. @me) in `helpers/prompts.ts`
3. Adjust the number of images generated w/ the numberOfImages parameter in `/pages/api/generate`

### deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. note: you will need vercel pro plan or `/pages/api/generate` call will likely timeout after 10 sec. You can also deploy on [Zeet](https://zeet.co/) to avoid this issue.

### you've got off localhost 👏

This is huge! You've got an AI Avatars app running on the web, and you can share it with the world.

if you got value from this -- plz give us a star 🙂⭐

built w/ ❤️ by [alex](https://twitter.com/thealexshaq) with [Leap AI](https://tryleap.ai)
