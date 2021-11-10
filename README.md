# NamelessBot
NamelessMC Discord bot

## How do I contribute to the bot?
There are a few ways of contributing to the bot for non developers and for developers. Here are two:
- For non developers: You can head over to [NamelessMC/BotConfiguration](https://github.com/NamelessMC/BotConfiguration) and read the README.md for information on how to contribute there.
  - In that repository, you can add parameters to the `/support` command which is really helpful when it comes to providing support on common problems on the Discord.
- For developers: You can clone this repository to your computer and help make the bot better!
  - Note to developers: Please do not add useless commands to the bot that don't even have a reason (or useless commands with a reason.)
  - Be sure to keep the formatting style used elsewhere for example:
Don't do the following:
```
function thisReturnsTrue() : boolean
{
    return true;
}
```
We want to see the following format:
```
function thisReturnsTrue() : boolean {
    return true;
}
```

## Setting up

1. Clone this repository
2. Run `npm install` to install all dependencies
3. Once you finish coding, run `npx tsc` to build the bot
4. Run `npm run start` to run the compiled source

To make sure that the OCR system works, head to `https://github.com/tesseract-ocr/tessdata/raw/master/eng.traineddata` and download the english training data for Tesseract.JS to allow for image processing and extracting of text from it. Put this file in the same directory as the `package.json`