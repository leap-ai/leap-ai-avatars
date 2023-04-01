# generate mario 🥸

it's-a me, mario! this repo has everything you need to deploy a custom Leap AI model. here we go! ✨

let's get started by forking this repository (button top right), and downloading it to your computer. from there follow the below :)

### Setup

1. Add your credentials in `.env`, following the `.envExample` file
2. Head to `pages/index.tsx` for editing text, prompts, and colors to match your theme
3. Add new prompts in `helpers/prompts.ts`
4. Adjust the number of images generated w/ the numberOfImages parameter in `/pages/api/generate`

### Run it locally

1. Open the terminal
2. Run `npm install` to grab the necceary packages
3. Hit `npm run dev` to start your server on `http://localhost:3000`

### Bonus -- Train & use your own fine-tune

To use your own fine-tuned model:

1. Go to `tryleap.ai`, create a model, queue a training, and wait for it to finish OR follow steps in the Replit [here](https://replit.com/@leap-ai/AI-Avatars-App-Javascript-Harry-Potter-Professional?v=1)
2. Replace the model ID in `/pages/api/generate` to fit your new model you created
3. Replace @leapmario with your model keyword (ie. @me) in `helpers/prompts.ts`

### Deploy to the world

1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild

### Okey-dokey! You've got off localhost 👏

This is huge! You've got a custom model running on the web, and you can share it with the world. Now go ahead and generate some mario!

if you got value from this -- plz give us a star 🙂⭐

built w/ ❤️ by [aleem](https://twitter.com/aleemrehmtulla) & [alex](https://twitter.com/thealexshaq)
