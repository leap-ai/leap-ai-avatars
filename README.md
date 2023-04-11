# leap ai avatars ⚡️

welcome! this repo has everything you need to have a working Ai Avatars product out-of-the-box built with Leap AI. here we go! ✨

let's get started by forking this repository (button top right), and downloading it to your computer. from there follow the below :)

### Run it locally

1. Open the terminal
2. Run `npm install` to grab the necceary packages
3. Hit `npm run dev` to start your server on `http://localhost:3000`

### How To Get AI Avatars

1. Upload 3-10 photos of yourself
2. Add your API Key from Leap AI
3. (Optional) add your model ID from Leap AI to use your existing models

### Making it your own

1. Head to `pages/index.tsx` for editing text, prompts, and colors to match your theme
2. Adjust prompts and subjectKeyword (ie. @me) in `helpers/prompts.ts`
3. Adjust the number of images generated w/ the numberOfImages parameter in `/pages/api/generate`

### Deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild

### You've got off localhost 👏

This is huge! You've got an AI Avatars app running on the web, and you can share it with the world.

if you got value from this -- plz give us a star 🙂⭐

built w/ ❤️ by [alex](https://twitter.com/thealexshaq) with [Leap AI](https://tryleap.ai)
