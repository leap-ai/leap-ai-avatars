# Leap AI Avatars ⚡️

Welcome! Bookmark this repo as a starter template for a Headshots or Avatars app built on Leap AI.

It provides a UI for image upload, trains a custom model on Leap, and then generates images of your subject in various styles.

Try it out [here](https://ai-avatars.vercel.app/)!

Let's get started by forking this repository (button top right), and downloading it to your computer. from there follow the below :)

### Run it locally

1. Open the terminal
2. Run `npm install` to grab the necessary packages
3. Hit `npm run dev` to start your server on `http://localhost:3000`

### How to generate images

1. Upload 3-10 photos of yourself
2. Add your API Key from Leap AI
3. Add your model ID from Leap AI to use your existing models (Optional)

### Customizations

1. Head to `pages/index.tsx` for editing text, prompts, and colors to match your theme
2. Adjust prompts and subjectKeyword (ie. @me) in `helpers/prompts.ts`
3. Adjust the number of images generated w/ the numberOfImages parameter in `/pages/api/generate`

### Deployment

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Note: you will need vercel pro plan or `/pages/api/generate` call will likely timeout after 10 sec. You can also deploy on [Zeet](https://zeet.co/) to avoid this issue.

### Wrapping Up 👏

This is huge! You've got an AI Avatars app running on the web, and you can share it with the world.

If you got value from this -- please give us a star ⭐

Built with [Leap AI](https://tryleap.ai)
