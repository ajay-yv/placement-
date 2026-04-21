# How to Deploy the Placement Prep Platform

You have several options to deploy your application. Since this is a Vite + React application, **Vercel** or **Netlify** are the best choices.

## Option 1: Vercel (Recommended - Easiest)

1.  **Create a Vercel Account**: Go to [vercel.com](https://vercel.com) and sign up (using GitHub is best).
2.  **Import Project**:
    *   Click **"Add New..."** -> **"Project"**.
    *   Select your GitHub repository `placement` (if you pushed your code to GitHub).
    *   **OR** if check if you have Vercel CLI installed:
        *   Open terminal in this folder.
        *   Run `npx vercel`.
        *   Follow the prompts (Hit Enter for defaults).
3.  **Deployment**: Vercel will automatically detect `vite` settings.
    *   Build Command: `npm run build`
    *   Output Directory: `dist`
4.  **Done!** required URL will be provided by Vercel.

## Option 2: Netlify (Drag & Drop - No Account needed for simple test)

1.  **Locate Build Folder**:
    *   I have already run `npm run build` for you.
    *   There is a `dist` folder in your project directory: `c:\Users\ajayy\OneDrive\Desktop\placement\dist`.
2.  **Upload**:
    *   Go to [app.netlify.com/drop](https://app.netlify.com/drop).
    *   Drag and drop the `dist` folder onto the page.
    *   It will be deployed instantly!

## Option 3: GitHub Pages

1.  **Update `vite.config.js`**:
    *   Add `base: '/your-repo-name/'` to the config.
2.  **Push to GitHub**:
    *   Commit all changes.
    *   Push to a GitHub repository.
3.  **Deploy**:
    *   Go to Repository Settings -> Pages.
    *   Select `gh-pages` branch (you might need to set up a workflow for this, Option 1 or 2 are much easier for Vite apps).

## Verification

After deployment, verify:
*   Router works (click links).
*   Dynamic features (Code Duel, Incident Sim) work.
