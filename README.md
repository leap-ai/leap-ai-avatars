# generate potter 🧙

you're a coder harry. treat this repo as diagon alley, it has everything you need to deploy a custom LeapML model ✨

let's get started by forking this repository (button top right), and downloading it to your computer. from there follow the below :)

<b>NOTE: if you don't already have a trained model, head to `leapml.dev`</b>

### Setup
1. Head to `pages/index.tsx` for editing text, prompts, and colors to match your theme
2. Replace the model ID in `/pages/api/generate` to fit your new model you created on `leapml.dev`
3. Add your credentials in `.env`, following the `.envExample` file

### Run it locally
1. Open the terminal
2. Run `npm install` to grab the necceary packages
3. Hit `npm run dev` to start your server on `http://localhost:3000`

### Deploy to the world
1. Push all your changes to Github (or another git provider)
2. Head to vercel.app, import your repo, and hit deploy
3. Go to settings of the deployment, add your .env, and rebuild



